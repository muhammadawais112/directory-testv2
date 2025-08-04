"use client"
import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import localforage from "localforage";
import toast from "react-hot-toast";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { useUserInfo } from "../context/user";
import { useAgencyInfo } from "../context/agency";
import { useAppServices } from "../hook/services";

const SignUp = () => {
  const [user, Update] = useUserInfo();
  const [agency] = useAgencyInfo();
  const navigate = useRouter();
  const { agency_id } = useParams();
  const theme_content = agency?.theme_id?.theme_data;
  const [dndValue, setDndValue] = useState(false);
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const handlePhoneChange = (value) => {
    setPhone(value);

    if (!value) {
      setError("Phone number is required.");
    } else if (!isValidPhoneNumber(value)) {
      setError("Invalid phone number.");
    } else {
      setError("");
    }
  };

  const handleChange = (e) => {
    setDndValue(e.target.checked); // sets to true or false
  };
  const Service = useAppServices();
  let middleware = `/`;
  if (agency_id) {
    middleware = `/app/${agency_id}/`;
  }

  const handleRegister = async (e) => {
    e.preventDefault();
    const payload = {
      agency_id: agency?._id,
      email: e.target.email.value,
      first_name: e.target.first_name.value,
      last_name: e.target.last_name.value,
      phone,
      dndValue: dndValue,
      // name: e.target.name.value,
    };
    const { response, error } = await Service.auth.consumer_register({
      payload: payload,
    });
    if (response?.success) {
      localforage.setItem("user", { ...response.data });
      Update(response.data);
      toast.success("account created successfully");
      const LoginPayload = {
        email: response?.data?.email,
        password: response?.data?.password,
      };
      const { LoginRes } = await Service.auth.consumer_login({
        payload: LoginPayload,
      });
      if (LoginRes) {
        localforage.setItem("user", { ...LoginRes.data });
        Update(LoginRes.data);
      }
      navigate(`${middleware}profile`);
    } else {
      console.log(error, "error");
      toast.error(error?.message || "Error while creating account");
      navigate(`/register`);
    }
  };
  return (
    <div className="h-full w-full flex justify-center items-center py-16 bg-white">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <div className="flex flex-col items-center mb-6">
          <img
            alt="Directory logo"
            className="mb-2"
            height="50"
            width={200}
            src={
              theme_content?.general?.auth_logo ||
              "https://snapshotstore.fra1.digitaloceanspaces.com/Untitled%20design%20%287%29-83731"
            }
          />
        </div>
        <h2 className="text-xl font-semibold text-center mb-2 text-black">
          Create account
        </h2>
        <form className="space-y-4" onSubmit={handleRegister}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" for="first-name">
              First Name
            </label>
            <input
              className="w-full px-3 py-2 border rounded-lg"
              id="first-name"
              name="first_name"
              placeholder="Enter First Name"
              type="text"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" for="last-name">
              Last Name
            </label>
            <input
              className="w-full px-3 py-2 border rounded-lg"
              id="last-name"
              name="last_name"
              placeholder="Enter Last Name"
              type="text"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700" for="email">
              Email
            </label>
            <input
              className="w-full px-3 py-2 border rounded-lg"
              id="email"
              name="email"
              placeholder="Enter Email"
              type="email"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-1" htmlFor="phone">
              Phone Number
            </label>
            <PhoneInput
              id="phone"
              name="phone"
              international
              defaultCountry="US"
              value={phone}
              onChange={handlePhoneChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>

          <div className="flex flex-wrap -mx-3 mb-6 mt-5">
            <div className="w-full px-3">
              <div className="flex gap-5">
                {/* Smaller Switch */}
                <input
                  type="checkbox"
                  id="dndValue"
                  name="dndValue"
                  checked={dndValue}
                  onChange={handleChange}
                  required={!!phone}
                />
                <label className="text-gray-600 font-semibold text-[15px]">
                  By providing my phone number, I agree to receive text messages
                  from the business. Message frequency varies. Message and data
                  rates may apply. Text STOP to unsubscribe from messages at any
                  time.
                </label>
              </div>
            </div>
          </div>

          <button
            style={{
              background: theme_content?.general?.button_bg || "#EF4444",
              color: theme_content?.general?.button_text || "#fff",
            }}
            type="submit"
            className="w-full py-2 px-4 font-semibold rounded-md shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Create account
            <i className="fas fa-arrow-right ml-2"></i>
          </button>
        </form>
        {/* <div className="flex items-center my-6">
                <div className="flex-grow border-t border-gray-300">
                </div>
                <span className="mx-4 text-gray-500">
                    OR
                </span>
                <div className="flex-grow border-t border-gray-300">
                </div>
            </div>
            <div className="space-y-4">
                <button className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-gray-700 font-semibold hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                    <i className="fab fa-google mr-2">
                    </i>
                    Continue Google
                </button>
                <button className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-blue-600 text-white font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    <i className="fab fa-facebook-f mr-2">
                    </i>
                    Continue Facebook
                </button>
                <button className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-black text-white font-semibold hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                    <i className="fab fa-apple mr-2">
                    </i>
                    Continue Apple
                </button>
            </div> */}
      </div>
    </div>
  );
};

export default SignUp;
