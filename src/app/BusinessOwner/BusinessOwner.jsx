import React, { useState } from 'react';
import business from '../../assets/BusinessOwners/dropcam.svg'
import Pagination from '../../components/Pagination/Pagination';
import { useNavigate } from 'react-router';

const BusinessOwner = () => {
    // Sample business data (can be fetched from an API)
    const businesses = Array(6).fill({
        name: "All American Real Estate",
        address: "1611 Michigan Ave, Miami Beach, FL 33139",
        listings: 6,
        rating: 4.6,
        logo: business, // Replace with actual image URL
    });

    const [currentPage, setCurrentPage] = useState(1);
    const totalItems = 300;    // e.g. 300
    const itemsPerPage = 20;   // e.g. 20
    const navigate = useNavigate()

    const handlePageChange = (page) => {
        setCurrentPage(page);
        // Additional logic (e.g. fetch new data) goes here
    };

    return (
        <div className="w-[90%] lg:w-[1170px] mx-auto">

            <div className="flex flex-col justify-between ">
                <div className="flex flex-col py-[60px]">
                    <h1 className="text-2xl font-bold">Business Owners</h1>
                    <p className="text-gray-500">Home / For Rent</p>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between mt-4 md:mt-0 ">
                    <div className='flex flex-col md:flex-row space-y-2 md:space-y-0  md:space-x-2'>
                        <input
                            type="text"
                            placeholder="Enter owner's name"
                            className="border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300"
                        />
                        <div className="relative">
                            <button className="border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300 flex items-center">
                                All Categories <i className="fas fa-chevron-down ml-2"></i>
                            </button>
                        </div>
                        <div className="relative">
                            <button className="border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300 flex items-center">
                                All Cities <i className="fas fa-chevron-down ml-2"></i>
                            </button>
                        </div>
                    </div>

                    <div className="relative">
                        <button className="border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300 flex items-center">
                            Sort by <span className="ml-2 font-bold">Newest</span> <i className="fas fa-chevron-down ml-2"></i>
                        </button>
                    </div>
                </div>
            </div>

            {/* Business Cards Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6 ">
                {businesses.map((business, index) => (
                    <div key={index} className="bg-white rounded-lg border p-6">
                        <div className="flex justify-between items-center mb-4">
                            <span className="bg-red-500 text-white text-sm font-semibold px-2 py-1 rounded">
                                {business.listings} Listings
                            </span>
                        </div>
                        <div className="flex justify-center items-center mb-4 h-[180px]">
                            <img src={business.logo} alt="Business logo" className="h-12" />
                        </div>
                        <div className="border-t border-gray-200 pt-4">
                            <div className="flex items-center mb-2">
                                <i className="fas fa-star text-yellow-500"></i>
                                <span className="ml-2 text-gray-700">{business.rating}</span>
                            </div>
                            <div className="text-lg font-semibold text-gray-900">{business.name}</div>
                            <div className="text-gray-600">{business.address}</div>
                            <button onClick={() => navigate('/owner-detail')} className="mt-4 w-full bg-white border border-gray-300 text-gray-700 py-2 rounded-lg flex items-center justify-center">
                                View Listings
                                <i className="fas fa-arrow-right ml-2"></i>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <Pagination
                currentPage={currentPage}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
            />
        </div>
    );
};

export default BusinessOwner;
