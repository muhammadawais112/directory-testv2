'use client';
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
// import { useNavigate, useParams } from 'react-router';
import { useParams } from 'next/navigation';
import Image from 'next/image';
// import { useAppServices } from '../../../hook/services';
// import { useAgencyInfo } from '../../../context/agency';
// import banner from '../../../assets/Blogs/main.png'
import banner from '@/app/assets/Blogs/main.png'
// import Pagination from '../../../components/Pagination/Pagination';
// import sample from "../../../assets/Home/sample.svg";
import { useAgencyInfo } from '@/app/context/agency';
import { useAppServices } from '@/app/hook/services';
import Pagination from '@/app/components/Pagination/Pagination';
import sample from "@/app/assets/Home/sample.svg";



const NewsFeedDetail = () => {
  const Service = useAppServices();
  const [agency] = useAgencyInfo();
  const [loader, setLoader] = useState(true);
  const navigate = useRouter();
  const [newsFeedsData, setNewsFeedsData] = useState([]);
  const [news, setNews] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3; // Show 6 items per page
  const totalItems = newsFeedsData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBlogs = newsFeedsData.slice(startIndex, startIndex + itemsPerPage);
  const { agency_id, slug } = useParams()
  let middleware = `/`
  if (agency_id) {
    middleware = `/app/${agency_id}/`
  }
  const getSingleNewsFeeds = async () => {
    const { response } = await Service.newsFeed.GetSingleNews({
      query: `agency_id=${agency._id}&slug=${slug}`,
    });
    if (response) {
      setNews(response?.data)
    }
  };


  const getNewsFeeds = async () => {
    const { response } = await Service.newsFeed.Get({
      query: `agency_id=${agency._id}`,
    });
    if (response) {
      setNewsFeedsData(response.data); // Assuming API returns a list of news feeds
      setLoader(false);
    }
  };

  useEffect(() => {
    getNewsFeeds();
    getSingleNewsFeeds();
  }, [slug]);

  // Conditional rendering happens here after all hooks
  if (!news) {
    return <p className="text-center text-gray-500">No news feed available.</p>;
  }
  const handleViewDetails = (news) => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    navigate.push(`${middleware}news-feeds/news-feed-detail/${news?.slug}`);
  }; // It should log the API key to the console

  const relatedNews = newsFeedsData.filter(
    (n) => n?.title !== news?.title
  );



  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <Image src={news?.image || banner} alt="banner" className='!w-full h-[500px] object-cover' />

      <div className='w-[90%] lg:w-[1170px] mx-auto '>
        <div className="py-[60px]">
          <h1 className="text-2xl font-semibold mb-4">{news?.title}</h1>
          <p className="mb-4">
            <div
              className="text-gray-700"
              dangerouslySetInnerHTML={{ __html: news?.description }}
            ></div>
          </p>
        </div>
        <div className='pb-[60px]'>
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-6">
            {newsFeedsData.map((news, index) => (
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
    </div>
  )
}

export default NewsFeedDetail