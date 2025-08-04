"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import businessImage from "../../assets/Blogs/main.png";
import Loader from "../../components/loader";
import bg from "@/app/assets/Home/bg.png";
import { useAppServices } from "../../hook/services";
import { useAgencyInfo } from "../../context/agency";
import { useTopnavInfo } from "../../context/topnav";
import { useUserInfo } from "../../context/user";
import { FaExternalLinkAlt, FaHeart } from "react-icons/fa";
import { SlUserUnfollow } from "react-icons/sl";
import { LuCopyPlus } from "react-icons/lu";
import { CiHeart } from "react-icons/ci";
import Image from "next/image";

const Index = () => {
  const { agency_id, slug } = useParams();
  const navigate = useRouter();
  const Service = useAppServices();
  const [user, , , planData] = useUserInfo();
  const [agency] = useAgencyInfo();
  const [likedBusinesses, setLikedBusinesses] = useState([]);
  const [followedBusinesses, setFollowedBusinesses] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [tagData, setTagData] = useState("");
  const [, selctedItems, , selctedItemsType, , selected_category] =
    useTopnavInfo();
  const [loader, setLoader] = useState(true);
  let middleware = `/detail-page/`;
  if (agency_id) {
    middleware = `/app/${agency_id}/`;
  }

  const onLoad = async () => {
    setLoader(true);
    try {
      const { response } = await Service.business_tags.get({
        query: `slug=${slug}`,
      });

      if (response) {
        const tag = response?.data;
        setTagData(tag);

        const bizRes = await Service.accounts.get({
          query: `agency_id=${agency?._id}&tags=business`,
        });

        if (bizRes.response) {
          const data = bizRes.response.data;
          const filtered = data?.filter((business) =>
            business?.business_tags?.some((t) => t?.value === tag?._id)
          );
          setBusinesses(filtered);
        }
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    onLoad();
  }, [window?.location?.pathname]);

  const handleBusinessDetails = (id) => {
    navigate.push(`${middleware}${id}`);
  };

  const fetchLikedBusinesses = async () => {
    if (user?._id && agency?._id) {
      const { response } = await Service.likeBusiness.Get({
        agency_id: agency._id,
        account_id: user._id,
      });
      if (response?.data?.length) {
        setLikedBusinesses(response.data); // Store the full like object
      }
    }
  };
  const likeFunction = async (business) => {
    if (!user?._id) {
      navigate.push("/login");
      return;
    }

    const payload = {
      business_id: business._id,
      account_id: user._id,
      agency_id: agency._id,
    };

    const { response } = await Service.likeBusiness.create({ payload });

    if (response.success) {
      setLikedBusinesses((prev) => [...prev, business._id]);
      fetchLikedBusinesses();
    }
  };
  const isBusinessFollowed = (id) => {
    return followedBusinesses.some((item) => item.business_id === id);
  };
  const unFollowFunction = async (_id) => {
    console.log("Trying to unfollow with _id:", _id);

    try {
      const { response } = await Service.followBusiness.Delete({
        query: `_id=${_id}`,
      });

      console.log("Unfollow API Response:", response);

      if (response.success) {
        // Remove the unfollowed business from the state
        setFollowedBusinesses((prev) =>
          prev.filter((business) => business._id !== _id)
        );
        console.log("Unfollowed successfully and state updated");
      }
    } catch (error) {
      console.error("Error during unfollow:", error);
    } finally {
      // You can also call fetchFollowed() to ensure that the most recent list is fetched from the server
      fetchFollowed();
    }
  };
  const fetchFollowed = async () => {
    if (user?._id && agency?._id) {
      const { response } = await Service.followBusiness.Get({
        agency_id: agency._id,
        account_ref_id: user._id,
      });

      console.log(response.data, "followed business");

      if (response?.data?.length) {
        setFollowedBusinesses(response.data);
      }
    }
  };
  const followFunction = async (business) => {
    if (!user?._id) {
      navigate.push("/login");
      return;
    }

    const payload = {
      business_id: business?.id,
      business_ref_id: business?._id,
      account_id: user?.id,
      account_ref_id: user?._id,
      agency_id: agency?._id,
    };

    const { response } = await Service.followBusiness.create({ payload });

    if (response) {
      setFollowedBusinesses((prev) => [...prev, business.id]);
      fetchFollowed();
    }
  };
  const unLikeFunction = async (likeId) => {
    try {
      const { response } = await Service.likeBusiness.Delete({
        query: `_id=${likeId}`, // Pass the like's _id here
      });

      if (response.success) {
        setLikedBusinesses(
          (prev) => prev.filter((like) => like._id !== likeId) // Filter based on _id
        );
      }
    } catch (error) {
      console.error("Error during unliking:", error);
    }
  };
  console.log("businessesDebufg", businesses);
  return (
    <div>
      {loader ? (
        <Loader />
      ) : (
        <>
          <section className="py-8">
            {businesses.length > 0 ? (
              <div className="w-[90%] lg:w-[1170px] mx-auto py-[60px]">
                <h2 className="text-2xl font-bold text-center mb-8">
                  {tagData
                    ? businesses[0]?.business_tags?.find(
                        (tag) => tag.value === tagData?._id
                      )?.label
                    : selctedItemsType == "category"
                    ? selected_category?.label
                    : "All Businesses"}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {businesses?.map((business) => (
                    <div key={business.id}>
                      <div
                        onClick={() =>
                          navigate.push(`${middleware}${business.slug}`)
                        }
                        className="relative mx-auto cursor-pointer !w-[330px] !h-[390px] rounded-xl overflow-hidden shadow-sm border border-gray-200"
                      >
                        <div className="relative">
                          <Image
                            src={business.profile_image || bg}
                            alt={business.first_name}
                            className="w-full h-[220px] object-cover"
                            width={500}
                            height={220}
                          />
                        </div>

                        <div className="p-4 cursor-pointer">
                          <h2 className="text-lg text-black">{business.first_name}</h2>
                          <p className="text-gray-600">
                            {/* {business?.address}, {business?.city}, {business?.country} */}
                            {(() => {
                              const address = business?.address?.trim();
                              const city = business?.city?.trim();
                              const state = business?.state?.trim();

                              const fullAddress = address
                                ? `${address}, ${city || ""}${
                                    state ? ", " + state : ""
                                  }`
                                : `${city || ""}${state ? ", " + state : ""}`;

                              const displayText = fullAddress.slice(0, 25);
                              const isTruncated = fullAddress.length > 25;

                              return displayText + (isTruncated ? "..." : "");
                            })()}
                          </p>
                          <div className="flex gap-[10px] overflow-x-scroll scroll-smooth whitespace-nowrap [-webkit-overflow-scrolling:touch] [scrollbar-width:none]">
                            {business?.business_tags?.map((tag, index) => (
                              <h3
                                key={index}
                                className="bg-white w-fit px-[10px] my-2 py-1 rounded-md border border-gray-300 font-bold text-black"
                              >
                                {/* {tag?.label} */}
                                {tag?.label?.length > 25
                                  ? `${tag.label.slice(0, 25)}...`
                                  : tag.label}
                              </h3>
                            ))}
                          </div>
                        </div>

                        <div className=" absolute bottom-2 w-full px-4 pt-2">
                          <div className="border-t border-gray-200 pt-2 flex justify-end">
                            <span className="w-8 h-8 flex justify-center items-center cursor-pointer text-black">
                              <FaExternalLinkAlt />
                            </span>

                            {isBusinessFollowed(business.id) ? (
                              <span
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const matched = followedBusinesses.find(
                                    (fb) => fb.business_id === business.id
                                  );
                                  if (matched?._id) {
                                    unFollowFunction(matched._id);
                                  }
                                }}
                                className="w-8 h-8 flex justify-center items-center cursor-pointer"
                              >
                                <SlUserUnfollow />
                              </span>
                            ) : (
                              <span
                                onClick={(e) => {
                                  e.stopPropagation();
                                  followFunction(business);
                                }}
                                className="w-8 h-8 flex justify-center items-center cursor-pointer text-black hover:text-blue-500"
                              >
                                <LuCopyPlus />
                              </span>
                            )}

                            {likedBusinesses.some(
                              (like) => like.business_id === business._id
                            ) ? (
                              <span
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const matchedLike = likedBusinesses.find(
                                    (like) => like.business_id === business._id
                                  );
                                  if (matchedLike?._id) {
                                    unLikeFunction(matchedLike._id); // Use matchedLike._id here
                                  }
                                }}
                                className="w-8 h-8 flex justify-center items-center cursor-pointer bg-white text-red-500"
                              >
                                <FaHeart />
                              </span>
                            ) : (
                              <span
                                onClick={(e) => {
                                  e.stopPropagation();
                                  likeFunction(business);
                                }}
                                className="w-8 h-8 flex justify-center items-center cursor-pointer  text-gray-500"
                              >
                                <CiHeart />
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    // <div
                    //   className="bg-white shadow-md p-4 cursor-pointer"
                    //   onClick={() => handleBusinessDetails(business?.id)}
                    // >
                    //   <img
                    //     src={business?.profile_image || businessImage}
                    //     alt="Featured Listing 1"
                    //     className="mb-2 h-[300px] object-cover w-full"
                    //   />
                    //   <h3 className="text-lg font-bold">
                    //     {business?.first_name}
                    //   </h3>
                    //   <div className="mt-3 flex w-full gap-3 items-center">
                    //     {business?.service_type?.label && (
                    //       <p className="text-sm p-2 bg-[#f5af02] text-white">
                    //         {business?.service_type?.label}
                    //       </p>
                    //     )}
                    //     {business?.business_type?.label && (
                    //       <p className="text-sm p-2 bg-[#f5af02] text-white">
                    //         {business?.business_type?.label}
                    //       </p>
                    //     )}
                    //   </div>
                    // </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex justify-center items-center h-screen">
                <h2 className="text-2xl font-bold text-center text-black">
                  No Businesses Found
                </h2>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
};

export default Index;
