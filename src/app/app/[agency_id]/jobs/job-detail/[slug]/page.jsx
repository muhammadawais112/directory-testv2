'use client'
import React, { useEffect, useState } from 'react'
// import { useAppServices } from '../../../hook/services';
// import { useAgencyInfo } from '../../../context/agency';
// import { useUserInfo } from '../../../context/user';
import Image from 'next/image';

// import { useNavigate, useParams } from 'react-router';
import { useParams, useRouter } from 'next/navigation';
// import sample from "../../../assets/Home/sample.svg";
import sample from "@/app/assets/Home/sample.svg";
import toast from 'react-hot-toast';
import Pagination from '@/app/components/Pagination/Pagination';
import Loader from '@/app/components/loader';
import { useAppServices } from '@/app/hook/services';
import { useUserInfo } from '@/app/context/user';
import { useAgencyInfo } from '@/app/context/agency';
import { formatDate } from '@/app/utils/Helper';

const JobDetail = () => {
  const Service = useAppServices();
  const [agency] = useAgencyInfo();
  const [user] = useUserInfo();
  const [data, setData] = useState([]);
  const [loader, setLoader] = useState(true);
  const navigate = useRouter();
  const theme_content = agency?.theme_id?.theme_data;
  const { agency_id, slug } = useParams()
  let middleware = `/`
  if (agency_id) {

    middleware = `/app/${agency_id}/`
  }
  const [coverLetter, setCoverLetter] = useState("");
  const [job, setJob] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jobData, setJobData] = useState([]);
  const [jobsData, setJobsData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const totalItems = jobsData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBlogs = jobsData.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getJobsData = async (e) => {
    const { response } = await Service.jobs.Get({
      query: `agency_id=${agency._id}`,
    });
    setJobsData(response?.data);
    if (response) {
      setLoader(false);
    }
  };
  const getSingleJob = async (e) => {
    const { response } = await Service.jobs.GetSingleJob({
      query: `agency_id=${agency._id}&slug=${slug}`,
    });
    if (response) {
      setJob(response?.data);
    }
  };

  useEffect(() => {
    getJobsData();
    getSingleJob();
  }, [slug]);


  const getJobs = async () => {
    try {
      const { response } = await Service.JobApplication.Get();

      console.log(response, "response");

      if (response?.success) {
        setJobData(response.data || []);
      } else {
        console.error("Failed to fetch jobs:", response?.message);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoader(false);
    }
  };
  useEffect(() => {
    getJobs();
  }, []);

  if (!job) {
    return (
      <p className="text-center text-gray-500 py-8">No job data available.</p>
    );
  }

  const handleViewDetails = (job) => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    navigate.push(`${middleware}jobs/job-detail/${job?.slug}`);
  };

  const handleApplyForJob = async (job) => {
    if (!coverLetter.trim()) {
      return;
    }

    try {
      const { response } = await Service.JobApplication.create({
        payload: {
          job_id: job?._id,
          account_id: user?._id,
          agency_id: agency?._id,
          cover_letter: coverLetter,
        },
      });

      toast.success("Job application submitted.");
      if (response?.success) {
        setIsModalOpen(false);
        setCoverLetter("");
        await getJobs();
      } else {
      }
    } catch (error) {
      console.error("Error applying for job:", error);
    }
  };
  const chekJob = jobData.find((j) => j?.job_id === job?._id);

  const relatedBlogs = jobsData.filter(
    (job) => job?.title !== job?.title
  );

  console.log(job, 'job123')

  return (
    <div>
      {loader ? (
        <div className="flex justify-center items-center h-screen">
          <Loader />
        </div>
      ) : jobsData.length > 0 ? (
        <>
          <Image src={job?.image || sample} alt="banner" className='!w-full h-[500px] object-cover' width={100} />

          <div className='w-[90%] lg:w-[1170px] mx-auto py-[60px]'>
            <div className='w-full'>
              <div className="bg-white p-6 rounded-lg shadow w-full  my-8">
                <h1 className="text-xl font-bold mb-4">Listing Description</h1>
                <div
                  className="text-gray-700 mb-4"
                  dangerouslySetInnerHTML={{ __html: job?.description }}
                ></div>


                <h2 className="text-xl font-semibold mb-4">
                  {job?.title}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="font-semibold">
                      Address
                    </p>
                    <p>
                      {job?.location}
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold">
                      Email
                    </p>
                    <p>
                      {job?.email}
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold">
                      Phone
                    </p>
                    <p>
                      {job?.phone}
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold">
                      Website
                    </p>
                    <p>
                      {job?.website}
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold">
                      Job Post At
                    </p>
                    <p>
                      {formatDate(job?.createdAt)}
                    </p>
                  </div>


                </div>

                <div>
                  <button
                    style={{
                      background: theme_content?.general?.button_bg || "#EF4444",
                      color: theme_content?.general?.button_text || "#fff",
                    }}
                    onClick={() => user?._id ? setIsModalOpen(true) : navigate(`/login`)}
                    className="mb-8 px-4 py-2 rounded-md"
                    disabled={chekJob}
                  >
                    {chekJob
                      ? "Already Applied"
                      : user?._id
                        ? "Apply Now"
                        : "Login to Apply"}
                  </button>
                </div>
                {/* 
                <div className="relative">
                  <MapContainer height='400px' addresses={job?.location} />
                </div>*/}
              </div>

            </div>

          </div>

          <div className=' w-[90%] lg:w-[1170px] mx-auto pb-[60px]'>
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
                      width={100}
                      height={48}
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

          {isModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white max-w-[500px] min-w-[400px] rounded-md shadow-lg p-6 relative">
                <h2 className="text-xl font-bold mb-4">Apply for {job?.title}</h2>
                <textarea
                  className="w-full p-2 border rounded-md mb-4"
                  rows="5"
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Write your cover letter here..."
                ></textarea>
                <div className="flex justify-end gap-4">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleApplyForJob(job)}
                    className="px-4 py-2 bg-green-600 text-white rounded-md"
                    disabled={!coverLetter.trim()}
                  >
                    Submit Application
                  </button>
                </div>
              </div>
            </div>
          )}

        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-20">
          <Image
            src="/empty-state.svg" // Add an illustration for empty state
            alt="No jobs found"
            className="w-48 h-48 mb-6"
            width={48}
            height={48}
          />
          <p className="text-xl text-gray-600">No Jobs Found</p>
        </div>
      )}
    </div>
  )
}

export default JobDetail