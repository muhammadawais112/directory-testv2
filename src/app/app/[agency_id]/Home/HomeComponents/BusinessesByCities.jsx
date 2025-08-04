'use client';
import { useRouter } from 'next/navigation';

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import React from "react";
import Slider from "react-slick";
import sample from "@/app/assets/Home/sample.svg";
import { CgArrowTopRight } from "react-icons/cg";

import { MdArrowBackIosNew, MdArrowForwardIos } from "react-icons/md";
// import { useAgencyInfo } from "../../context/agency";
import Image from 'next/image';
import { useAgencyInfo } from '@/app/context/agency';

const CustomNextArrow = ({ onClick, theme_content }) => (
  <div
    style={{
      background: theme_content?.general?.button_bg || "#EF4444",
      color: theme_content?.general?.button_text || "#fff",
    }}
    className="absolute top-[40%] -right-4 transform -translate-y-1/2 z-10 cursor-pointer p-2 rounded-full shadow"
    onClick={onClick}
  >
    <MdArrowForwardIos className=" text-lg" />
  </div>
);

const CustomPrevArrow = ({ onClick, theme_content }) => (
  <div
    style={{
      background: theme_content?.general?.button_bg || "#EF4444",
      color: theme_content?.general?.button_text || "white",
    }}
    className="absolute top-[40%] -left-4 transform -translate-y-1/2 z-10 cursor-pointer p-2 rounded-full shadow"
    onClick={onClick}
  >
    <MdArrowBackIosNew className=" text-lg" />
  </div>
);

const moveToTag = (navigation, tagId) => {
  console.log(`Navigating to tag with ID: ${tagId}`);
  navigation(`/filter-tags/${tagId}`);
};

const BusinessesByCities = ({ bussinessTags }) => {
  const [agency] = useAgencyInfo();
  const theme_content = agency?.theme_id?.theme_data;
  const navigation = useRouter();
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 5,
    arrows: true,
    nextArrow: <CustomNextArrow theme_content={theme_content} />,
    prevArrow: <CustomPrevArrow theme_content={theme_content} />,
    responsive: [
      {
        breakpoint: 1100,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1,
        },
      },
    ],
  };

  const handleTagNavigate = (tag) => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    navigation.push(`/filter-tags/${tag?.slug}`);
  };

  return (
    <div className="container mx-auto">
      <div className="flex flex-row justify-between pb-[42px]">
        <h3 className="text-[30px] font-semibold text-black">Businesses by Tags</h3>

        <div className="md:flex items-center justify-between">
          {/* <p className='text-sm'>Aliquam lacinia diam quis lacus euismod</p> */}

          <span
            className=" md:mt-0 mt-2 flex items-center space-x-2 font-semibold cursor-pointer text-black"
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
              navigation.push("/tags");
            }}
          >
            See All Tags
            <CgArrowTopRight fontSize={18} />
          </span>
        </div>
      </div>

      <Slider {...settings}>
        {bussinessTags?.map((tag) => (
          <div key={tag._id} className="">
            <div
              className="bg-white relative rounded-[12px] border border-[#e6e8ed]  overflow-hidden w-[210px] mx-auto cursor-pointer"
              onClick={() => handleTagNavigate(tag)}
            >
              <div className="relative">
                <Image
                  src={tag?.tag_img || sample}
                  alt={tag.name}
                  width={500}
                  height={220}
                  className="w-[210px] h-[200px] object-cover"
                  unoptimized
                />
                {/* <span className="absolute top-4 left-4 bg-red-500 text-white text-xs font-semibold uppercase px-2 py-1 rounded-md flex items-center"><AiOutlineThunderbolt className="mr-[5px]" /> Featured</span> */}
                {/* <h3 className="absolute bottom-4 left-4 bg-white w-[123px] px-[15px] py-2 rounded-md border font-semibold">{tag.category}</h3> */}
              </div>

              <div className="p-4 cursor-pointer">
                <h2 className="text-[15px] text-black">{tag.name}</h2>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default BusinessesByCities;
