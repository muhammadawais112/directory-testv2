"use client";
import React, { useEffect, useState } from "react";
import HomeData from "../Home/HomeComponents/Data";
import { useRouter } from "next/navigation";
import Pagination from "../../app/components/Pagination/Pagination";
import Loader from "../../app/components/loader";

const Tags = () => {
  const navigate = useRouter();
  const { bussinessTags } = HomeData();
  const [currentPage, setCurrentPage] = useState(1);
  const [loader, setLoader] = useState(true);
  const itemsPerPage = 6;

  const totalItems = bussinessTags.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBusinessesTags = bussinessTags.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleTagNavigate = (tag) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    navigate(`/filter-tags/${tag?.slug}`);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    if (bussinessTags && bussinessTags.length > 0) {
      setLoader(false);
    }
  }, [bussinessTags]);

  return (
    <div className="bg-gray-50">
      {loader ? (
        <div className="flex justify-center items-center h-screen bg-white">
          <Loader />
        </div>
      ) : paginatedBusinessesTags?.length > 0 ? (
        <div className="w-[90%] lg:w-[1170px] mx-auto py-[60px]">
            <h3 className="text-[30px] font-semibold mb-2 text-black">Tags</h3>
          <div className="flex justify-between mb-[30px] items-center text-black">
            <p>
              Showing {startIndex + 1}–
              {Math.min(startIndex + itemsPerPage, totalItems)} of {totalItems}{" "}
              results
            </p>
          </div>
          {paginatedBusinessesTags?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedBusinessesTags?.map((tag) => (
                <div
                  key={tag._id}
                  className="bg-white rounded-[12px] border shadow-sm overflow-hidden cursor-pointer transition-transform hover:scale-[1.02]"
                  onClick={() => handleTagNavigate(tag)}
                >
                  <img
                    src={tag.tag_img || '/sample.svg'}
                    alt={tag.name}
                    className="w-full h-[200px] object-cover"
                  />
                  <div className="p-4 text-center">
                    <h2 className="text-sm font-semibold text-gray-800">
                      {tag.name}
                    </h2>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20">
              <p className="text-xl text-gray-600">No Tags Found</p>
            </div>
          )}
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
      ) : (
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-xl text-gray-600">No Tags Found</p>
        </div>
      )}
    </div>
  );
};

export default Tags;
