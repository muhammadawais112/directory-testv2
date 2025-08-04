import React, { useState } from 'react'
import AddReviews from '../../../components/Reviews/AddReviews';
import ShowReviews from '../../../components/Reviews/ShowReviews';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { LuCopyPlus } from 'react-icons/lu';
import { CiHeart } from 'react-icons/ci';
import { AiOutlineThunderbolt } from 'react-icons/ai';

const OwnerDetail = () => {
    const [isExpanded, setIsExpanded] = useState(false);

    const listings = [
        {
            imageUrl: "https://placehold.co/330x220", // Replace with real images
            title: "Luxury Apartment",
            location: "New York, NY",
            category: "For Rent",
        },
        {
            imageUrl: "https://placehold.co/330x220",
            title: "Modern House",
            location: "Los Angeles, CA",
            category: "For Sale",
        },
        {
            imageUrl: "https://placehold.co/330x220",
            title: "Cozy Studio",
            location: "San Francisco, CA",
            category: "For Rent",
        },
        {
            imageUrl: "https://placehold.co/330x220",
            title: "Beach House",
            location: "Miami, FL",
            category: "For Sale",
        },
    ];


    return (
        <div>
            <div className="container mx-auto my-[60px]">
                <div className=" py-[60px] bg-[#FEF4F3] px-[60px] rounded-lg flex items-center space-x-6 ">
                    <div className="relative">
                        <img alt="Profile picture of Ali Tufan" className="rounded-full shadow-lg" height="100" src="https://storage.googleapis.com/a1aa/image/9yoSNoTq1IJRjVg32oKHF28vC3N97ngxfp2quHLEChY.jpg" width="100" />
                    </div>
                    <div className="text-black">
                        <h1 className="text-2xl font-bold">
                            Ali Tufan
                        </h1>
                        <p className="text-sm">
                            Owner at
                            <span className="font-bold pl-1">
                                Business Name
                            </span>
                        </p>
                        <div className="flex items-center space-x-2 mt-2">
                            <span className="text-yellow-400">
                                <i className="fas fa-star">
                                </i>
                            </span>
                            <span className="text-sm">
                                5.0 • 49 Reviews
                            </span>
                            <span className="text-sm">
                                |
                            </span>
                            <span className="text-sm">
                                <i className="fas fa-phone-alt">
                                </i>
                                +848 032 03 01
                            </span>
                            <span className="text-sm">
                                |
                            </span>
                            <span className="text-sm">
                                <i className="fas fa-mobile-alt">
                                </i>
                                +848 032 03 01
                            </span>
                        </div>
                        <div className="flex space-x-4 mt-4">
                            <a className="text-white" href="#">
                                <i className="fab fa-facebook-f">
                                </i>
                            </a>
                            <a className="text-white" href="#">
                                <i className="fab fa-twitter">
                                </i>
                            </a>
                            <a className="text-white" href="#">
                                <i className="fab fa-instagram">
                                </i>
                            </a>
                            <a className="text-white" href="#">
                                <i className="fab fa-linkedin-in">
                                </i>
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-[90%] lg:w-[1170px] mx-auto">

                <div className="flex flex-col md:flex-row gap-6 ">
                    {/* Left Section (70%) */}
                    <div className="w-full md:w-[70%]">
                        <div className="max-w-2xl mx-auto p-4">
                            <h2 className="text-lg font-semibold mb-2">About Ali Tufan</h2>

                            <p className="text-gray-700">
                                It is a long established fact that a reader will be distracted by the readable content
                                of a page when looking at its layout. The point of using Lorem Ipsum is that it has
                                a more-or-less normal distribution of letters, as opposed to using 'Content here,
                                content here', making it look like readable English.

                                {isExpanded && (
                                    <span>
                                        {" "}
                                        Many desktop publishing packages and web page editors now use Lorem Ipsum as their
                                        default model text, and a search for 'lorem ipsum' will uncover many web sites still
                                        in their infancy.
                                    </span>
                                )}
                            </p>

                            <button
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="mt-2 text-black font-semibold hover:underline"
                            >
                                {isExpanded ? "Show less" : "Show more"}
                            </button>
                        </div>

                        <div className='py-[60px]'>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {listings.map((listing, index) => (
                                    <div
                                        key={index}
                                        className="bg-white relative rounded-[12px] border overflow-hidden h-[360px] md:h-[378px] w-[300px] md:w-[330px] mx-auto"
                                    >
                                        {/* Image & Labels */}
                                        <div className="relative">
                                            <img
                                                src={listing.imageUrl}
                                                alt={listing.title}
                                                className="w-full h-[220px] object-cover"
                                            />
                                            <span className="absolute top-4 left-4 bg-red-500 text-white text-xs font-semibold uppercase px-2 py-1 rounded-md flex items-center">
                                                <AiOutlineThunderbolt className="mr-[5px]" /> Featured
                                            </span>
                                            <h3 className="absolute bottom-4 left-4 bg-white w-[123px] px-[15px] py-2 rounded-md border font-semibold">
                                                {listing.category}
                                            </h3>
                                        </div>

                                        {/* Content */}
                                        <div className="p-4">
                                            <h2 className="text-lg font-semibold">{listing.title}</h2>
                                            <p className="text-gray-600">{listing.location}</p>
                                        </div>

                                        {/* Icons Section */}
                                        <div className="absolute bottom-2 w-full px-4 pt-2">
                                            <div className="border-t pt-2 flex justify-end space-x-3">
                                                <span className="w-8 h-8 flex justify-center items-center">
                                                    <FaExternalLinkAlt />
                                                </span>

                                                <span className="w-8 h-8 flex justify-center items-center">
                                                    <LuCopyPlus />
                                                </span>

                                                {/* <span className="w-8 h-8 flex justify-center items-center rounded-md bg-slate-200">
                                                    <CiHeart />
                                                </span> */}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className=''>
                            <ShowReviews />
                        </div>

                        <div className='py-[60px]'>
                            <AddReviews />
                        </div>
                    </div>

                    {/* Right Section (30%) */}
                    <div className="w-full md:w-[30%] space-y-8">

                        {/* Contact Form */}
                        <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg mx-auto">
                            <h2 className="text-xl font-semibold mb-4">Contact Form</h2>
                            <form className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Name"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300"
                                />
                                <input
                                    type="text"
                                    placeholder="Phone"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300"
                                />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300"
                                />
                                <textarea
                                    placeholder="Enter Your Messages"
                                    className="w-full p-3 border border-gray-300 rounded-lg h-32 focus:outline-none focus:ring-2 focus:ring-gray-300"
                                ></textarea>

                                {/* Buttons */}
                                <button
                                    type="submit"
                                    className="w-full bg-red-500 text-white p-3 rounded-lg flex items-center justify-center gap-2 hover:bg-red-600 transition"
                                >
                                    <span>Send Message</span>
                                    <i className="fas fa-arrow-right"></i>
                                </button>

                                <button
                                    type="button"
                                    className="w-full border border-gray-300 p-3 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-200 transition"
                                >
                                    <span>Call</span>
                                    <i className="fas fa-arrow-right"></i>
                                </button>
                            </form>
                        </div>

                        {/* Professional Information */}
                        <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg mx-auto">
                            <h2 className="text-xl font-semibold mb-4">Professional Information</h2>
                            <div className="space-y-2 text-gray-700">

                                <div className="flex justify-between">
                                    <span className="font-semibold">Broker Address:</span>
                                    <span>50 Berkshire Ct. PA 19610</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="font-semibold">Office:</span>
                                    <span>(484) 524-3699</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="font-semibold">Mobile:</span>
                                    <span>(484) 524-7963</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="font-semibold">Fax:</span>
                                    <span>(484) 524-1023</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="font-semibold">Website:</span>
                                    <span className="text-blue-500 underline">www.realton.com</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="font-semibold">Member since:</span>
                                    <span>10-01-2022</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>

    )
}

export default OwnerDetail