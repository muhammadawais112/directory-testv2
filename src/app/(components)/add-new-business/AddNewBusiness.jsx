"use client"
import localforage from "localforage";
import { useState } from "react";
import Swal from "sweetalert2";
import Country from "country-state-city/lib/country";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { useRouter } from "next/navigation";
import { useAgencyInfo } from "@/app/context/agency";
import { uploadImageToGhl, useAppServices, useUploadImage } from "@/app/hook/services";
import { useUserInfo } from "@/app/context/user";

function AddNewBusiness() {
    const [agency] = useAgencyInfo();
    console.log("agencyData",agency)
    const [user, Update] = useUserInfo();
    const Service = useAppServices();
    const [claimData, setClaimData] = useState(null);
    const uploadImage = useUploadImage();
    const [loading, setLoading] = useState(false);
    const theme_content = agency?.theme_id?.theme_data;
    const navigate = useRouter();
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

    let middleware = `/`;
    if (agency?._id) {
        middleware = `/app/${agency?._id}/`;
    }

    const clamFormSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.target);
        const payload = Object.fromEntries(formData.entries());
        // const proofFile = formData.get("proof");
        const profile_image = formData.get("profile");

        try {
            // if (proofFile?.name) {
            //   // Upload proof image if provided
            //   const uploadResponse = await uploadImageToGhl(proofFile, agency);

            //   if (uploadResponse?.data) {
            //     payload.proof = uploadResponse.data;
            //   } else {
            //     throw new Error("Image upload failed");
            //   }
            // } else {
            //   delete payload.proof;
            // }

            if (profile_image?.name) {
                // Upload profile image if provided
                const uploadResponse = await uploadImageToGhl(profile_image, agency);
                if (uploadResponse?.data) {
                    payload.profile_image = uploadResponse.data;
                } else {
                    throw new Error("Image upload failed");
                }
            } else {
                delete payload.profile_image;
            }

            // Send claim request
            let claimResponse;
            let error;
            if (user?._id) {
                ({ response: claimResponse, error } =
                    await Service.claim_business.create({
                        payload,
                    }));
            } else {
                ({ response: claimResponse, error } =
                    await Service.login_claim_business.create({
                        payload,
                    }));

                if (claimResponse) {
                    // alert('jgy')
                    localforage.setItem("user", { ...claimResponse.userResult });
                    Update(claimResponse.userResult);
                }
            }
            if (claimResponse?.success) {
                Swal.fire({
                    icon: "success",
                    title: "New Business Request Sent",
                    text: "Your new business request has been sent successfully. We will review and get back to you soon.",
                }).then(() => {
                    setTimeout(() => {
                        navigate(`${middleware}plans`);
                    }, 1000);
                    // setClaimData(claimResponse.data);
                });
            } else {
                throw new Error(error?.message || "Failed to Add New Business");
            }
        } catch (error) {
            console.error("New Business form submission error:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error.message || "Something went wrong. Please try again.",
            });
        } finally {
            setLoading(false);
        }
    };

    const countries = Country.getAllCountries().map((country) => ({
        label: country.name,
        value: country.isoCode,
    }));
    return (
        <div className="bg-white">

            <main className="bg-white">
                <div className="container mx-auto bg-white overflow-hidden my-5 p-5">
                    <h1 className="capitalize text-2xl font-semibold text-gray-800 text-center py-4">
                        Add new business
                    </h1>

                    <form className="p-5 w-full" onSubmit={clamFormSubmit}>
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
                                    required
                                />
                                <input type="hidden" name="agency_id" value={agency._id} />
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
                                    required
                                />
                            </div>
                        </div>
                        <div className="flex flex-wrap -mx-3 mb-6">
                            <div className="w-full md:w-1/2 px-3">
                                <label
                                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                    htmlFor="grid-password"
                                >
                                    Business E-mail
                                </label>
                                <input
                                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                    id="grid-password"
                                    type="email"
                                    placeholder="Business email"
                                    name="email"
                                    required
                                />
                            </div>

                            {!user._id && (
                                <div className="w-full md:w-1/2 px-3">
                                    <label
                                        className="flex gap-2 uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                        htmlFor="grid-email"
                                    >
                                        Your Email
                                    </label>
                                    <input
                                        className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                        id="grid-email"
                                        type="your_email"
                                        placeholder="Your Email"
                                        name="your_email"
                                    />
                                </div>
                            )}
                            {/* phone */}
                            <div
                                className={`w-full ${user._id ? "md:w-1/2" : "w-full"} px-3`}
                            >
                                <label
                                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                    htmlFor="grid-password"
                                >
                                    Phone
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
                                    required
                                />
                            </div>
                            {/* <div className="w-full md:w-1/2 px-3">
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
                />
              </div> */}

                            {/* address */}
                            <div className="w-full md:w-1/2 px-3">
                                <label
                                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                    htmlFor="grid-password"
                                >
                                    Business Address
                                </label>
                                <input
                                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                    id="grid-password"
                                    type="text"
                                    placeholder="Business Address"
                                    name="address"
                                    required
                                />
                            </div>
                            <div className="w-full md:w-1/2 px-3">
                                <label
                                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                    htmlFor="grid-password"
                                >
                                    Business City
                                </label>
                                <input
                                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                    id="grid-password"
                                    type="text"
                                    placeholder="Business City"
                                    name="city"
                                    required
                                />
                            </div>
                            <div className="w-full md:w-1/2 px-3">
                                <label
                                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                    htmlFor="grid-password"
                                >
                                    Business State
                                </label>
                                <input
                                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                    id="grid-password"
                                    type="text"
                                    placeholder="Business State"
                                    name="state"
                                    required
                                />
                            </div>
                            <div className="w-full md:w-1/2 px-3">
                                <label
                                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                    htmlFor="country-select"
                                >
                                    Business Country
                                </label>
                                <select
                                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                    name="country"
                                >
                                    <option value="">Select a country</option>
                                    {countries.map((country) => (
                                        <option key={country.value} value={country.value}>
                                            {country.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="w-full md:w-1/2 px-3">
                                <label
                                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                    htmlFor="grid-password"
                                >
                                    Postal Code
                                </label>
                                <input
                                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                    id="grid-password"
                                    type="text"
                                    placeholder="Postal Code"
                                    name="postalCode"
                                    required
                                />
                            </div>
                        </div>

                        {/* Claim Details -> Your Role, Proof of Ownership/Authorization */}
                        <div className="flex flex-wrap -mx-3 mb-6">
                            <div className="w-full md:w-1/2 px-3 mb-6">
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
                                    <option>Owner</option>
                                    <option>Manager</option>
                                    <option>Employee</option>
                                    <option>Other</option>
                                </select>
                            </div>
                            {/* <div className="w-full md:w-1/2 px-3">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="proof"
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
              </div> */}

                            <div className="w-full md:w-1/2 px-3">
                                <label
                                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                    htmlFor="profile"
                                >
                                    Business Profile Image
                                </label>
                                <input
                                    type="file"
                                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                    id="grid-last-name"
                                    placeholder="Proof of Ownership/Authorization"
                                    name="profile"
                                />
                            </div>
                        </div>
                        <div className="flex flex-wrap -mx-3 mb-6">
                            <div className="w-full px-3">
                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                                    Acknowledgment
                                </label>
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        className="form-checkbox h-5 w-5 text-gray-600"
                                        id="remember"
                                    />
                                    <label className="ml-2 text-gray-700" for="remember">
                                        I acknowledge that I am the owner or authorized
                                        representative of this business and have the authority to
                                        claim this business.
                                    </label>
                                </div>
                            </div>
                        </div>
                        <input type="hidden" name="agency_id" value={agency?._id} />
                        <input type="hidden" name="account_id" value={user?.id} />
                        <input type="hidden" name="request_type" value="new" />
                        <hr />
                        <div className="flex flex-wrap -mx-3 mb-6 mt-2">
                            <div className="w-full px-3">
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        className="form-checkbox h-5 w-5 text-gray-600"
                                        id="dnd"
                                        name="dnd"
                                        required={!!phone}
                                    />
                                    <label className="ml-2 text-gray-700" for="dnd">
                                        By providing my phone number, I agree to receive text messages
                                        from the business. Message frequency varies. Message and
                                        data rates may apply. Text STOP to unsubscribe from messages
                                        at any time.
                                    </label>
                                </div>
                            </div>
                        </div>
                        <hr />
                        <div className="flex items-center justify-end mt-4">
                            <button
                                style={{
                                    background: theme_content?.general?.button_bg || "#EF4444",
                                    color: theme_content?.general?.button_text || "#fff",
                                }}
                                className="px-4 py-2 rounded-md text-sm transition"
                                disable={loading}
                                type="submit"
                            >
                                {loading ? "Loading..." : "Submit"}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}

export default AddNewBusiness;
