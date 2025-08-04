"use client";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./home.css";
import React from "react";
import { useRouter, useParams } from "next/navigation";
import Slider from "react-slick";
import businessImage from "@/app/assets/images/profile.png";
import { AiOutlineThunderbolt } from "react-icons/ai";
import { FaExternalLinkAlt } from "react-icons/fa";
import { LuCopyPlus } from "react-icons/lu";
import { CiHeart } from "react-icons/ci";
import { CgArrowTopRight } from "react-icons/cg";
import { useAgencyInfo } from "../../context/agency";
import { useAppServices } from "../../hook/services";
import { useUserInfo } from "../../context/user";
import { useEffect } from "react";
import { useState } from "react";
import { FaHeart } from "react-icons/fa";
import { SlUserUnfollow } from "react-icons/sl";
import Image from "next/image";

const FeaturedListings = ({ businesses }) => {
  const [agency] = useAgencyInfo();
  const Service = useAppServices();
  const [user, , , planData] = useUserInfo();
  const navigate = useRouter();
  const { agency_id } = useParams();
  let middleware = `/`;

  const filteredBusinesses =
    businesses?.filter((item) => item.plan_type === "premium") || [];
  let displayBusinesses = [...filteredBusinesses];

  const hasMultipleBusinesses = filteredBusinesses.length > 1;

  let settings = {
    dots: false,
    infinite: false,
    speed: 500,
    arrows: true,
    slidesToShow: 3,
    slidesToScroll: 3,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          // infinite: true,
          // dots: false
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  // If only 1 business, lock scrolling
  if (filteredBusinesses.length === 1) {
    settings = {
      ...settings,
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: false,
      draggable: false,
      swipe: false,
    };
  }

  // If exactly 2, add a blank placeholder to visually show 3 items
  if (filteredBusinesses.length === 2) {
    displayBusinesses.push({ isPlaceholder: true });
  }

  const [followedBusinesses, setFollowedBusinesses] = useState([]);

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

  useEffect(() => {
    fetchFollowed();
  }, [user, agency]);

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

  const [likedBusinesses, setLikedBusinesses] = useState([]);

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

  useEffect(() => {
    fetchLikedBusinesses();
  }, [user, agency]);

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

  return (
    filteredBusinesses?.length > 0 && (
      <div className="md:container mx-auto">
        <div className="flex justify-between pb-[42px]">
          <h3 className="text-[30px] font-semibold text-black">
            Discover Our Featured Listings
          </h3>

          <div className="md:flex items-center justify-between">
            <span
              onClick={() => navigate.push(`${middleware}featured-listing`)}
              className=" md:mt-0 mt-2 flex items-center space-x-2 font-semibold cursor-pointer text-black"
            >
              See All Featured Listings
              <CgArrowTopRight fontSize={18} />
            </span>
          </div>
        </div>
        <div>
          <Slider {...settings} className="w-full flex ">
            {filteredBusinesses?.map((business) => (
              <div key={business.id}>
                <div
                  onClick={() =>
                    navigate.push(`${middleware}detail-page/${business.slug}`)
                  }
                  className=" cursor-pointer bg-white relative rounded-[12px] border border-[#e6e8ed] overflow-hidden h-[390px] md:h-[390px] w-[300px] md:w-[330px] mx-auto"
                >
                  <div className="relative">
                    <Image
                      src={business.profile_image || businessImage}
                      alt={business.first_name}
                      width={500}
                      height={220}
                      className="w-full h-[220px] object-cover"
                    />
                    <span className="absolute top-4 left-4 bg-red-500 text-white text-xs font-semibold uppercase px-2 py-1 rounded-md flex items-center">
                      <AiOutlineThunderbolt className="mr-[5px]" /> Featured
                    </span>
                  </div>

                  <div
                    className="p-4 cursor-pointer"
                    onClick={() =>
                      navigate.push(`${middleware}detail-page/${business.slug}`)
                    }
                  >
                    <h2 className="text-lg text-black">
                      {business.first_name?.slice(0, 25)}...
                    </h2>
                    <p className="text-gray-600">
                      {(() => {
                        const address = business?.address?.trim();
                        const city = business?.city?.trim();
                        const state = business?.state?.trim();

                        let fullAddress = "";

                        if (address) {
                          fullAddress = `${address}`;
                          if (city) fullAddress += `, ${city}`;
                          if (state) fullAddress += `, ${state}`;
                        } else {
                          if (city && state) {
                            fullAddress = `${city}, ${state}`;
                          } else {
                            fullAddress = city || state || "";
                          }
                        }

                        const displayText = fullAddress.slice(0, 25);
                        const isTruncated = fullAddress.length > 25;

                        return displayText + (isTruncated ? "..." : "");
                      })()}
                    </p>

                    <div className="scrollable-container">
                      {business?.business_tags?.map((tag, index) => (
                        <h3
                          key={index}
                          className="bg-white w-fit px-[10px] my-2 py-1 rounded-md border border-gray-300 font-bold text-black"
                        >
                          {tag?.label?.length > 25
                            ? `${tag.label.slice(0, 25)}...`
                            : tag.label}
                        </h3>
                      ))}
                    </div>
                  </div>

                  <div className=" absolute bottom-2 w-full px-4 pt-2">
                    <div className="border-t border-gray-200  pt-2 flex justify-end">
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
                          className="w-8 h-8 flex justify-center items-center cursor-pointer text-black"
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
            ))}
          </Slider>
        </div>
      </div>
    )
  );
};

export default FeaturedListings;
