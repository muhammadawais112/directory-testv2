import Footer from "component/Footer";
import Header from "component/Header";
import Loader from "component/loader";
import Topnav from "component/Topnav";
import { useAgencyInfo } from "context/agency";
import { useUserInfo } from "context/user";
import { useAppServices, useUploadImage } from "hook/services";
import BlogList from "pages/component/blogList";
import Modal from "../../component/popup";
import ReviewsComponent from "pages/component/reviews";
import TeamComponent from "pages/component/team";
import WorkingHour from "pages/component/workingHour";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import main_image from "../../../assets/images/main.jpg";
import MapContainer from "pages/component/MapContainer";
import profile from "../../../assets/images/profile.png";
import BusinessBlogs from "./BusinessBlogs";
import BusinessJobs from "./BusinessJobs";
import BusinessEvents from "./BusinessEvents";

const DetailPage = () => {
  const navigate = useNavigate();
  const Service = useAppServices();
  // image upload
  const uploadImage = useUploadImage();
  const [user, setUser] = useUserInfo();
  const { id } = useParams();
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
    const { response } = await Service.accounts.single_account({
      query: `id=${id}`,
    });
    if (!response) return setLoader(false);
    setBusiness(response?.data);
    getBlogs(response?.data._id);
    getEvents(response?.data._id);
    getJobs(response?.data._id);
    getNewsFeeds(response?.data._id);
    if (response?.data?.tags?.length) {
      setTags(response?.data?.business_tags);
    }
    return setLoader(false);
  };

  const getClaimeBusiness = async () => {
    const { response } = await Service.claim_business.Get({
      query: `business_id=${id}&account_id=${user?.id}&agency_id=${agency?._id}`,
    });
    if (response) {
      console.log(response, "response claim");
      setClaimData(response?.data[0]);
    }
  };

  const onLoad = () => {
    getBusiness();
    getClaimeBusiness();
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

  useEffect(onLoad, []);

  useEffect(() => {
    if (user.id) {
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
                setClaimData(response.data);
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

  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth", // for smooth scrolling, use 'auto' for instant jump
    });
  }, [pathname]);

  console.log(business, "business");

  return (
    <div className="bg-[#F7F7F7]  ">
      {loader ? (
        <Loader />
      ) : (
        <>
          <main className="container mx-auto py-8 px-4">
            <section className="bg-[#F7F7F7] p-4 mb-8">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0">
                {/* Business Info Section */}
                <div className="flex flex-col md:flex-row items-center gap-4">
                  <img
                    className="w-20 h-20 md:w-24 md:h-24 object-cover"
                    style={{ borderRadius: "50%" }}
                    src={business?.profile_image || profile}
                    alt="Business Profile"
                  />
                  <div className="text-center md:text-left">
                    <h1 className="text-xl md:text-3xl font-bold mb-1 md:mb-2">
                      {business?.first_name}
                    </h1>
                    {/* <p className="text-sm md:text-base text-gray-600 mb-2 md:mb-4">
                      {business?.address}
                    </p> */}
                  </div>
                </div>

                {/* Follow/Unfollow Button Section */}
                {user?.id ? (
                  <div className="flex justify-center md:justify-end items-center w-full md:w-auto">
                    {followStatus ? (
                      <button
                        style={{
                          background:
                            theme_content?.general?.button_bg ||
                            "bg-orange-500 hover:bg-orange-600",
                          color: theme_content?.general?.button_text || "#fff",
                        }}
                        className=" px-4 py-2 rounded transition"
                        onClick={unFollowFunction}
                      >
                        Unfollow
                      </button>
                    ) : (
                      <button
                        style={{
                          background:
                            theme_content?.general?.button_bg || "#EF4444",
                          color: theme_content?.general?.button_text || "#fff",
                        }}
                        className=" px-4 py-2 rounded transition"
                        onClick={followFunction}
                      >
                        Follow
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="flex justify-center md:justify-end items-center w-full md:w-auto">
                    <button
                      style={{
                        background:
                          theme_content?.general?.button_bg ||
                          "bg-red-500 hover:bg-red-600",
                        color: theme_content?.general?.button_text || "#fff",
                      }}
                      className="px-4 py-2 rounded transition"
                      onClick={() => navigate(`/login`)}
                    >
                      Login to Follow
                    </button>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap space-x-2 mb-4">
                {tags?.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-yellow-500 text-white px-3 py-1 rounded my-2"
                  >
                    {tag?.label}
                  </span>
                ))}
              </div>
              <img
                className="w-full mb-4 object-cover"
                src={business?.cover_image || main_image}
                alt="Nick Ponte Marketing Banner"
                style={{ height: 400 }}
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="col-span-2">
                  <div className="flex flex-wrap gap-4">
                    {business?.attachments?.length
                      ? business.attachments.map((attachment, index) => (
                          <div key={index} className="mb-4">
                            <img
                              src={attachment || main_image}
                              alt={`Attachment ${index + 1}`}
                              width={300}
                              className="object-cover rounded-md "
                            />
                          </div>
                        ))
                      : ""}
                  </div>
                  <div className="bg-white p-4 mb-4 rounded-md">
                    <h2 className="text-xl font-bold mb-2">Our Address</h2>
                    {business?.address && (
                      <p className="text-gray-600 ">
                        Address: {business?.address}
                      </p>
                    )}
                    {business?.country && (
                      <p className="text-gray-600 ">
                        Country: {business?.country}
                      </p>
                    )}
                    {business?.city && (
                      <p className="text-gray-600 ">City: {business?.city}</p>
                    )}
                    {business?.state && (
                      <p className="text-gray-600 ">State: {business?.state}</p>
                    )}
                    {business?.zip_code && (
                      <p className="text-gray-600 ">
                        Zip Code: {business?.zip_code}
                      </p>
                    )}
                    {business?.address ? (
                      <div className="w-full">
                        <MapContainer addresses={business?.address} city={business?.city} state={business?.state} country={business?.country}/>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>

                  {business?.team?.length ? (
                    <TeamComponent business={business} />
                  ) : (
                    <></>
                  )}
                  {business?.business_hours?.length ? (
                    <WorkingHour business={business} />
                  ) : (
                    <></>
                  )}

                  {blogsData.length ? (
                    <BusinessBlogs blogsData={blogsData} />
                  ) : (
                    <></>
                  )}

                  {jobsData.length ? (
                    <BusinessJobs blogsData={jobsData} />
                  ) : (
                    <></>
                  )}

                  {eventsData.length ? (
                    <BusinessEvents blogsData={eventsData} />
                  ) : (
                    <></>
                  )}
                  <ReviewsComponent business={business} />
                </div>

                <aside className="bg-white h-fit p-4">
                  <h2 className="text-xl font-bold mb-2">
                    About {business?.first_name}
                  </h2>
                  <div className="flex items-center space-x-2 mb-4">
                    <img
                      className="w-12 h-12 object-cover rounded-full"
                      src={business?.profile_image || profile}
                      alt="Nick Ponte Marketing Logo"
                    />
                    <div>
                      <p className="text-gray-600">
                        Plan Type:{" "}
                        <b className="capitalize">{business?.plan_type}</b>
                      </p>
                      {business?.website ? (
                        <a
                          className="text-blue-600"
                          href={
                            business?.website?.startsWith("http")
                              ? business.website
                              : `https://${business?.website}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Click to visit website
                        </a>
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>

                  <div className="flex space-x-2 mb-4">
                    {business?.facebook && (
                      <a
                        href={business?.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <i
                          className="fab fa-facebook-f text-2xl"
                          style={{
                            color: socialLinks?.icon_color || "#EF4444",
                          }}
                         />
                      </a>
                    )}

                    {business?.instagram && (
                      <a
                        href={business?.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <i
                          className="fa-brands fa-instagram text-2xl"
                          style={{
                            color: socialLinks?.icon_color || "#EF4444",
                          }}
                         />
                      </a>
                    )}

                    {business?.linked_in && (
                      <a
                        href={business?.linked_in}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <i
                          className="fa-brands fa-linkedin text-2xl"
                          style={{
                            color: socialLinks?.icon_color || "#EF4444",
                          }}
                         />
                      </a>
                    )}

                    {business?.twitter && (
                      <a
                        href={business?.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <i
                          className="fa-brands fa-twitter text-2xl"
                          style={{
                            color: socialLinks?.icon_color || "#EF4444",
                          }}
                         />
                      </a>
                    )}

                    {business?.youtube && (
                      <a
                        href={business?.youtube}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <i
                          className="fa-brands fa-youtube text-2xl"
                          style={{
                            color: socialLinks?.icon_color || "#EF4444",
                          }}
                         />
                      </a>
                    )}
                  </div>

                  {business?.phone_number && (
                    <div>Phone: {business?.phone_number}</div>
                  )}

                  <h2 className="text-xl font-bold mb-2">Urls</h2>
                  <div className="flex flex-col mb-4 gap-2">
                    {business?.help_center && (
                      <a
                        className="text-gray-600 "
                        href={
                          business?.website?.startsWith("http")
                            ? business.website
                            : `${business?.help_center}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Help Center
                      </a>
                    )}
                    {business?.community && (
                      <a
                        className="text-gray-600 "
                        href={
                          business?.website?.startsWith("http")
                            ? business.website
                            : `${business?.community}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Community
                      </a>
                    )}
                    {business?.privacy && (
                      <a
                        className="text-gray-600 "
                        href={
                          business?.website?.startsWith("http")
                            ? business.website
                            : `${business?.privacy}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Privacy
                      </a>
                    )}
                    {business?.terms_condition && (
                      <a
                        className="text-gray-600 "
                        href={
                          business?.website?.startsWith("http")
                            ? business.website
                            : `${business?.terms_condition}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Terms And Condition
                      </a>
                    )}
                    {business?.video_tutorial && (
                      <a
                        className="text-gray-600 "
                        href={
                          business?.website?.startsWith("http")
                            ? business.website
                            : `${business?.video_tutorial}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Video Tutorial
                      </a>
                    )}
                  </div>
                  {/* {
										business?.plan_type == "free" ? (
										) : <></>
									} */}

                  <div className="mb-4">
                    {user.id ? (
                      claimData?.status == "pending" ? (
                        <button
                          style={{
                            background:
                              theme_content?.general?.button_bg ||
                              "bg-orange-500",
                            color:
                              theme_content?.general?.button_text || "#fff",
                          }}
                          className="px-4 py-2 rounded"
                        >
                          Request Pending
                        </button>
                      ) : claimData?.status == "approved" ? (
                        <button
                          style={{
                            background:
                              theme_content?.general?.button_bg || "#EF4444",
                            color:
                              theme_content?.general?.button_text || "#fff",
                          }}
                          className=" px-4 py-2 rounded"
                        >
                          Request Approved
                        </button>
                      ) : (
                        <button
                          style={{
                            background:
                              theme_content?.general?.button_bg || "#EF4444",
                            color:
                              theme_content?.general?.button_text || "#fff",
                          }}
                          className="px-4 py-2 rounded"
                          onClick={() => setOpenModal(true)}
                        >
                          Claim this business111
                        </button>
                      )
                    ) : (
                      <button
                        style={{
                          background:
                            theme_content?.general?.button_bg || "#EF4444",
                          color: theme_content?.general?.button_text || "#fff",
                        }}
                        className="px-4 py-2 rounded"
                        onClick={() => navigate("/login")}
                      >
                        Login to Claim
                      </button>
                    )}
                  </div>
                  <p className="text-gray-600 mb-4">
                    <p className="text-gray-600 mb-4">
                      {business?.description}
                    </p>
                  </p>
                  <hr />
                  <div className="my-4">
                    {newsFeedsData?.length
                      ? newsFeedsData?.map((news, index) => (
                          <div key={index}>
                            <img
                              className="w-full mb-4 h-48 object-cover"
                              src={news.image || "https://placehold.co/500x300"}
                              alt="Nick Ponte Marketing Ad"
                            />

                            <h3 className="text-lg font-bold mb-2">
                              {news.title}
                            </h3>
                            <div className="text-gray-600 mb-4">
                              {/* render html */}
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: news.description,
                                }}
                              />
                            </div>
                          </div>
                        ))
                      : ""}
                  </div>
                </aside>
              </div>
            </section>
          </main>

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
                   />
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
                    <label className="ml-2 text-gray-700" htmlFor="remember">
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
        </>
      )}
    </div>
  );
};

export default DetailPage;
