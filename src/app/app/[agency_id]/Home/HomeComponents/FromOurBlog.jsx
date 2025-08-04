import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import React, { useState } from "react";
import { CgArrowTopRight } from "react-icons/cg";
import sample from "../../assets/Home/sample.svg";
import { useRouter } from "next/navigation";
import Pagination from "@/app/components/Pagination/Pagination";
import Image from "next/image";

const FromOurBlog = ({ blogsData = [], middleware }) => {
  const navigate = useRouter();
  console.log("middleware", middleware);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3; // Show 6 items per page

  // Calculate pagination
  const totalItems = blogsData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBlogs = blogsData.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleViewDetails = (blog) => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    const NavRoute =
      middleware == "/"
        ? `blogs/blogs-detail/${blog?.slug}`
        : `${middleware}/blogs/blogs-detail/${blog?.slug}`;

    navigate.push(`${NavRoute}`);
  };

  return (
    <div>
      <div className="flex items-center justify-between pb-[42px]">
        <h3 className="text-[30px] font-semibold text-black">Blogs</h3>
        <div className="md:flex items-center justify-between">
          {/* <p className="text-sm">Aliquam lacinia diam quis lacus euismod</p> */}
          <span
            onClick={() => navigate.push("/blogs")}
            className="md:mt-0 mt-2 flex items-center space-x-2 font-semibold cursor-pointer text-black"
          >
            See All Listings
            <CgArrowTopRight fontSize={18} />
          </span>
        </div>
      </div>

      {/* Blog Grid with Pagination */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedBlogs.map((blog, index) => (
          <div key={index} className="">
            <div
              onClick={() => handleViewDetails(blog)}
              className="bg-white cursor-pointer relative rounded-[12px] overflow-hidden w-full mx-auto"
            >
              <div className="relative">
                <Image
                  src={blog?.image || sample}
                  alt={blog?.title}
                  width={500}
                  height={220}
                  className="w-full h-[260px] object-cover"
                />
                {blog?.date && (
                  <div className="px-[23px] py-2 bg-white rounded-xl absolute bottom-[-20px] right-[20px] shadow text-center">
                    <p className="text-black">
                      {new Date(blog.date).toLocaleString("en-US", {
                        month: "short",
                      })}
                    </p>
                    <span className="font-semibold text-black">
                      {new Date(blog.date).getDate()}
                    </span>
                  </div>
                )}
              </div>

              <div className="p-4">
                <h2 className="text-[15px] font-semibold mt-1 text-black">
                  {blog?.title}
                </h2>
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
  );
};

export default FromOurBlog;
