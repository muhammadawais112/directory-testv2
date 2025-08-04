import React from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useUserInfo } from '../../context/user';
import { useRouter, useParams } from 'next/navigation';
import { useAgencyInfo } from '../../context/agency';

const Pagination = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
}) => {
  // Calculate total pages
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Generate page numbers array with ellipses
  const generatePageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      // Show all pages if total pages <= 5
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // If near the start
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      }
      // If near the end
      else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      }
      // Otherwise, somewhere in the middle
      else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  const pageNumbers = generatePageNumbers();

  // Calculate item range (e.g., 1 - 20)
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  let endItem = currentPage * itemsPerPage;
  if (endItem > totalItems) {
    endItem = totalItems;
  }

  // Handle page change clicks
  const handlePageChange = (page) => {
    // Ignore clicks on ellipses or invalid pages
    if (page === '...' || page < 1 || page > totalPages) return;
    onPageChange(page);
  };

  const [user, , clear] = useUserInfo();
  const navigate = useRouter();
  const { agency_id } = useParams();
  const [agency] = useAgencyInfo();
  const theme_content = agency?.theme_id?.theme_data;
  const themeContentObject = theme_content?.content;

  return (
    <div className="flex flex-col items-center space-y-4 my-6">
      {/* Pagination Controls */}
      <div className="flex items-center space-x-2">
        {/* Left Arrow */}
        <button
          className="w-[40px] h-[40px] rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:text-[#181A20] disabled:opacity-50"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <FiChevronLeft />
        </button>

        {/* Page Number Buttons */}
        {pageNumbers.map((page, index) => {
          if (page === '...') {
            return (
              <span
                key={index}
                className="w-[40px] h-[40px] flex items-center justify-center text-gray-400"
              >
                ...
              </span>
            );
          }

          const isActive = page === currentPage;
          return (
            <button
              key={index}
              onClick={() => handlePageChange(page)}
              style={{
                backgroundColor: isActive
                  ? theme_content?.general?.button_bg || "#EF4444"
                  : "#fff",
                color: isActive
                  ? theme_content?.general?.button_text || "#fff"
                  : "#181A20",
              }}
              className={[
                'w-[40px] h-[40px] rounded-full flex items-center justify-center border border-gray-300',
                'hover:bg-gray-100 transition'
              ].join(' ')}
            >
              {page}
            </button>
          );
        })}

        {/* Right Arrow */}
        <button
          className="w-[40px] h-[40px] rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:text-black disabled:opacity-50"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <FiChevronRight />
        </button>
      </div>

      {/* Item Range and Total Count */}
      <div className="text-sm text-[#181A20]">
        {`${startItem} - ${endItem} of ${totalItems}+ listings available`}
      </div>
    </div>
  );
};

export default Pagination;
