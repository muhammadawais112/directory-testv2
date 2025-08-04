'use client';
import React, { useEffect, useState } from 'react';
// import { useAppServices } from '../../hook/services';
import { useAppServices } from '@/app/hook/services';
// import { useAgencyInfo } from '../../context/agency';
// import { useNavigate, useParams } from "react-router";
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
// import { useUserInfo } from '../../context/user';
// import Loader from '../../components/loader';
import Loader from '@/app/components/loader';
// import Pagination from '../../components/Pagination/Pagination';
import Pagination from '@/app/components/Pagination/Pagination';

// import sample from "../../assets/Home/sample.svg";
import sample from "@/app/assets/Home/sample.svg";

import { useAgencyInfo } from '../context/agency';
import { useUserInfo } from '../context/user';

const Jobs = () => {
    const Service = useAppServices();
    const [agency] = useAgencyInfo();
    const [loader, setLoader] = useState(true);
    const [jobsData, setJobsData] = useState([]);
    const router = useRouter();
    const theme_content = agency?.theme_id?.theme_data;
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3; // Show 3 items per page

    // Calculate pagination
    const totalItems = jobsData.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedBlogs = jobsData.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    {/*const { agency_id } = useParams();
    let middleware = `/`;
    if (agency_id) {
        middleware = `/app/${agency_id}/`;
    }*/}

    const getJobs = async () => {
        const { response } = await Service.jobs.Get({
            query: `agency_id=${agency._id}`,
        });
        setJobsData(response?.data || []);
        setLoader(false);
    };

    useEffect(() => {
        getJobs();
    }, []);

    const handleViewDetails = (job) => {

        window.scrollTo({
            top: 0,
            behavior: "smooth",
          });

        router.push(`/jobs/job-detail/${job?.slug}`);
    };

    return (
        <div className=" bg-gray-50 py-12">
            {loader ? (
                <div className="flex justify-center items-center h-screen">
                    <Loader />
                </div>
            ) : jobsData.length > 0 ? (
                <>
                    <div className='w-[90%] lg:w-[1170px] mx-auto'>
                        <div className='flex flex-col pb-12'>
                            <h1 className='text-4xl font-bold text-gray-900 mb-2'>
                                Jobs
                            </h1>
                            <p className='text-sm text-gray-500'>Home / Jobs</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {paginatedBlogs.map((job, index) => (
                                <div
                                    key={index}
                                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                                    onClick={() => handleViewDetails(job)}
                                    role="button"
                                    tabIndex={0}
                                    aria-label={`View details for ${job.title}`}
                                >
                                    <div className="relative h-48">
                                        <Image
                                            src={job?.image || sample}
                                            alt={job?.title}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.src = sample; // Fallback image
                                            }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                                        {job?.date && (
                                            <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-sm px-4 py-2 text-center">
                                                <p className="text-sm text-gray-600">{new Date(job.date).toLocaleString("en-US", { month: "short" })}</p>
                                                <span className="font-semibold text-gray-800">{new Date(job.date).getDate()}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-6">
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                                            {job?.title}
                                        </h3>
                                        <div className="space-y-2 text-gray-600">
                                            <p className="flex items-center">
                                                <i className="fas fa-map-marker-alt text-gray-500 mr-2"></i>
                                                {job?.location}
                                            </p>
                                            <p className="flex items-center">
                                                <i className="fa-solid fa-phone text-gray-500 mr-2"></i>
                                                {job?.phone}
                                            </p>
                                            <p className="flex items-center">
                                                <i className="fa-solid fa-envelope text-gray-500 mr-2"></i>
                                                {job?.email}
                                            </p>
                                            <p className="flex items-center">
                                                <i className="fa-solid fa-globe text-gray-500 mr-2"></i>
                                                {job?.website}
                                            </p>
                                        </div>

                                        <button
                                            onClick={() => handleViewDetails(job)}
                                            className="w-full mt-4 px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
                                            style={{
                                                background: theme_content?.general?.button_bg || "#EF4444",
                                                color: theme_content?.general?.button_text || "#fff",
                                            }}
                                        >
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="pt-12">
                                <Pagination
                                    currentPage={currentPage}
                                    totalItems={totalItems}
                                    itemsPerPage={itemsPerPage}
                                    onPageChange={handlePageChange}
                                />
                            </div>
                        )}
                    </div>
                </>
            ) : (
                <div className="flex flex-col items-center justify-center py-20">
                    <img
                        src="/empty-state.svg" // Add an illustration for empty state
                        alt="No jobs found"
                        className="w-48 h-48 mb-6"
                    />
                    <p className="text-xl text-gray-600">No Jobs Found</p>
                </div>
            )}
        </div>
    );
};

export default Jobs;