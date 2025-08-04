import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import React from 'react';
import Slider from 'react-slick';
import sample from '../../../../assets/Home/sample.svg'
import { AiOutlineThunderbolt } from "react-icons/ai";
import { FaExternalLinkAlt } from "react-icons/fa";
import { LuCopyPlus } from "react-icons/lu";
import { CiHeart } from "react-icons/ci";
import { CgArrowTopRight } from "react-icons/cg";
import { FaQuoteRight, FaStar } from 'react-icons/fa';
import bg from "../../../../assets/Home/bg.png";

const listingsData = [
  {
    id: 1,
    imageUrl: sample,
    category: "Category",
    title: "Listing Title",
    location: "22 Listings"
  },
  {
    id: 2,
    imageUrl: sample,
    category: "Category",
    title: "Listing Title",
    location: "22 Listings"
  },
  {
    id: 3,
    imageUrl: sample,
    category: "Category",
    title: "Listing Title",
    location: "22 Listings"
  },
  {
    id: 4,
    imageUrl: sample,
    category: "Category",
    title: "Listing Title",
    location: "22 Listings"
  },
  {
    id: 5,
    imageUrl: sample,
    category: "Category",
    title: "Listing Title",
    location: "22 Listings"
  },
  {
    id: 6,
    imageUrl: sample,
    category: "Category",
    title: "Listing Title",
    location: "22 Listings"
  },
];

const Testimonial = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    arrows: false,
    responsive: [
      {
        breakpoint: 1100,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1
        }
      }
    ]
  };

  return (
    <div className="container mx-auto">

      <div className='flex flex-col justify-start pb-[42px]'>
        <h3 className='text-[30px] font-semibold'>
          What are people saying about us
        </h3>

        <div className="md:flex items-center justify-between">
          <p className='text-sm'>Aliquam lacinia diam quis lacus euismod</p>

          <span className=" md:mt-0 mt-2 flex items-center space-x-2 font-semibold">
            See All Listings

            <CgArrowTopRight fontSize={18} />
          </span>
        </div>
      </div>

      <Slider {...settings}>
        {listingsData.map(listing => (
          <div key={listing.id} className="">
            <div className="bg-white relative rounded-[12px] border overflow-hidden sm:mx-4 p-6">
              {/* Quotation icon in top-right corner */}
              <FaQuoteRight className="absolute top-4 right-4 text-pink-300 text-3xl" />

              {/* Title */}
              <h2 className="text-base font-semibold mb-4">Great Work</h2>

              {/* Quote Text */}
              <p className="text-sm md:text-base text-gray-600 italic">
                “Amazing design, easy to customize and a design quality superlative
                account on its cloud platform for the optimized performance. And we
                didn’t on our original designs.”
              </p>

              {/* Star Rating */}
              <div className="mt-4 pb-4 flex items-center space-x-1">
                {Array(5)
                  .fill(0)
                  .map((_, index) => (
                    <FaStar key={index} className="text-yellow-500 text-[10px]" />
                  ))}
              </div>

              {/* User Info */}
              <div className="pt-4  border-t flex items-center">
                {/* Replace this placeholder with your user avatar URL */}
                <img
                  src={bg}
                  alt="User Avatar"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="ml-3">
                  <p className="text-sm font-semibold">Leslie Alexander</p>
                  <p className="text-xs text-gray-400">Nintendo</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Testimonial;
