"use client";
import Modal from "@/app/components/popup";
import { useAgencyInfo } from "@/app/context/agency";
import { useAppServices, useUploadImage } from "@/app/hook/services";
import { useState } from "react";
import toast from 'react-hot-toast'

function EditProfile({ isOpen, onClose, user }) {
  const [agency] = useAgencyInfo();

  const uploadImage = useUploadImage();
  const Service = useAppServices();
  const [loading, setLoading] = useState(false);
  const theme_content = agency?.theme_id?.theme_data?.general;

  const profileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // serialize form data
    const formData = new FormData(e.target);
    const data = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });
    console.log(data.profile_image?.name);
    if (data?.profile_image?.name !== "") {
      let image_url = "";
      const { response } = await uploadImage({
        toaster: true,
        file: data.profile_image,
        desiredPath: "profile",
      });
      if (response) {
        // also update the user context
        image_url = response.data;
        user.profile_image = image_url;
      }
      data.profile_image = image_url;
    } else {
      delete data.profile_image;
    }

    updateUserAccount(data).then(() => {
      // user data update context
      user.first_name = data.first_name;
      user.last_name = data.last_name;
      user.email = data.email;
      user.business_name = data.business_name;
      user.phone = data.phone;
      user.country = data.country;
      user.address = data.address;
      user.city = data.city;
      user.zip_code = data.zip_code;

      setLoading(false);
      onClose();
    });
  };

  const updateUserAccount = async (data) => {
    const payload = {
      _id: user?.id,
      ...data,
    };

    const { response } = await Service.accounts.update({ payload });
    if (response) {
      console.log("User updated successfully");
      toast.success('Profile updated successfully')
    }
  };

  return (
    <Modal isOpen={isOpen} style={{width:"90%"}} title="Edit Profile" onClose={onClose}>
      <form onSubmit={profileSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profile Picture
            </label>
            <div className="flex flex-col md:flex-row items-center md:space-x-6 p-4 bg-gray-50 border border-gray-200 rounded-lg shadow-sm">
              <div className="relative group">
                <img
                  src={
                    user?.profile_image ||
                    "https://storage.googleapis.com/a1aa/image/9yoSNoTq1IJRjVg32oKHF28vC3N97ngxfp2quHLEChY.jpg"
                  }
                  alt="Profile Picture"
                  className="w-24 h-24 rounded-full border-2 border-blue-500 object-cover shadow-sm"
                  id="profileAvatar"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    className="text-white text-sm font-medium px-3 py-1 rounded-md bg-blue-600 hover:bg-blue-700 shadow"
                  >
                    Change
                  </button>
                </div>
              </div>

              <div className="mt-4 md:mt-0 flex-1">
                <p className="text-sm text-gray-600 mb-2">
                  Upload a new profile picture. PNG, JPG, or GIF. Max 2MB.
                </p>
                <label className="block">
                  <span className="sr-only">Choose profile photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
                    name="profile_image"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      const reader = new FileReader();
                      reader.onload = (e) => {
                        const profileAvatar =
                          document.getElementById("profileAvatar");
                        if (profileAvatar) {
                          profileAvatar.src = e.target.result;
                        }
                      };
                      reader.readAsDataURL(file);
                    }}
                  />
                </label>
              </div>
            </div>
          </div>

          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              First Name
            </label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              defaultValue={user?.first_name || ""}
              placeholder="Enter your full name"
              className="block w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Last Name
            </label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              defaultValue={user?.last_name || ""}
              placeholder="Enter your full name"
              className="block w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              defaultValue={user?.email || ""}
              placeholder="Enter your email"
              className="block w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* <div>
            <label
              for="business_name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Business Name
            </label>
            <input
              type="text"
              id="business_name"
              name="business_name"
              defaultValue={user?.business_name || ""}
              placeholder="Your business name"
              className="block w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div> */}

          <div>
            <label
              htmlFor="business_name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Your Phone
            </label>
            <input
              type="text"
              id="phone"
              name="phone"
              defaultValue={user?.phone || ""}
              placeholder="Your Phone"
              className="block w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="country"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Country
            </label>
            <input
              type="text"
              id="country"
              name="country"
              defaultValue={user?.country || ""}
              placeholder="Enter your country"
              className="block w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="col-span-1 md:col-span-2">
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Address
            </label>
            <input
              type="text"
              id="address"
              name="address"
              defaultValue={user?.address || ""}
              placeholder="Enter your address"
              className="block w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="city"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              City
            </label>
            <input
              type="text"
              id="city"
              name="city"
              defaultValue={user?.city || ""}
              placeholder="Enter your city"
              className="block w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="zip_code"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Zip Code
            </label>
            <input
              type="text"
              id="zip_code"
              name="zip_code"
              defaultValue={user?.zip_code || ""}
              placeholder="Enter your zip code"
              className="block w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          <button
            type="submit"
            className=" focus:ring-4  font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2  inline-flex items-center"
            disabled={loading}
            style={{
              background: theme_content?.button_bg || "#EF4444",
              color: theme_content?.button_text || "#fff",
              padding: "5px 10px",
              borderRadius: "4px",
            }}
          >
            {loading && (
              <svg
                aria-hidden="true"
                role="status"
                className="inline w-4 h-4 me-3 text-white animate-spin"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="#E5E7EB"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentColor"
                />
              </svg>
            )}
            Update
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default EditProfile;
