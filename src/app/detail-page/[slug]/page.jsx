"use client"
import React, { useEffect, useState } from "react";
import AwesomeListing from "./AwesomeListing";
import PhotosSection from "./PhotosSection";
import { useRouter, useParams } from "next/navigation";
import { useAppServices, useUploadImage } from "../../hook/services";
import { useUserInfo } from "../../context/user";
import { useAgencyInfo } from "../../context/agency";
import Listing from "./Listing";
import Modal from "../../component/popup";
import toast from "react-hot-toast";

const DetailPage = () => {
  const navigate = useRouter();
  const Service = useAppServices();
  // image upload
  const uploadImage = useUploadImage();
  const [user, , , planData] = useUserInfo();
  const { slug } = useParams();
  const [business, setBusiness] = useState({});
  const [tags, setTags] = useState([]);
  const [loader, setLoader] = useState(true);
  const [followStatus, setFollowStatus] = useState(false);
  const [followData, setFollowData] = useState({});
  const [agency] = useAgencyInfo();
  const [openModal, setOpenModal] = useState(false);
  const [claimData, setClaimData] = useState({});
  const theme_content = agency?.theme_id?.theme_data;
  const socialLinks = theme_content?.general;
  const themeContentObject = theme_content?.content || "black";
  const [blogsData, setBlogsData] = useState([]);
  const [eventsData, setEventsData] = useState([]);
  const [jobsData, setJobsData] = useState([]);
  const [newsFeedsData, setNewsFeedsData] = useState([]);

  const getBlogs = async (_id) => {
    const { response } = await Service.blogs.Get({
      query: `account_id=${_id}`,
    });
    if (response) {
      setBlogsData(response.data);
    }
  };

  const getEvents = async (_id) => {
    const { response } = await Service.events.Get({
      query: `account_id=${_id}`,
    });
    if (response) {
      setEventsData(response.data);
    }
  };

  const getJobs = async (_id) => {
    const { response } = await Service.jobs.Get({
      query: `account_id=${_id}`,
    });
    if (response) {
      setJobsData(response?.data);
    }
  };

  const getNewsFeeds = async (_id) => {
    const { response } = await Service.newsFeed.Get({
      query: `account_id=${_id}`,
    });
    if (response) {
      setNewsFeedsData(response?.data);
    }
  };

  const getBusiness = async () => {
    const { response } = await Service.accounts.getSingleBusiness({
      query: `slug=${slug}`,
    });
    if (!response) return setLoader(false);
    setBusiness(response?.data);
    // getBlogs(response?.data._id);
    // getEvents(response?.data._id);
    // getJobs(response?.data._id);
    // getNewsFeeds(response?.data._id);
    if (response?.data?.tags?.length) {
      setTags(response?.data?.business_tags);
    }
    return setLoader(false);
  };

  const getClaimeBusiness = async () => {
    const { response } = await Service.claim_business.Get({
      query: `business_id=${business?.id}&account_id=${user?.id}&agency_id=${agency?._id}`,
    });
    if (response) {
      console.log(response, "response claim")
      setClaimData(response?.data[0]);
    }
  };
  useEffect(() => {
    getClaimeBusiness();
  },[business])

  const onLoad = () => {
    getBusiness();
  };

  const followFunction = async () => {
    const payload = {
      business_id: business?.id,
      business_ref_id: business?._id,
      account_id: user?.id,
      account_ref_id: user?._id,
      agency_id: agency?._id,
    };
    const { response } = await Service.followBusiness.create({
      payload,
    });
    console.log(response);
    if (response) {
      setFollowStatus(true);
    }
  };

  useEffect(onLoad, [slug]);

  useEffect(() => {
    if (user?.id) {
      Service.followBusiness
        .Get({
          query: `business_id=${business?.id}&account_id=${user?.id}`,
        })
        .then(({ response }) => {
          if (response?.data?.length) {
            setFollowStatus(true);
            setFollowData(response?.data[0]);
          }
        });
    }
  }, [business]);

  const unFollowFunction = async () => {
    const { response } = await Service.followBusiness.Delete({
      query: `_id=${followData?._id}`,
    });
    if (response) {
      setFollowStatus(false);
    }
  };

  // claim form
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
          payload.proof = response?.data;

          Service.claim_business
            .create({
              payload,
            })
            .then(({ response }) => {
              console.log(response, "response");
              if (response) {
                setClaimData(response?.data);
                toast.success("Claim request send successfully");
                setOpenModal(false);
              }
            });
        }
      });
    } else {
      delete payload.proof;
      Service.claim_business
        .create({
          payload,
        })
        .then(({ response }) => {
          console.log(response, "response");
          if (response) {
            setClaimData(response?.data);
            setOpenModal(false);
          }
        });
    }
  };

  // const { pathname } = useLocation();

  // useEffect(() => {
  //   window.scrollTo({
  //     top: 0,
  //     left: 0,
  //     behavior: "smooth", // for smooth scrolling, use 'auto' for instant jump
  //   });
  // }, [pathname]);
  
  return (
    <>
      <div className="bg-white">
      <div className=" w-[96%] mx-auto ">
        <AwesomeListing business={business} user={user} followStatus={followStatus} navigate={navigate} followFunction={followFunction} unFollowFunction={unFollowFunction} theme_content={theme_content} />
      </div>

      <div className=" w-[96%] mx-auto py-[10px]">
        <PhotosSection business={business} />
      </div>

      <div className=" w-[96%] mx-auto py-[10px]">
        <Listing socialLinks={socialLinks} setClaimData={setClaimData} claimData={claimData} setOpenModal={setOpenModal} business={business} user={user} followStatus={followStatus} navigate={navigate} followFunction={followFunction} unFollowFunction={unFollowFunction} theme_content={theme_content} />
      </div>

      
      <Modal
            isOpen={openModal}
            size="w-100"
            onClose={() => setOpenModal(false)}
            title="Claim this business"
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
                    <option>Owner</option>
                    <option>Manager</option>
                    <option>Employee</option>
                    <option>Other</option>
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
                {/* Reason for Claiming */}
                <div className="w-full px-3 my-6">
                  <label
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                    htmlFor="grid-password"
                  >
                    Reason for Claiming
                  </label>
                  <textarea
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="grid-password"
                    placeholder="Reason for Claiming"
                    name="reason"
                  ></textarea>
                </div>
              </div>
              {/* Acknowledgment -> checkbox */}
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
              <input type="hidden" name="business_id" value={business?.id} />
              <input type="hidden" name="request_type" value="claim" />
              <hr />
              {/* Submit Button */}
              <div className="flex items-center justify-end mt-4">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="submit"
                >
                  Submit
                </button>
              </div>
            </form>
          </Modal>
      </div>
    </>
  );
};

export default DetailPage;
