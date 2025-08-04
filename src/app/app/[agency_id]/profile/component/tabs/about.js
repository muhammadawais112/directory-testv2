import React from "react";

function AboutTab({ user }) {
  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow-sm">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">About</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Full Name */}
        <div className="  transition-shadow duration-300">
          <div className="flex items-center">
            <svg
              className="w-8 h-8 text-blue-500 mr-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <div>
              <p className="text-sm text-gray-500">Full Name</p>
              <p className="text-lg font-semibold text-gray-800">
                {user.first_name} {user.last_name}
              </p>
            </div>
          </div>
        </div>

        {/* Phone */}
        <div className="  transition-shadow duration-300">
          <div className="flex items-center">
            <svg
              className="w-8 h-8 text-green-500 mr-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="text-lg font-semibold text-gray-800">
                {user.phone || "No Phone Number Added"}
              </p>
            </div>
          </div>
        </div>

        {/* Business Name */}
        {/* <div className="  transition-shadow duration-300">
          <div className="flex items-center">
            <svg
              className="w-8 h-8 text-purple-500 mr-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            <div>
              <p className="text-sm text-gray-500">Business Name</p>
              <p className="text-lg font-semibold text-gray-800">
                {user.first_name}
              </p>
            </div>
          </div>
        </div> */}

        {/* Location */}
        <div className="  transition-shadow duration-300">
          <div className="flex items-center">
            <svg
              className="w-8 h-8 text-yellow-500 mr-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <div>
              <p className="text-sm text-gray-500">Location</p>
              <p className="text-lg font-semibold text-gray-800">
                {user.address?.trim()
                  ? `${user.address.trim()}, ${user.city?.trim() || ""}`
                  : user.city?.trim()
                  ? user.city.trim()
                  : "No Location Added"}
              </p>
            </div>
          </div>
        </div>

        {/* Email */}
        <div className="  transition-shadow duration-300">
          <div className="flex items-center">
            <svg
              className="w-8 h-8 text-red-500 mr-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="text-lg font-semibold text-gray-800">
                {user.email}
              </p>
            </div>
          </div>
        </div>

        {/* Plan Type */}
        <div className="  transition-shadow duration-300">
          <div className="flex items-center">
            <svg
              className="w-8 h-8 text-indigo-500 mr-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            <div>
              <p className="text-sm text-gray-500">Plan Type</p>
              <p className="text-lg font-semibold text-gray-800">
                {user.plan_type}
              </p>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="  transition-shadow duration-300">
          <div className="flex items-center">
            <svg
              className="w-8 h-8 text-pink-500 mr-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p className="text-lg font-semibold text-gray-800">
                {user.status}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutTab;
