import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import React from 'react';
import Slider from 'react-slick';
import sample from '../../assets/Home/sample.svg'
import { AiOutlineThunderbolt } from "react-icons/ai";
import { FaExternalLinkAlt } from "react-icons/fa";
import { LuCopyPlus } from "react-icons/lu";
import { CiHeart } from "react-icons/ci";
import { CgArrowTopRight } from "react-icons/cg";
import securityIcon from '../../assets/Home/security-icon.svg'


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

const ListingTypes = () => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 5,
        arrows: false,
        responsive: [
            {
                breakpoint: 1024,
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

            <div className='flex flex-col justify-center text-center pb-[42px]'>
                <h3 className='text-[30px] font-semibold'>
                    Explore Listing Types
                </h3>

                <p className='text-sm'>Aliquam lacinia diam quis lacus euismod</p>
            </div>

            <Slider {...settings}>
                {listingsData.map((listing, index) => (
                    <div key={listing.id} className="">
                        <div className={`p-[30px] ${index === 0 ? 'bg-white text-black' : 'bg-transparent text-white'} relative rounded-[12px] overflow-hidden w-[210px] mx-auto`}>
                            <span className={`w-[70px] h-[70px] ${index === 0 ? 'bg-white' : 'bg-[#ED7664]'} bg-[#FEF4F3] flex justify-center items-center rounded-full`}>
                                <img src={securityIcon} alt="icon" className='object-cover' />
                            </span>

                            <div className="mt-[33px]">
                                <h2 className="text-[15px] font-semibold">{listing.title}</h2>
                                <p className=" text-[13px]">{listing.location}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default ListingTypes;
