"use client"
import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useAgencyInfo } from "../../../context/agency";
import { useAppServices } from "../../../hook/services";
import { useUserInfo } from "../../../context/user";
import Loader from "../../../components/loader";
import Image from "next/image";

const AppliedJobs = () => {
  const [agency] = useAgencyInfo();
  const location = useLocation();
  const AppService = useAppServices();
  const [applicants, setApplicants] = useState([]);
  const [jobData, setJobData] = useState([]);
  const params = useParams();
  const [loader, setLoader] = useState(true);
  const [user] = useUserInfo();

  const viewApplicants = async () => {
    try {
      setLoader(true);
      console.log(encodeURIComponent(user._id), "user_id");
      const { response } = await AppService.JobApplication.Get({
        query: `account_id=${encodeURIComponent(user._id)}`,
      });

      if (response) {
        setApplicants(response?.data || []);
        setJobData(response?.jobData || []);
      } else {
        console.error("No response received from API");
      }
    } catch (error) {
      console.error("Error fetching applied jobs:", error);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    viewApplicants();
  }, []);
  return (
    <div className="">
      {loader ? (
        <Loader />
      ) : jobData?.length > 0 ? (
        <div className="p-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-800 mb-4">
              Applied Jobs List
            </h1>
          </div>

          {/* Looping over Job Data */}
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {jobData?.length > 0 ? (
              jobData?.map((data, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                  role="button"
                  tabIndex={0}
                  aria-label={`View details for ${data?.job_id?.title}`}
                  onClick={() => {
                    // Add navigation or modal logic here
                  }}
                >
                  {/* Job Image */}
                  <div className="relative h-48">
                    {data?.job_id?.image ? (
                      <Image
                        src={data?.job_id.image}
                        alt={data?.job_id.title || "Job Image"}
                        className="w-full h-full object-cover rounded-t-lg"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/400x200"; // Fallback image
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 rounded-t-lg flex items-center justify-center text-gray-500">
                        No Image
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  </div>

                  {/* Job Details */}
                  <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">
                      {data?.job_id?.title || "No Title"}
                    </h2>

                    {/* Location */}
                    {data?.job_id?.location && (
                      <p className="text-gray-600 flex items-center mb-2">
                        <svg
                          className="w-5 h-5 text-gray-500 mr-2"
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
                        {data?.job_id?.location}
                      </p>
                    )}

                    {/* Applied Date */}
                    <p className="text-gray-500 text-sm flex items-center mb-4">
                      <svg
                        className="w-5 h-5 text-gray-500 mr-2"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      Applied on:{" "}
                      {new Date(data?.applied_at).toLocaleDateString()}
                    </p>

                    {/* Cover Letter */}
                    <p className="text-gray-600">
                      <strong className="text-gray-800">Cover Letter:</strong>{" "}
                      {data?.cover_letter || "No cover letter provided."}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-12">
                <Image
                  src="/empty-state.svg" // Add an illustration for empty state
                  alt="No applied jobs found"
                  className="w-48 h-48 mb-6"
                />
                <p className="text-xl text-gray-600 mb-2">
                  No Applied Jobs Found
                </p>
                <p className="text-gray-500 text-center max-w-md">
                  You havent applied to any jobs yet. Start exploring
                  opportunities and apply to your dream job!
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500 py-8">No Data found.</p>
      )}
    </div>
  );
};

export default AppliedJobs;
