"use client";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
// import businessImage from "@/app/assets/Blogs/main.png";
import toast from "react-hot-toast";
import { Elements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useAgencyInfo } from "@/app/context/agency";
import { useAppServices, useUploadImage } from "@/app/hook/services";
import { useParams, useRouter } from "next/navigation";
import Modal from "@/app/components/popup";
import AddCard from "./components/AddCard";
import SubscriptionModelPopup from "./components";
import Image from "next/image";
import businessImage from "../../../../assets/Blogs/main.png"

function OwnedBusiness({ user }) {
  const [agency] = useAgencyInfo();
  const uploadImage = useUploadImage();
  const navigate = useRouter();
  const Service = useAppServices();
  const [businesses, setBusinesses] = useState([]);
  const [claimRequests, setClaimRequests] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [openUpgradeModel, setOpenUpgradeModel] = useState(false);
  const [openAssignModel, setOpenAssignModel] = useState(false);
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [yearlyPrice, setYearlyPrice] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [claimRequest, setClaimRequest] = useState({});
  const [selectedProduct, setSelectedProduct] = useState({});
  const [data, setData] = useState([]);
  const [selectedbusiness, setSelectedBusinessId] = useState("");
  const [InactivePlan, setInactivePlan] = useState([]);
  const { agency_id } = useParams();
  const stripePromise = loadStripe(agency?.stripe?.publish_key);
  let middleware = `/`;
  if (agency_id) {
    middleware = `/app/${agency_id}/`;
  }
  const theme_content = agency?.theme_id?.theme_data;
  const getOwned = async () => {
    setDataLoading(true);
    await Service.claim_business.GetOwnedBusiness({ query: `account_id=${user?.id}&status=approved` })
      .then((res) => {
        console.log(res, "res");
        setClaimRequests(res?.response?.data);
        setDataLoading(false);
      });
  };
  const onLoad = () => {
    // getBusinesses();
    getOwned();
  };
  const GetUserInactivePlans = async () => {
    const { response } = await Service.user_plans.Get({
      query: `user_id=${user?.id}&status=inactive`,
    });
    if (response) {
      setInactivePlan(response.data);
    }
  };
  useEffect(() => {
    GetUserInactivePlans();
  }, [user]);
  const GetAgencySaas = async () => {
    const { response } = await Service.saas.products({
      query: `agency_id=${agency._id}`,
    });
    if (response) {
      const sortedData = response.data.sort((a, b) =>
        a.is_free_saas ? -1 : 1
      );
      const filterPlan = sortedData.filter((item) => !item.is_free_saas);
      setData(filterPlan);
    }
  };

  useEffect(() => {
    onLoad();
    GetAgencySaas();
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

  const clamFormSubmit = (e) => {
    e.preventDefault();
    console.log(e.target);
    // sireliaze form data
    const formData = new FormData(e.target);
    const payload = {};
    for (var [key, value] of formData.entries()) {
      payload[key] = value;
    }
    console.log(payload.proof.name, "proof");

    if (payload.proof.name != "") {
      // upload proof image
      uploadImage({
        file: formData.get("proof"),
        desiredPath: "proof",
      }).then(({ response }) => {
        if (response) {
          payload.proof = response.data;
        }
      });
    } else {
      delete payload.proof;
    }

    Service.claim_business
      .update({
        payload,
      })
      .then(({ response }) => {
        if (response) {
          // update the card with the new data
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
      });
  };
  const handleBusinessDetails = (business) => {
    navigate.push(`${middleware}detail-page/${business?.business?.slug}`);
  };

  const FreePlan = async (id) => {
    const payload = {
      plan_id: id,
      _id: user?.id,
    };

    try {
      const { response } = await Service.accounts.update({ payload });

      if (response) {
        toast.success("Plan Subscribe Successfully");
      } else {
        console.log(
          "Failed to update the password. Please check your previous password."
        );
      }
    } catch (err) {
      console.log("An error occurred while updating the password.");
    }
  };

  const handleModel = () => {
    if (user && user.card_id) {
      setStep(3);
    } else {
      setStep(2);
    }
  };

  const handleCloseModel = () => {
    setOpenUpgradeModel(false);
    setStep(1);
  };
  const handleCloseAssignModel = () => {
    setOpenAssignModel(false);
    setSelectedBusinessId("");
  }

  const handleUpgradeClick = (business) => {
    if (business) {
      setOpenUpgradeModel(true);
      setSelectedBusinessId(business);
    } else {
      console.warn("No business_id received");
    }
  };
  const handleAssign = (business) => {
       if(business){
         setOpenAssignModel(true);
         setSelectedBusinessId(business);
       }else{
        console.warn("No business_id received");
       }
  }

  const handleUpdateAssignPlan = async (selectedbusiness, plan) => {
    if (!selectedbusiness || !plan) {
      toast.error("Please select a business and plan to assign.");
      return;
    }
  const payload = {
    _id:plan._id,
    business_id: selectedbusiness.business.id,
    plan_id: plan.plan_data.plan_id,
    price_id: plan.plan_data.price_id,
    subscription_id: plan.plan_data.subscription_id,
    status: "active",
    agency_id:agency?._id
  };
  
  const { response } = await Service.user_plans.AssignPlan({ payload });
  if (response) {
    toast.success("Plan assigned successfully");
    setOpenAssignModel(false);
    getOwned();
  } else {
    toast.error("Failed to assign plan");
  }
};


  console.log(claimRequests, "claimRequests");

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">
          Businesses List ({claimRequests.length})
        </h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
        {dataLoading ? (
          <div className="flex items-center justify-center h-40 w-full">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
          </div>
        ) : (
          <>
            {claimRequests?.map((business, index) => (
              <div className="bg-white shadow-md rounded-xl" key={index}>
                <div className="relative">
                  <div>
                    <Image
                      src={business?.business?.profile_image || businessImage}
                      alt="Profile Image"
                      className="w-full h-[300px] object-cover rounded-t-lg mb-4"
                      width={500}
                      height={220}
                    />
                  </div>
                </div>

                <div className="p-4">
                  {business?.business_tags?.map((tag, index) => (
                    <h3
                      key={index}
                      className="bg-white w-[123px] px-[15px] py-2 rounded-md border font-semibold mb-2"
                    >
                      {tag?.label}
                    </h3>
                  ))}

                  <div className="flex justify-between items-center">
                    <h1 className="text-xl font-bold text-gray-900">
                      {business?.business?.first_name}
                    </h1>
                  </div>

                  <div className="mt-4 space-y-3">
                    <p className="text-gray-600">
                      <strong className="text-gray-800">
                        Business Location:
                      </strong>{" "}
                      {business?.address}
                    </p>
                    {business?.email?.trim() && (
                      <p className="text-gray-600">
                        <strong className="text-gray-800">Email:</strong>{" "}
                        {business.email}
                      </p>
                    )}

                    <p className="text-gray-600">
                      <strong className="text-gray-800">Phone:</strong>{" "}
                      {business?.phone}
                    </p>
                    <p className="text-gray-600 capitalize">
                      <strong className="text-gray-800">Status:</strong>{" "}
                      <span
                        className={`px-2 py-1 text-sm rounded-full ${
                          business?.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : business?.status === "approved"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {business?.status}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex justify-end gap-2 m-4 pt-4 mt-4 border-t">
                  {business?.business?.plan_type === "free" &&
                    (InactivePlan?.length > 0 ? (
                      <button
                        style={{
                          background: "#007bff",
                          color: "#fff",
                        }}
                        className="px-4 py-2 rounded cursor-pointer text-center"
                        onClick={() => handleAssign(business)}
                      >
                        Assign Plan
                      </button>
                    ) : (
                      <button
                        style={{
                          background: "#ff0000",
                          color: "#fff",
                        }}
                        className="px-4 py-2 rounded cursor-pointer text-center"
                        onClick={() => handleUpgradeClick(business)}
                      >
                        Upgrade
                      </button>
                    ))}

                  <a
                    onClick={() => handleBusinessDetails(business)}
                    style={{
                      background:
                        theme_content?.general?.button_bg || "#7b06db",
                      color: theme_content?.general?.button_text || "#fff",
                    }}
                    className="px-4 py-2 rounded cursor-pointer text-center"
                  >
                    View
                  </a>
                  <a
                    onClick={() =>
                      navigate.push(`./profile/business/${business?.business_id}`)
                    }
                    style={{
                      background: "#1f2937",
                      color: "#fff",
                    }}
                    className="px-4 py-2 rounded cursor-pointer text-center"
                  >
                    Manage
                  </a>
                </div>
              </div>
            ))}
          </>
        )}
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
      <Modal
        isOpen={openUpgradeModel}
        size="w-150"
        onClose={handleCloseModel}
        title={
          step === 1
            ? "Choose Your Perfect Plan From Us"
            : step === 2
            ? "Add Card"
            : "Subscribe"
        }
      >
        <br />
        {step === 1 && (
          <>
            <div className="flex justify-center mt-4">
              <span
                className={`cursor-pointer px-4 py-2 ${
                  billingCycle === "monthly"
                    ? "text-blue-600 font-bold"
                    : "text-gray-500"
                }`}
                onClick={() => {
                  setBillingCycle("monthly");
                  setYearlyPrice(false);
                }}
              >
                Monthly
              </span>
              <span className="text-gray-400">|</span>
              <span
                className={`cursor-pointer px-4 py-2 ${
                  billingCycle === "yearly"
                    ? "text-blue-600 font-bold"
                    : "text-gray-500"
                }`}
                onClick={() => {
                  setBillingCycle("yearly");
                  setYearlyPrice(true);
                }}
              >
                Annually
              </span>
            </div>
            <div className="flex flex-col md:flex-row justify-center gap-8 mt-8">
              {data
                .filter((product) => {
                  // Only show enabled accounts
                  if (!product?.isenable_account) return false;

                  // Hide plans with no price for the selected billing cycle
                  const amount = yearlyPrice
                    ? product?.yearly_amount
                    : product?.monthly_amount;

                  // Convert to number for comparison
                  const numericAmount = parseInt(amount, 10);

                  // If not a free plan and the price is 0 or missing, skip
                  if (
                    !product.is_free_saas &&
                    (!numericAmount || numericAmount === 0)
                  ) {
                    return false;
                  }

                  return true;
                })
                .map((product, index) => (
                  <div
                    key={index}
                    className={`p-6 border rounded-lg w-80 text-center shadow-md ${
                      product?.product_name === "Professional"
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300"
                    }`}
                  >
                    <h3 className="text-lg font-semibold">
                      {product?.product_name}
                    </h3>
                    <p className="text-2xl font-bold mt-2">
                      {product?.is_free_saas
                        ? "FREE"
                        : `${
                            product.currency_symbol
                              ? product.currency_symbol
                              : "$"
                          }${
                            yearlyPrice
                              ? parseInt(product?.yearly_amount / 100)
                              : parseInt(product?.monthly_amount / 100)
                          }`}
                    </p>
                    <p className="text-gray-500 text-sm capitalize">
                      {billingCycle == "yearly" ? "Annually" : "Monthly"}
                    </p>

                    <ul className="mt-4 text-left px-6 space-y-2">
                      {/* {features
                        .filter((item) => item.value == true)
                        .map((feature, i) => (
                          <li key={i} className="flex items-center space-x-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              width="24"
                              height="24"
                              fill="none"
                              stroke="green"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M20 6L9 17l-5-5"></path>
                            </svg>
                            <span className="w-full text-center break-words overflow-hidden">
                              {feature.name}
                            </span>
                          </li>
                        ))} */}

                      {product.features.map((feature) => (
                        <li className="flex  items-center gap-3 border-b py-1">
                          {feature.value ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              width="24"
                              height="24"
                              fill="none"
                              stroke="green"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M20 6L9 17l-5-5" />
                            </svg>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              width="24"
                              height="24"
                              fill="none"
                              stroke="red"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M18 6L6 18M6 6l12 12" />
                            </svg>
                          )}

                          <span className="w-full text-center break-words overflow-hidden">
                            {feature.name}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {product.is_free_saas ? (
                      <div className="w-full flex justify-center">
                        <span
                          style={{
                            background:
                              theme_content?.general?.button_bg || "#EF4444",
                            color:
                              theme_content?.general?.button_text || "#fff",
                          }}
                          className="text-center py-2 rounded inline-block w-fit px-2 mt-2 cursor-pointer"
                          onClick={() => {
                            FreePlan(product._id);
                            navigate(`${middleware}register/business`);
                            window.scrollTo({
                              top: 0,
                              behavior: "smooth", // Smooth scrolling effect
                            });
                          }}
                        >
                          ADD YOUR BUSINESS
                        </span>
                      </div>
                    ) : (!yearlyPrice && user.plan_id === product.monthly_id) ||
                      (yearlyPrice && user.plan_id === product.yearly_id) ? (
                      <div className="w-full flex justify-center">
                        <a
                          style={{
                            background:
                              theme_content?.general?.button_bg || "#EF4444",
                            color:
                              theme_content?.general?.button_text || "#fff",
                          }}
                          className="text-center py-2 rounded inline-block w-[50%] opacity-70 cursor-pointer"
                        >
                          Subscribed
                        </a>
                      </div>
                    ) : (
                      <a
                        onClick={() => {
                          setSelectedProduct(product);
                          // if (user?.email) {
                          if (
                            product?.monthly_amount === "0" &&
                            product?.yearly_amount === "0"
                          ) {
                            navigate(`${middleware}register/business`);
                          } else {
                            handleModel();
                          }
                          // } else {
                          //   navigate(`${middleware}login`)
                          // }
                        }}
                        style={{
                          background:
                            theme_content?.general?.button_bg || "#EF4444",
                          color: theme_content?.general?.button_text || "#fff",
                        }}
                        className="text-center !w-fit px-2 py-2 min-w-[50%] rounded cursor-pointer inline-block mt-2"
                      >
                        {product?.is_free_saas
                          ? "ADD YOUR BUSINESS"
                          : "Buy Now"}
                      </a>
                    )}
                  </div>
                ))}
            </div>
          </>
        )}
        {step === 2 && (
          <Elements stripe={stripePromise}>
            <AddCard
              product={selectedProduct}
              setStep={setStep}
              step={step}
              setOpenUpgradeModel={setOpenUpgradeModel}
            />
          </Elements>
        )}
        {step === 3 && (
          <SubscriptionModelPopup
            product={selectedProduct}
            yearlyPrice={yearlyPrice}
            selectedbusiness={selectedbusiness}
            setOpenUpgradeModel={setOpenUpgradeModel}
          />
        )}
      </Modal>
      {/* <Modal
        isOpen={openAssignModel}
        size="w-300"
        onClose={handleCloseAssignModel}
        title="Assign Your Inactive Plan to this Business"
      >
        <br />
             <div className="flex flex-col gap-4">
        {InactivePlan?.length > 0 ? (
          InactivePlan?.map((plan, index) => (
            <div
              key={index}
              className="p-4 border rounded-lg shadow-md flex justify-between items-center"
            >
              <div>
                <h3 className="text-lg font-semibold">
                  {plan?.AgencySaas?.product_name}
                </h3>
                <h3 className="text-sm font-light">
                  {plan?.status}
                </h3>
                <p className="text-gray-500">
                  {plan?.price_id === plan?.AgencySaas?.monthly_id
                    ? `$${parseInt(plan?.AgencySaas?.yearly_amount / 100)} Annually`
                    : `$${parseInt(plan?.AgencySaas?.monthly_amount / 100)} Monthly`}
                </p>
              </div>
              <button
                onClick={() =>  handleUpdateAssignPlan(selectedbusiness, plan)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Assign
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No inactive plans available.</p>
        )}
             </div>
      </Modal> */}
      <Modal
  isOpen={openAssignModel}
  size={200}
  onClose={handleCloseAssignModel}
  title="Assign Your Inactive Plan to this Business"
>
  <div className="w-[700px] p-4">
    {InactivePlan?.length > 0 ? (
      <div className="flex flex-col gap-4">
        {InactivePlan.map((plan, index) => (
          <div
            key={index}
            className="p-4 border border-gray-200 rounded-lg shadow-sm flex justify-between items-center bg-white"
          >
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                {plan?.AgencySaas?.product_name}
              </h3>
              <h3 className="text-sm text-gray-400">{plan?.status}</h3>
              <p className="text-gray-600 mt-1">
                {plan?.price_id === plan?.AgencySaas?.monthly_id
                  ? `$${parseInt(plan?.AgencySaas?.monthly_amount / 100)} Monthly`
                  : `$${parseInt(plan?.AgencySaas?.yearly_amount / 100)} Annually`}
              </p>
            </div>
            <button
              onClick={() => handleUpdateAssignPlan(selectedbusiness, plan)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Assign
            </button>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-gray-500">No inactive plans available.</p>
    )}
  </div>
</Modal>

    </div>
  );
}

export default OwnedBusiness;
