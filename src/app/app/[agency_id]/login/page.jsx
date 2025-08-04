"use client"
import React, { useState } from 'react'
import localforage from 'localforage';
import { useParams, useRouter } from "next/navigation";
import { useUserInfo } from '@/app/context/user';
import { useAppServices } from '@/app/hook/services';
import { useAgencyInfo } from '@/app/context/agency'
import ForgotPassword from '@/app/Auth/components/Models/ForgotPassword';

const SignIn = () => {
    const [user, Update] = useUserInfo();
    const [agency] = useAgencyInfo();
    const navigate = useRouter();
    const Service = useAppServices();
    const [errorMsg, setErrorMsg] = useState();
    const [isOpenPassword, setIsOpenPassword] = useState(false);
    const { agency_id } = useParams();
    const theme_content = agency?.theme_id?.theme_data;

    let middleware = `/`;
    if (agency_id) {
        middleware = `/app/${agency_id}/`;
    }
    const handleLogin = async (e) => {
        e.preventDefault();
        const payload = {
            email: e.target.email.value,
            password: e.target.password.value,
        };
        const { response } = await Service.auth.consumer_login({
            payload: payload,
        });

        if (response) {
            localforage.setItem("user", { ...response.data });
            Update(response.data);
            navigate(`${middleware}profile`);
        } else {
            setErrorMsg("Invalid email or password");
        }
    };
    return (
        <div className='h-full w-full flex justify-center items-center py-16'><div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
            <div className="flex items-center justify-center mb-6">
                <img alt="Directory logo" height="50" width={200} src={theme_content?.general?.auth_logo || 'https://snapshotstore.fra1.digitaloceanspaces.com/Untitled%20design%20%287%29-83731'} />
            </div>
            <h2 className="text-2xl font-semibold text-center mb-2">
                Sign in
            </h2>
            {/* <p className="text-center text-gray-600 mb-6">
                Sign in with this account across the following sites.
            </p> */}
            <form onSubmit={handleLogin}>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2" for="email">
                        Email
                    </label>
                    <input name="email" className="w-full px-3 py-2 border rounded-lg" id="email" placeholder="Enter Email" type="email" />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2" for="password">
                        Password
                    </label>
                    <input name="password" className="w-full px-3 py-2 border rounded-lg" id="password" placeholder="Enter Password" type="password" />
                </div>

                {errorMsg && (
                    <div className="p-2 rounded w-full bg-red-200 text-red-500">
                        <p>{errorMsg}</p>
                    </div>
                )}

                <div className="flex items-center justify-between mb-6">
                    <label className="flex items-center">
                        {/* <input className="form-checkbox" type="checkbox" />
                        <span className="ml-2 text-gray-700">
                            Remember me
                        </span> */}
                    </label>
                    <a className="text-sm text-gray-600" href="#" onClick={() => setIsOpenPassword(true)}>
                        Forgot Password
                    </a>
                </div>
                <button style={{
                    background: theme_content?.general?.button_bg || "#EF4444",
                    color: theme_content?.general?.button_text || "#fff",
                }} type='submit' className="w-full py-2 rounded-lg flex items-center justify-center mb-4">
                    Sign in
                    <i className="fas fa-arrow-right ml-2">
                    </i>
                </button>
            </form>
            <p className="text-center text-gray-600 mt-6">
                Not signed up?
                <span className="text-black font-semibold ml-1" onClick={() => navigate("/register")} >
                    Create an account.
                </span>
            </p>
            {/* <div className="flex items-center justify-center mb-4">
                <hr className="w-full border-gray-300" />
                <span className="px-2 text-gray-600">
                    OR
                </span>
                <hr className="w-full border-gray-300" />
            </div>
            <button className="w-full bg-white border border-gray-300 text-gray-700 py-2 rounded-lg flex items-center justify-center mb-4">
                <i className="fab fa-google mr-2">
                </i>
                Continue Google
            </button>
            <button className="w-full bg-blue-600 text-white py-2 rounded-lg flex items-center justify-center mb-4">
                <i className="fab fa-facebook-f mr-2">
                </i>
                Continue Facebook
            </button>
            <button className="w-full bg-black text-white py-2 rounded-lg flex items-center justify-center mb-4">
                <i className="fab fa-apple mr-2">
                </i>
                Continue Apple
            </button>
            <p className="text-center text-gray-600">
                Not signed up?
                <a className="text-blue-600" href="#">
                    Create an account.
                </a>
            </p> */}
        </div>
            <ForgotPassword
                isOpen={isOpenPassword}
                onClose={() => setIsOpenPassword(false)}
            />
        </div>
    )
}

export default SignIn