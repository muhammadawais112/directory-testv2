"use client";
import React from "react";
import { CiHeart } from "react-icons/ci";
import { MdOutlineLibraryAdd } from "react-icons/md";
import { GoShareAndroid } from "react-icons/go";
import { BsPrinter } from "react-icons/bs";
import { GoDotFill } from "react-icons/go";
import { IoTimeOutline } from "react-icons/io5";
import { LiaExternalLinkAltSolid } from "react-icons/lia";
const AwesomeListing = ({ business, user, followStatus, navigate, followFunction, unFollowFunction, theme_content }) => {
  return (
    <div className="">
      <div className="w-full flex items-center justify-between">
        <h1 className="font-bold text-xl my-2 mt-6 uppercase text-black">{business.first_name}</h1>

        {/* Follow/Unfollow Button Section */}
        {user?.id ? (
          <div className="flex justify-center md:justify-end items-center w-full my-2 mt-6 md:w-auto">
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
          <div className="flex justify-center md:justify-end items-center my-2 mt-6 w-full md:w-auto">
            <button
              style={{
                background:
                  theme_content?.general?.button_bg ||
                  "bg-red-500 hover:bg-red-600",
                color: theme_content?.general?.button_text || "#fff",
              }}
              className="px-4 py-2 rounded transition"
              onClick={() => navigate.push(`/login`)}
            >
              Login to Follow
            </button>
          </div>
        )}
        {/* <div className="flex items-center justify-center gap-2">
          <button className="border border-[#DDDDDD] p-3 rounded-xl">
            <CiHeart />
          </button>
          <button className="border border-[#DDDDDD] p-3 rounded-xl">
            <MdOutlineLibraryAdd />
          </button>
          <button className="border border-[#DDDDDD] p-3 rounded-xl">
            <GoShareAndroid />
          </button>
          <button className="border border-[#DDDDDD] p-3 rounded-xl">
            <BsPrinter />
          </button>
        </div> */}
      </div>
      <p className="text-gray-700 text-base">
        {business?.address}
      </p>

      <div className="py-4 flex flex-wrap items-center text-gray-600 ">
        {business?.business_tags?.map((tag, index) => (
          <div key={tag.id || index} className="flex items-center gap-2 ">
            <GoDotFill className="ml-2" />
            <span>{tag?.label}</span>
          </div>
        ))}
      </div>


      {/* <div className="py-4 w-1/4 flex justify-between text-gray-600">
        <div className="flex items-center gap-1">
          <GoDotFill />
          <span>Category</span>
        </div>
        <div className="flex items-center gap-1">
          <IoTimeOutline />
          <span>1 year ago</span>
        </div>
        <div className="flex items-center gap-1">
          <LiaExternalLinkAltSolid /> <span>8721</span>
        </div>
      </div> */}
    </div>
  );
};

export default AwesomeListing;
