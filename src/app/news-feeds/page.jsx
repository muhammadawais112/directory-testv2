'use client';
import React, { useEffect, useState } from 'react'
// import { useAppServices } from '../../hook/services';
// import { useAgencyInfo } from '../../context/agency';
import Image from 'next/image';
import { useNavigate, useParams } from "react-router";
import { useRouter } from 'next/navigation';
// import { useUserInfo } from '../../context/user';
// import Loader from '../../components/loader';
import Loader from '@/app/components/loader';
// import Pagination from '../../components/Pagination/Pagination';
import Pagination from '../components/Pagination/Pagination';
// import sample from "../../assets/Home/sample.svg";
import sample from "../assets/Home/sample.svg";
import { useAppServices } from '../hook/services';
import { useAgencyInfo } from '../context/agency';
import { useUserInfo } from '../context/user';

const NewsFeeds = () => {
    const Service = useAppServices();
    const [agency] = useAgencyInfo();
    const [data, setData] = useState([]);
    const [loader, setLoader] = useState(true);
    const [showAll, setShowAll] = useState(false);
    const router = useRouter();
    const [newsFeedsData, setNewsFeedsData] = useState([]);
    const [user] = useUserInfo();
    const theme_content = agency?.theme_id?.theme_data;
    const themeContentObject = theme_content?.content;


    const { agency_id } = useParams();
    let middleware = `/`;
    if (agency_id) {
        middleware = `/app/${agency_id}/`;
    }
    const getNewsFeeds = async () => {
        const { response } = await Service.newsFeed.Get({
            query: `agency_id=${agency?._id}`,
        });
        if (response) {
            setNewsFeedsData(response?.data); // Assuming API returns a list of news feeds
            setLoader(false);
        }
    };

    useEffect(() => {
        getNewsFeeds();
    }, []);

    const handleViewDetails = (news) => {
        router.push(`${middleware}news-feeds/news-feed-detail/${news?.slug}`);
    };

    console.log(newsFeedsData, 'newsFeedsData')


    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3; // Show 6 items per page

    // Calculate pagination
    const totalItems = newsFeedsData.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedBlogs = newsFeedsData.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div>
            {loader ? (
                <Loader />
            ) : newsFeedsData.length > 0 ? (
                <>
                    <div className='w-[90%] lg:w-[1170px] mx-auto py-[60px]'>
                        <div className='flex flex-col  pb-[60px]'>
                            <h3 className='text-[30px] font-semibold'>
                                NewsFeed
                            </h3>

                            <p className='text-sm'>Home / NewsFeed</p>
                        </div>

                        <div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-6">
                                {paginatedBlogs.map((news, index) => (
                                    <div key={index} className="">
                                        <div
                                            onClick={() => handleViewDetails(news)}
                                            className="bg-white cursor-pointer relative rounded-[12px] overflow-hidden w-full mx-auto"
                                        >
                                            <div className="relative">
                                                <Image
                                                    src={news?.image || sample}
                                                    alt={news?.title}
                                                    className="w-full h-[260px] object-cover"
                                                    width={500}

                                                />
                                                {news?.date && (
                                                    <div className="px-[23px] py-2 bg-white rounded-xl absolute bottom-[-20px] right-[20px] shadow text-center">
                                                        <p>{new Date(news.date).toLocaleString("en-US", { month: "short" })}</p>
                                                        <span className="font-semibold">{new Date(news.date).getDate()}</span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="p-4 pl-0">
                                                <h2 className="text-[15px] font-semibold mt-1">{news?.title}</h2>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="pt-8">
                                    <Pagination
                                        currentPage={currentPage}
                                        totalItems={totalItems}
                                        itemsPerPage={itemsPerPage}
                                        onPageChange={handlePageChange}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </>
            ) : (
                <p className="text-center text-gray-500 py-8">No NewsFeed found.</p>
            )}
        </div>
    )
}

export default NewsFeeds