"use client";
import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import profile from "@/app/assets/Blogs/main.png";
import { toast } from "react-hot-toast";
import { useAppServices } from "@/app/hook/services";
import { useAgencyInfo } from "@/app/context/agency";

const BusinessDetail = ({ data, handleRefresh, features }) => {
  const AppService = useAppServices();
  const [agency] = useAgencyInfo();
  const [loading, setLoading] = useState(false);
  // const [businessTypes, setBusinessTypes] = useState([]);
  // const [serviceTypes, setServiceTypes] = useState([]);
  const theme_content = agency?.theme_id?.theme_data;

  // const [selectedBusinessType, setSelectedBusinessType] = useState(
  //   data?.business_type
  //     ? { label: data.business_type.label, value: data.business_type.value }
  //     : null
  // );

  // const [selectedServiceType, setSelectedServiceType] = useState(
  //   data?.service_type
  //     ? { label: data.service_type.label, value: data.service_type.value }
  //     : null
  // );

  const businessDescFeature = features?.find(
    (feature) => feature.name === "Business Description"
  );
  const businessAddressFeature = features?.find(
    (feature) => feature.name === "Address"
  );
  const businessPhoneFeature = features?.find(
    (feature) => feature.name === "Phone"
  );
  const businessWebsiteFeature = features?.find(
    (feature) => feature.name === "Website"
  );
  const businessEmailFeature = features?.find(
    (feature) => feature.name === "Email Address"
  );

  const [currentFormData, setCurrentFormData] = useState({
    first_name: data?.first_name || "",
    city: data?.city || "",
    website: data?.website || "",
    country: data?.country || "",
    state: data?.state || "",
    zip_code: data?.zip_code || "",
    time_zone: data?.time_zone || "",
    description: data?.description || "",
    address: data?.address || "",
    // business_type: data?.business_type
    //   ? { label: data.business_type.label, value: data.business_type.value }
    //   : null,
    // service_type: data?.service_type
    //   ? { label: data.service_type.label, value: data.service_type.value }
    //   : null,
    profile_image: data?.profile_image || "",
    cover_image: data?.cover_image || "",
  });

  // const GetBusinessTypes = async () => {
  //   try {
  //     const { response } = await AppService.business_types.get_all_types();
  //     if (response) {
  //       const formattedBusinessTypes = response.data.map((item) => ({
  //         label: item.name,
  //         value: item._id,
  //       }));
  //       const formattedServiceTypes = response.service_types.map((item) => ({
  //         label: item.name,
  //         value: item._id,
  //       }));

  //       setBusinessTypes(formattedBusinessTypes);
  //       setServiceTypes(formattedServiceTypes);

  //       // Ensure currentFormData's business_type and service_type are valid
  //       setCurrentFormData((prevData) => ({
  //         ...prevData,
  //         business_type: prevData.business_type
  //           ? formattedBusinessTypes.find(
  //               (type) => type.value === prevData.business_type.value
  //             ) || null
  //           : null,
  //         service_type: prevData.service_type
  //           ? formattedServiceTypes.find(
  //               (type) => type.value === prevData.service_type.value
  //             ) || null
  //           : null,
  //       }));
  //     }
  //   } catch (error) {
  //     console.error("Error fetching business/service types:", error);
  //     // Optionally handle the error, e.g., set an error state
  //   }
  // };

  // useEffect(() => {
  //   GetBusinessTypes();
  // }, []);

  useEffect(() => {
    if (data) {
      setCurrentFormData({
        first_name: data.first_name || "",
        city: data.city || "",
        website: data.website || "",
        country: data.country || "",
        state: data.state || "",
        zip_code: data.zip_code || "",
        time_zone: data.time_zone || "",
        description: data.description || "",
        address: data.address || "",
        // business_type: data.business_type
        //   ? { label: data.business_type.label, value: data.business_type.value }
        //   : null,
        // service_type: data.service_type
        //   ? { label: data.service_type.label, value: data.service_type.value }
        //   : null,
        profile_image: data.profile_image || "",
        cover_image: data.cover_image || "",
      });
    }
  }, [data]);

  // const handleSelectChange = (selectedOption, name) => {
  //   setCurrentFormData((prevData) => ({
  //     ...prevData,
  //     [name]: selectedOption,
  //   }));
  // };

  const logoFieldsDisabled = features.find(
    (feature) => feature.name == "Company Logo" && feature.value == true
  )
    ? true
    : false;
  async function GetuploadImage(image_name, access_token) {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url:
        "https://services.leadconnectorhq.com/medias/files?type=file&query=" +
        image_name,
      headers: {
        Authorization: "Bearer " + access_token,
        Version: "2021-07-28",
      },
    };

    const response_data = await axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        return {
          success: true,
          data: response.data.files[0].url,
        };
      })
      .catch((error) => {
        console.log(error);
        return {
          success: false,
          data: error,
        };
      });
    return response_data;
  }
  async function uploadImageToGhl(image, access_token) {
    console.log(access_token, "access_token");
    const apiUrl = "https://services.leadconnectorhq.com/medias/upload-file";
    const formData = new FormData();

    // Generate a unique image name
    const imageName = `business_${Date.now()}`; // Example format

    formData.append("file", image);
    formData.append("name", imageName);
    // formData.append("hosted", ""); // Optional, adjust if needed
    // formData.append("fileUrl", ""); // Optional, adjust if needed

    const headers = {
      Authorization: `Bearer ${access_token}`,
      Version: "2021-07-28",
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
    };
    // Make the API request to upload the image to Go High Level Media
    const response_data = await axios
      .post(apiUrl, formData, { headers })
      .then((response) => {
        const imageUrl = response;
        console.log("Image uploaded to Go High Level Media. URL:", imageUrl);
        return {
          success: true,
          data: response.data,
        };
      })
      .catch((error) => {
        console.error("Error:", error);
        return {
          success: false,
          data: error,
        };
      });
    if (response_data.success) {
      const imageUrl = await GetuploadImage(imageName, access_token);
      console.log(imageUrl, "GetuploadImage");

      return {
        success: true,
        data: imageUrl.data,
      };
    } else {
      return {
        success: false,
        data: {},
      };
    }
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    let profile_image = data?.profile_image;
    let cover_image = data?.cover_image;
    console.log(e.target.cover_image?.files, "e.target.cover_image?.files");
    if (
      e.target.profile_image?.files &&
      e.target.profile_image?.files?.length
    ) {
      const image_response = await uploadImageToGhl(
        e.target.profile_image?.files[0],
        agency?.ghl?.access_token
      );
      if (image_response) {
        profile_image = image_response.data;
      }
    }
    if (e.target.cover_image?.files && e.target.cover_image?.files?.length) {
      const image_response = await uploadImageToGhl(
        e.target.cover_image?.files[0],
        agency?.ghl?.access_token
      );
      if (image_response) {
        cover_image = image_response.data;
      }
    }
    const payload = {
      _id: data.id,
      first_name:e.target.first_name ? e.target.first_name.value : data?.first_name || "",
      // business_name: e.target.business_name.value,
      city: e.target.city ? e.target.city.value : data?.city || "",
      website: e.target.website ? e.target.website.value : data?.website || "",
      country: e.target.country ? e.target.country.value : data?.country || "",
      state: e.target.state ? e.target.state.value : data?.state || "",
      zip_code: e.target.zip_code ? e.target.zip_code.value : data?.zip_code || "",
      time_zone: e.target.time_zone ? e.target.time_zone.value : data?.time_zone || "",
      description: e.target.description ? e.target.description.value : data?.description || "",
      address: e.target.address ? e.target.address.value : data?.address || "",
      // business_type: currentFormData.business_type,
      // service_type: currentFormData.service_type,
      profile_image: profile_image,
      cover_image: cover_image,
      email: e.target.email ? e.target.email.value : data?.email || "",
      phone: e.target.phone ? e.target.phone.value : data?.phone || "",
    };
    const { response, error } = await AppService.accounts.update({ payload });
    if (response?.success) {
      handleRefresh();
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
      }, 2000);
      toast.success(
        response?.message || "Business details updated successfully"
      );
    } else {
      toast.error(error?.message || "Failed to update business details");
    }
    document.querySelector('input[type="file"]').value = "";
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profile Picture
            </label>
            <div className="flex flex-col md:flex-row items-center md:space-x-6 p-4 bg-gray-50 border border-gray-200 rounded-lg shadow-sm">
              <div className="relative group">
                <img
                  src={data?.profile_image || profile}
                  alt="Profile Picture"
                  className="w-24 h-24 rounded-full border-2 border-blue-500 object-cover shadow-sm"
                  id="profile_image"
                />
              </div>

              <div className="mt-4 md:mt-0 flex-1">
                <p className="text-sm text-gray-600 mb-2">
                  Upload a new profile picture. PNG, JPG, or GIF. Max 2MB.
                </p>
                <label className="block">
                  <span className="sr-only">Choose profile photo</span>
                  <input
                    disabled={logoFieldsDisabled}
                    type="file"
                    accept="image/*"
                    className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
                    name="profile_image"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      const reader = new FileReader();
                      reader.onload = (e) => {
                        const profileAvatar =
                          document.getElementById("profile_image");
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
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cover Picture
            </label>
            <div className="flex flex-col md:flex-row items-center md:space-x-6 p-4 bg-gray-50 border border-gray-200 rounded-lg shadow-sm">
              <div className="relative group">
                <img
                  src={data?.cover_image || profile}
                  alt="Cover Picture"
                  className="w-24 h-24 rounded-full border-2 border-blue-500 object-cover shadow-sm"
                  id="cover_image"
                />
              </div>

              <div className="mt-4 md:mt-0 flex-1">
                <p className="text-sm text-gray-600 mb-2">
                  Upload a new profile picture. PNG, JPG, or GIF. Max 2MB.
                </p>
                <label className="block">
                  <span className="sr-only">Choose profile photo</span>
                  <input
                    disabled={logoFieldsDisabled}
                    type="file"
                    accept="image/*"
                    className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
                    name="cover_image"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      const reader = new FileReader();
                      reader.onload = (e) => {
                        const profileAvatar =
                          document.getElementById("cover_image");
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
              htmlFor="business_name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Business Name
            </label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              defaultValue={data?.first_name || ""}
              placeholder="Enter your business_name"
              className="block w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          {businessWebsiteFeature?.value && (
            <div>
              <label
                htmlFor="website"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Website
              </label>
              <input
                type="text"
                id="website"
                name="website"
                defaultValue={data?.website || ""}
                placeholder="Enter your website link"
                className="block w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          )}
          {businessAddressFeature?.value && (
            <>
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
                  defaultValue={data?.city || ""}
                  placeholder="Enter your city"
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
                  defaultValue={data?.country || ""}
                  placeholder="Enter your country"
                  className="block w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="state"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  State / Prov / Region
                </label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  defaultValue={data?.state || ""}
                  placeholder="Your State / Prov / Region"
                  className="block w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Street address
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  defaultValue={data?.address || ""}
                  placeholder="Your Street address"
                  className="block w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </>
          )}

          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Business Type
            </label>
            <Select
              value={
                businessTypes.find(
                  (option) =>
                    option.value === currentFormData.business_type?.value
                ) || null
              }
              onChange={(option) => handleSelectChange(option, "business_type")}
              options={businessTypes}
              placeholder="Select Business Type"
              name="business_type"
            />
          </div> */}

          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Service Type
            </label>
            <Select
              value={
                serviceTypes.find(
                  (option) =>
                    option.value === currentFormData.service_type?.value
                ) || null
              }
              onChange={(option) => handleSelectChange(option, "service_type")}
              options={serviceTypes}
              placeholder="Select Service Type"
              name="service_type"
            />
          </div> */}
          {businessEmailFeature?.value && (
            <div>
              <label
                htmlFor="zip_code"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                defaultValue={data?.email || ""}
                placeholder="Enter your business email"
                className="block w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          )}

          {businessPhoneFeature?.value && (
            <div>
              <label
                htmlFor="zip_code"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Phone Number
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                defaultValue={data?.phone || ""}
                placeholder="Enter your business email"
                className="block w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          )}

          <div>
            <label
              htmlFor="zip_code"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Zip / Postal code
            </label>
            <input
              type="text"
              id="zip_code"
              name="zip_code"
              defaultValue={data?.zip_code || ""}
              placeholder="Enter your Zip / Postal code"
              className="block w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="time_zone"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Time Zone
            </label>
            <input
              type="text"
              id="time_zone"
              name="time_zone"
              defaultValue={data?.time_zone || ""}
              placeholder="Enter your time_zone"
              className="block w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {businessDescFeature?.value && (
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Business Description
              </label>
              <input
                type="text"
                id="description"
                name="description"
                defaultValue={data?.description || ""}
                placeholder="Enter your Business Description"
                className="block w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          <button
            style={{
              background: theme_content?.general?.button_bg || "#EF4444",
              color: theme_content?.general?.button_text || "#fff",
            }}
            type="submit"
            className="text-white black focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2  inline-flex items-center"
            disabled={loading}
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
    </div>
  );
};

export default BusinessDetail;
