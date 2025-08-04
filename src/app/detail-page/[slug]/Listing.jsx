import React, { useState } from "react";
import VideoCard from "../../components/VideoCard/VideoCard";
import bgImg from "@/app/assets/Home/bg.png";
import AddReviews from "../../components/Reviews/AddReviews";
import ShowReviews from "../../components/Reviews/ShowReviews";
// import FeaturedListings from '../../Home/HomeComponents/FeaturedListings'
import MapContainer from "../../components/Map/MapContainer";
import WorkingHour from "../../components/WorkingHours/workingHour";
import { useAppServices } from "../../hook/services";
import { useUserInfo } from "../../context/user";
import GoogleReviews from "../../components/GoogleReviews/GoogleReviews";
import { useEffect } from "react";
import BusinessBlogs from "./components/BusinessBlogs";
import BusinessEvents from "./components/BusinessEvents";
import BusinessJobs from "./components/BusinessJobs";
import BusinessNewsFeed from "./components/BusinessNewsFeed";
import TeamComponent from "./team";
import { FaPhone } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { useAgencyInfo } from "../../context/agency";
import toast from "react-hot-toast";
import ReactImageGallery from "react-image-gallery";
import Image from "next/image";

const Listing = ({
  socialLinks,
  setClaimData,
  setOpenModal,
  claimData,
  business,
  followStatus,
  navigate,
  followFunction,
  unFollowFunction,
  theme_content,
}) => {
  const Service = useAppServices();
  const [user, , , planData] = useUserInfo();
  const [agency] = useAgencyInfo();
  console.log("planDataplanDataplanData", planData);
  const [blogsData, setBlogsData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [businessId, setBusinessId] = useState(business.id);
  const [reviews, setReviews] = useState([]);
  const [jobsData, setJobsData] = useState([]);
  const [eventsData, setEventsData] = useState([]);
  const [newsFeedsData, setNewsFeedsData] = useState([]);
  const [planDataForBusiness, setPlanDataForBusiness] = useState({});
  const [showGallery, setShowGallery] = useState(false);
  // const navigate = useNavigate();
  // const googleImages = business?.google_images || [];

  const getReviews = async () => {
    const { response } = await Service.reviews.Get({
      query: `business_id=${business.id}`,
    });
    if (!response) return;
    setReviews(response.data);
  };

  const getPlanDataForBusiness = async (_id) => {
    const { response } = await Service.accounts.planData({
      query: `business_id=${_id}`,
    });
    if (response) {
      setPlanDataForBusiness(response.data);
    }
  };

  const businessHourFeature = planDataForBusiness?.features?.find(
    (feature) => feature.name === "Business Hour Configurations"
  );
  const businessDescriptionFeature = planDataForBusiness?.features?.find(
    (feature) => feature.name === "Business Description"
  );
  // const googleplaceimage = planDataForBusiness?.features?.find(
  //   (feature) => feature.name === "Google Place Images"
  // );
  const AddressFeature = planDataForBusiness?.features?.find(
    (feature) => feature.name === "Address"
  );
  const PhoneFeature = planDataForBusiness?.features?.find(
    (feature) => feature.name === "Phone"
  );
  const EmailFeature = planDataForBusiness?.features?.find(
    (feature) => feature.name === "Email Address"
  );
  const WebsiteFeature = planDataForBusiness?.features?.find(
    (feature) => feature.name === "Website"
  );
  const googleFeature = planDataForBusiness?.features?.find(
    (feature) => feature.name === "Google Map Configuration"
  );
  const blogsFeature = planDataForBusiness?.features?.find(
    (feature) => feature.name === "Blogs"
  );
  const eventsFeature = planDataForBusiness?.features?.find(
    (feature) => feature.name === "Events"
  );
  const jobsFeature = planDataForBusiness?.features?.find(
    (feature) => feature.name === "Jobs"
  );
  const TeamFeature = planDataForBusiness?.features?.find(
    (feature) => feature.name === "Teams"
  );
  const newsFeature = planDataForBusiness?.features?.find(
    (feature) => feature.name === "News Feeds"
  );

  const ReviewsFeature = planDataForBusiness?.features?.find(
    (feature) => feature.name === "Reviews"
  );
  const GoogleReviewsFeature = planDataForBusiness?.features?.find(
    (feature) => feature.name === "Google Reviews"
  );

  const VideoFeature = planDataForBusiness?.features?.find(
    (feature) => feature.name === "Video"
  );

  const CompanyLogoFeature = planDataForBusiness?.features?.find(
    (feature) => feature.name === "Company Logo"
  );

  const ExtraLinkFeature = planDataForBusiness?.features?.find(
    (feature) => feature.name === "Extra Links"
  );

  const SocialMediaFeature = planDataForBusiness?.features?.find(
    (feature) => feature.name === "Social Media"
  );

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

  useEffect(() => {
    if (business._id) {
      getBlogs(business._id);
      getEvents(business._id);
      getJobs(business._id);
      getNewsFeeds(business._id);
      getPlanDataForBusiness(business._id);
    }
  }, [business._id]);

  const claimBusinessHandler = async () => {
    console.log("claimBusinessHandler", business);
    if (!user.id) {
      return navigate("/login");
    }
    setLoader(true);
    const payload = {
      business_id: business?.id,
      business_ref_id: business?._id,
      account_id: user.id,
      agency_id: agency?._id,
      address: business?.address,
      business_name: business?.first_name,
      business_reference: business?.first_name,
      email: user?.email || "",
      phone: business?.phone,
      first_name: user?.first_name,
      last_name: user?.last_name,
      request_type: "claim",
      role: "Owner",
    };
    console.log(payload, "payload");
    const { response } = await Service.claim_business.create({
      payload,
    });
    if (response) {
      setLoader(false);
      setClaimData(response?.data);
      toast.success("Claim request send successfully");
    } else {
      setLoader(false);
    }
  };

  // const handleUnlinkClaim = async () => {
  //   const { response } = await Service.claim_business.Delete({
  //     query: `_id=${claimData?._id}`,
  //   });
  //   if (response?.success) {
  //     toast.success("Claim request unlinked successfully");
  //     setClaimData(response?.data);
  //   } else {
  //     toast.error("Failed to unlink claim request");
  //   }
  // };

  const getEmbedUrl = (videoUrl) => {
    if (!videoUrl) return "";

    // YouTube
    if (
      videoUrl.includes("youtube.com/watch") ||
      videoUrl.includes("youtu.be")
    ) {
      const videoId =
        videoUrl.split("v=")[1]?.split("&")[0] || videoUrl.split("/").pop();
      return `https://www.youtube.com/embed/${videoId}`;
    }

    // Loom
    if (videoUrl.includes("loom.com")) {
      const videoId = videoUrl.split("/share/")[1];
      return `https://www.loom.com/embed/${videoId}`;
    }

    // Add other platform rules here if needed...

    // Fallback
    return videoUrl;
  };

  const embedUrl = getEmbedUrl(business?.video_tutorial);

  return (
    <div>
      <div className="flex flex-col-reverse gap-5 lg:flex-row">
        <div className="w-full lg:w-2/3 mr-4">
          {businessDescriptionFeature?.value && (
            <div className="bg-white p-6 rounded-lg shadow pr-4 w-full">
              <h1 className="text-xl font-bold mb-4 text-black">Business Description</h1>
              <div
                className="text-gray-700 mb-4"
                dangerouslySetInnerHTML={{ __html: business?.description }}
              ></div>
            </div>
          )}

          {/* {googleplaceimage?.value && googleImages?.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow pr-4 w-full my-8">
              <h1 className="text-xl font-bold mb-4">Google Place Images</h1>
              <div className="flex flex-wrap md:flex-nowrap gap-4">
                <div className="w-full md:w-2/3">
                  <img
                    alt="Main placeholder"
                    className="w-full h-[400px] rounded-lg object-cover shadow-md"
                    src={`${googleImages[0]}`}
                  />
                </div>
                <div className="w-full md:w-1/3 flex flex-col gap-4 relative">
                  {googleImages?.length > 0 ? (
                    googleImages
                      ?.slice(1, 3)
                      ?.map((imageUrl, index) => (
                        <img
                          key={index}
                          alt={`Google place image ${index + 1}`}
                          className="w-full h-[190px] rounded-lg object-cover shadow-md"
                          src={imageUrl}
                        />
                      ))
                  ) : (
                    <p className="text-gray-500">No images available.</p>
                  )}

                  {googleImages?.length > 3 && (
                    <button
                      className="absolute bottom-3 right-3 mt-2 px-4 py-2 bg-white text-black rounded-lg"
                      onClick={() => setShowGallery(true)}
                    >
                      See All {googleImages?.length} Photos
                    </button>
                  )}
                </div>

                {showGallery && (
                  <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
                    <div className="relative bg-white p-10 rounded-lg shadow-lg flex flex-col overflow-hidden">
                      <button
                        className="absolute top-3 right-2 text-black px-3 py-1 rounded-md hover:bg-red-700 transition"
                        onClick={() => setShowGallery(false)}
                      >
                        ✕
                      </button>

                      <div className="flex-grow flex justify-center items-center">
                        <ReactImageGallery
                          items={
                            googleImages?.map((img, idx) => ({
                              original: img,
                              thumbnail: img,
                              originalAlt: `Attachment ${idx + 1}`,
                              thumbnailAlt: `Thumbnail ${idx + 1}`,
                            })) || []
                          }
                          showThumbnails={true}
                          showFullscreenButton={false}
                          showPlayButton={false}
                          thumbnailPosition="right"
                          lazyLoad={true}
                          showIndex={true}
                          additionalClass="max-h-[80vh] w-[700px] flex items-center justify-center"
                          renderItem={(item) => (
                            <div className="w-full h-full flex items-center justify-center">
                              <img
                                src={item.original}
                                alt={item.originalAlt || "dummy"}
                                className="max-h-[80vh] w-[700px] object-cover rounded-lg"
                              />
                            </div>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )} */}

          {VideoFeature?.value && business?.video_tutorial && (
            <div className="bg-white p-6 rounded-lg shadow pr-4 w-full">
              {embedUrl ? (
                <iframe
                  src={embedUrl}
                  width="100%"
                  height="315"
                  allow="fullscreen"
                  allowFullScreen
                  className="w-full rounded-lg"
                ></iframe>
              ) : (
                <p className="text-gray-500">
                  Invalid or unsupported video URL
                </p>
              )}
            </div>
          )}

          {(AddressFeature?.value || googleFeature?.value) && (
            <div className="bg-white p-6 rounded-lg shadow w-full pr-4 my-8">
              {AddressFeature?.value && (
                <>
                  <h2 className="text-xl font-semibold mb-4 text-black">Address</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    {business?.address && (
                      <div>
                        <p className="font-semibold text-black">Address</p>
                        <p className="text-black">{business?.address}</p>
                      </div>
                    )}

                    {business?.zip_code && (
                      <div>
                        <p className="font-semibold text-black">Zip/Postal Code</p>
                        <p className="text-black">{business?.zip_code}</p>
                      </div>
                    )}

                    {business?.city && (
                      <div>
                        <p className="font-semibold text-black">City</p>
                        <p className="text-black">{business?.city}</p>
                      </div>
                    )}

                    {business?.state && (
                      <div>
                        <p className="font-semibold text-black">State/county</p>
                        <p className="text-black">{business?.state}</p>
                      </div>
                    )}

                    {business?.country && (
                      <div>
                        <p className="font-semibold text-black">Country</p>
                        <p className="text-black">{business?.country}</p>
                      </div>
                    )}
                  </div>
                </>
              )}
              {googleFeature?.value ? (
                <div className="relative">
                  <MapContainer
                    height="300px"
                    city={business?.city}
                    addresses={business?.address}
                    state={business?.state}
                    country={business?.country}
                    planData={planDataForBusiness}
                    businessType={business?.plan_type}
                  />
                  {/* <img alt="Map showing the location of 10425 Tabor St, Los Angeles, California" className="w-full rounded-lg" height="300" src={banner} width="600" />
                            <div className="absolute top-4 right-4">
                                <button className="bg-white text-gray-700 px-4 py-2 rounded-lg shadow flex items-center">
                                    <i className="fas fa-external-link-alt mr-2">
                                    </i>
                                    Open on Google Maps
                                </button>
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="bg-black bg-opacity-50 p-2 rounded-full">
                                    <i className="fas fa-map-marker-alt text-white text-2xl">
                                    </i>
                                </div>
                            </div> */}
                </div>
              ) : (
                <></>
              )}
            </div>
          )}

          {/* <div className="">
                        <VideoCard />
                    </div> */}

          <div className="w-full">
            {businessHourFeature?.value ? (
              <WorkingHour business={business} />
            ) : (
              ""
            )}
          </div>

          {/* <div className="bg-white p-6 rounded-lg shadow pr-4 w-full mt-8">
                        <h1 className="text-xl font-bold mb-4 text-start">Google Reviews</h1>
                        <GoogleReviews business={business} address={business?.address} />
                    </div> */}

          <div className="bg-white p-6 rounded-lg shadow pr-4 w-full mt-8">
            {ReviewsFeature?.value || GoogleReviewsFeature?.value ? (
              <h1 className="text-xl font-bold mb-4 text-start text-black">Our Reviews</h1>
            ) : (
              ""
            )}

            <ShowReviews
              business={business}
              setReviews={setReviews}
              reviews={reviews}
              getReviews={getReviews}
              ReviewsFeature={ReviewsFeature}
              GoogleReviewsFeature={GoogleReviewsFeature}
            />
            <AddReviews
              business={business}
              setReviews={setReviews}
              reviews={reviews}
              getReviews={getReviews}
            />
          </div>

          {business?.team?.length && TeamFeature?.value ? (
            <div className="bg-white p-6 rounded-lg shadow pr-4 w-full mt-8">
              <h1 className="text-xl font-bold mb-4 text-start">Our Team</h1>
              <TeamComponent business={business} />
            </div>
          ) : (
            <></>
          )}

          {blogsFeature?.value ? (
            <>
              {blogsData?.length > 0 && (
                <div className="bg-white p-6 rounded-lg shadow pr-4 w-full mt-8">
                  <h1 className="text-xl font-bold mb-4 text-start text-black">
                    Our Blog
                  </h1>
                  <BusinessBlogs blogsData={blogsData} />
                </div>
              )}
            </>
          ) : (
            <></>
          )}

          {newsFeature?.value ? (
            <>
              {newsFeedsData?.length > 0 && (
                <div className="bg-white p-6 rounded-lg shadow pr-4 w-full mt-8">
                  <h1 className="text-xl font-bold mb-4 text-start text-black">
                    Our News
                  </h1>
                  <BusinessNewsFeed blogsData={newsFeedsData} />
                </div>
              )}
            </>
          ) : (
            <></>
          )}

          {jobsFeature?.value ? (
            <>
              {jobsData?.length > 0 && (
                <div className="bg-white p-6 rounded-lg shadow pr-4 w-full mt-8">
                  <h1 className="text-xl font-bold mb-4 text-start text-black">
                    Our Jobs
                  </h1>
                  <BusinessJobs blogsData={jobsData} />
                </div>
              )}
            </>
          ) : (
            <></>
          )}

          {eventsFeature?.value ? (
            <>
              {eventsData?.length > 0 && (
                <div className="bg-white p-6 rounded-lg shadow pr-4 w-full mt-8">
                  <h1 className="text-xl font-bold mb-4 text-start text-black">
                    Our Events
                  </h1>
                  <BusinessEvents blogsData={eventsData} />
                </div>
              )}
            </>
          ) : (
            <></>
          )}
        </div>

        <div className="w-full lg:w-1/3">
          <div className="bg-white p-6 rounded-lg shadow w-full ">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold mb-4 text-black">
                Get More Information
              </h2>
              {/* {user.id ? (
                claimData?.status === "approved" ? (
                  <span className="bg-green-400 text-white text-sm font-medium px-3 py-1 rounded-full shadow-sm">
                    Claimed
                  </span>
                ) : null
              ) : null} */}
            </div>

            <div className="flex items-center mb-4">
              <Image
                src={business?.profile_image || bgImg}
                alt={business?.profile_image || "Business Profile"}
                className="w-16 h-16 rounded-full mr-4 object-cover"
                width={500}
                height={220}
              />
              <div>
                <h3 className="text-lg font-semibold text-black">
                  Plan Type: <b className="capitalize">{business?.plan_type}</b>
                </h3>
                {business?.website && WebsiteFeature?.value ? (
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
            {business?.phone && PhoneFeature?.value ? (
              <p className="flex items-center text-gray-600 mb-3 space-x-2">
                <FaPhone className="text-black rotate-90" />
                <span>{business.phone}</span>
              </p>
            ) : (
              <></>
            )}
            {business?.email && EmailFeature?.value ? (
              <p className="flex items-center text-gray-600 mb-3 space-x-2">
                <MdEmail className="text-black" />
                <span>{business.email}</span>
              </p>
            ) : (
              <></>
            )}
            {SocialMediaFeature?.value ? (
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
                    ></i>
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
                    ></i>
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
                    ></i>
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
                    ></i>
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
                    ></i>
                  </a>
                )}
              </div>
            ) : (
              ""
            )}

            {ExtraLinkFeature?.value ? (
              <div>
                {(business?.help_center ||
                  business?.community ||
                  business?.privacy ||
                  business?.terms_condition ||
                  business?.video_tutorial) && (
                  <h2 className="text-xl font-bold mb-2">Links</h2>
                )}

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
                  {business?.video_tutorial &&
                  business?.plan_type === "premium" ? (
                    <a
                      className="text-gray-600 "
                      href={business?.video_tutorial}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Video Tutorial
                    </a>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            ) : (
              ""
            )}

            <div className="mb-4">
              {user.id ? (
                claimData?.status === "pending" ? (
                  <button
                    style={{
                      background:
                        theme_content?.general?.button_bg || "#EF4444",
                      color: theme_content?.general?.button_text || "#fff",
                    }}
                    className="font-medium px-3 py-2 rounded-full shadow-sm mr-3"
                  >
                    Request Pending
                  </button>
                ) : claimData?.status === "approved" ? (
                  <>
                    {/* <button
                      style={{
                        background:
                          theme_content?.general?.button_bg || "#EF4444",
                        color: theme_content?.general?.button_text || "#fff",
                      }}
                      className="font-medium px-3 py-1 rounded-full shadow-sm mr-3"
                      onClick={handleUnlinkClaim}
                    >
                      UnLink
                    </button> */}
                    <button
                      style={{
                        background:
                          theme_content?.general?.button_bg || "#EF4444",
                        color: theme_content?.general?.button_text || "#fff",
                      }}
                      className="font-medium px-3 py-1 rounded-full shadow-sm mr-3"
                    >
                      Claimed
                    </button>
                    <p className="text-gray-600">
                      If you’d like to make an additional Claim Request,{" "}
                      <button
                        className="text-blue-500 mt-3"
                        onClick={() => navigate("/listing")}
                      >
                        click here.
                      </button>
                    </p>
                  </>
                ) : (
                  // onClick={() => setOpenModal(true)}
                  <button
                    style={{
                      background:
                        theme_content?.general?.button_bg || "#EF4444",
                      color: theme_content?.general?.button_text || "#fff",
                    }}
                    className="font-medium px-3 py-2 rounded-full shadow-sm mr-3"
                    onClick={claimBusinessHandler}
                  >
                    Claim this business
                  </button>
                )
              ) : (
                <button
                  style={{
                    background: theme_content?.general?.button_bg || "#EF4444",
                    color: theme_content?.general?.button_text || "#fff",
                  }}
                  className="font-medium px-3 py-2 rounded-full shadow-sm mr-3"
                  onClick={() => navigate.push("/login")}
                >
                  Login to Claim
                </button>
              )}
            </div>

            {/* <form>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-medium mb-2" for="name">
                                    Name
                                </label>
                                <input className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500" id="name" name="name" type="text" value="Ali Tufan" />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-medium mb-2" for="phone">
                                    Phone
                                </label>
                                <input className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500" id="phone" name="phone" placeholder="Enter your phone" type="text" />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-medium mb-2" for="email">
                                    Email
                                </label>
                                <input className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500" id="email" name="email" type="email" value="creativelayers088" />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-medium mb-2" for="role">
                                    I'm a
                                </label>
                                <div className="relative">
                                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:border-gray-500" id="role" name="role">
                                        <option>
                                            Select
                                        </option>
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                        <i className="fas fa-chevron-down text-gray-500">
                                        </i>
                                    </div>
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-medium mb-2" for="message">
                                    Message
                                </label>
                                <textarea className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500" id="message" name="message" rows="4">Hello, I am interested in [ Renovated apartment at last floor ]</textarea>
                            </div>
                            <div className="mb-4 flex items-center">
                                <input className="mr-2" id="terms" name="terms" type="checkbox" />
                                <label className="text-gray-700 text-sm" for="terms">
                                    By submitting this form I agree to Terms of Use
                                </label>
                            </div>
                            <button className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 focus:outline-none focus:bg-red-600" type="submit">
                                Send Message
                                <i className="fas fa-arrow-right ml-2">
                                </i>
                            </button>
                        </form> */}
          </div>
        </div>
      </div>
      {/* 
            <div className='w-[90%] lg:w-[1080px] mx-auto py-[60px]'>

                <FeaturedListings />
            </div> */}
    </div>
  );
};

export default Listing;
