"use client";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import businessImage from "@/app/assets/Blogs/main.png";
import Modal from "@/app/components/popup";
import { useAppServices, useUploadImage } from "@/app/hook/services";
import { useAgencyInfo } from "@/app/context/agency";
import Image from "next/image";

function ClaimRequest({ user }) {
  const [agency] = useAgencyInfo();
  const uploadImage = useUploadImage();

  const Service = useAppServices();
  const [claimRequests, setClaimRequests] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [claimRequest, setClaimRequest] = useState({});

  useEffect(() => {
    Service.claim_business
      .Get({ query: `account_id=${user?.id}&status=pending` })
      .then((res) => {
        console.log(res, "claim res");
        setClaimRequests(res?.response?.data);
      });
  }, []);

  const withdrawRequest = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to withdraw the claim request",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, withdraw it!",
    }).then((result) => {
      if (result.isConfirmed) {
        const payload = {
          status: "withdraw",
          _id: id,
        };

        Service.claim_business
          .update({ payload })
          .then((res) => {
            console.log(res, "res");
            setClaimRequests(
              claimRequests.filter((request) => request._id !== id)
            );
          })
          .then(() => {
            Swal.fire("Deleted!", "Your file has been deleted.", "success");
          })
          .catch((err) => {
            console.log(err, "err");
          });
      }
    });
  };

  const editRequest = (request) => {
    setOpenModal(true);
    setClaimRequest(request);
  };

  const clamFormSubmit = async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const payload = {};

  for (let [key, value] of formData.entries()) {
    payload[key] = value;
  }

  try {
    // Handle proof image upload if exists
    const proofFile = formData.get("proof");

    if (proofFile && proofFile.name !== "") {
      const { response } = await uploadImage({
        file: proofFile,
        desiredPath: "proof",
      });

      if (response && response.data) {
        payload.proof = response.data; // Set the image URL/path here
      } else {
        console.error("Failed to upload proof image.");
        return;
      }
    } else {
      delete payload.proof;
    }

    // Now proceed to update the claim with image URL
    const { response } = await Service.claim_business.update({ payload });

    if (response) {
      const updatedClaimRequests = claimRequests.map((request) => {
        if (request._id === payload._id) {
          return payload;
        }
        return request;
      });

      setClaimRequests(updatedClaimRequests);
      setOpenModal(false);
      Swal.fire({
        icon: "success",
        title: "Claim Request Updated",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  } catch (err) {
    console.error("Error processing claim form:", err);
    Swal.fire({
      icon: "error",
      title: "Something went wrong!",
      text: "Please try again later.",
    });
  }
};

  console.log(claimRequests, "claimRequests");
  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">
          Claim Requests
        </h1>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {claimRequests.map((request, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <div className="p-6">
              <div>
                <Image
                  src={request?.profile_image || request?.business_ref_id?.profile_image || businessImage}
                  alt="Profile Image"
                  className="w-full h-[300px] object-cover rounded-lg mb-4"
                  width={500}
                  height={220}
                />
              </div>

              {/* Header with Name and Buttons */}
              <div className="flex justify-between items-center">
                <h1 className="text-xl font-bold text-gray-900">
                  {request?.business_name}
                </h1>
                <div className="flex space-x-2">
                  <button
                    onClick={() => withdrawRequest(request._id)}
                    className="px-3 py-1 text-sm font-semibold text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors duration-200"
                  >
                    Withdraw
                  </button>
                  <button
                    onClick={() => editRequest(request)}
                    className="px-3 py-1 text-sm font-semibold text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors duration-200"
                  >
                    Edit
                  </button>
                </div>
              </div>

              {/* Details Section */}
              <div className="mt-4 space-y-3">
                <p className="text-gray-600">
                  <strong className="text-gray-800">Business Location:</strong>{" "}
                  {request?.address}
                </p>
                {request?.email?.trim() && (
                  <p className="text-gray-600">
                    <strong className="text-gray-800">Email:</strong>{" "}
                    {request.email}
                  </p>
                )}

                <p className="text-gray-600">
                  <strong className="text-gray-800">Phone:</strong>{" "}
                  {request?.phone}
                </p>
                <p className="text-gray-600 capitalize">
                  <strong className="text-gray-800">Status:</strong>{" "}
                  <span
                    className={`px-2 py-1 text-sm rounded-full ${
                      request?.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : request?.status === "approved"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {request?.status}
                  </span>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={openModal}
        size="w-100"
        onClose={() => setOpenModal(false)}
        title="Edit Claim Request"
      >
        <br />
        <form className="w-full" onSubmit={clamFormSubmit}>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="grid-first-name"
              >
                First Name
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                id="grid-first-name"
                type="text"
                placeholder="Jane"
                name="first_name"
                defaultValue={claimRequest?.first_name}
              />
            </div>
            <div className="w-full md:w-1/2 px-3">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="grid-last-name"
              >
                Last Name
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="grid-last-name"
                type="text"
                placeholder="Doe"
                name="last_name"
                defaultValue={claimRequest?.last_name}
              />
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full md:w-1/2 px-3">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="grid-password"
              >
                E-mail
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="grid-password"
                type="email"
                placeholder="email"
                name="email"
                defaultValue={claimRequest?.email}
              />
            </div>
            {/* phone */}
            <div className="w-full md:w-1/2 px-3">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="grid-password"
              >
                Phone
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="grid-password"
                type="text"
                placeholder="phone"
                name="phone"
                defaultValue={claimRequest?.phone}
              />
            </div>
          </div>
          {/* Business Information */}
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="grid-first-name"
              >
                Business Name
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                id="grid-first-name"
                type="text"
                placeholder="Business Name"
                name="business_name"
                defaultValue={claimRequest?.first_name}
              />
            </div>
            <div className="w-full md:w-1/2 px-3">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="grid-last-name"
              >
                Business Reference
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="grid-last-name"
                type="text"
                placeholder="Business Reference"
                name="business_reference"
                defaultValue={claimRequest?.business_reference}
              />
            </div>

            {/* address */}
            <div className="w-full px-3 my-6">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="grid-password"
              >
                Address
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="grid-password"
                type="text"
                placeholder="Address"
                name="address"
                defaultValue={claimRequest?.address}
              />
            </div>
          </div>

          {/* Claim Details -> Your Role, Proof of Ownership/Authorization */}
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="grid-first-name"
              >
                Your Role
              </label>
              <select
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                id="grid-first-name"
                type="text"
                placeholder="Your Role"
                name="role"
              >
                <option
                  selected={claimRequest?.role === "Owner" ? "selected" : ""}
                >
                  Owner
                </option>
                <option
                  selected={claimRequest?.role === "Manager" ? "selected" : ""}
                >
                  Manager
                </option>
                <option
                  selected={claimRequest?.role === "Employee" ? "selected" : ""}
                >
                  Employee
                </option>
                <option
                  selected={claimRequest?.role === "Other" ? "selected" : ""}
                >
                  Other
                </option>
              </select>
            </div>
            <div className="w-full md:w-1/2 px-3">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="grid-last-name"
              >
                Proof of Ownership/Authorization
              </label>
              <input
                type="file"
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="grid-last-name"
                placeholder="Proof of Ownership/Authorization"
                name="proof"
              />
            </div>
          </div>
          <input type="hidden" name="agency_id" value={agency?._id} />
          <input type="hidden" name="account_id" value={user?.id} />
          <input type="hidden" name="_id" value={claimRequest?._id} />
          <hr />
          {/* Submit Button */}
          <div className="flex items-center justify-end mt-4">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Resubmit
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default ClaimRequest;
