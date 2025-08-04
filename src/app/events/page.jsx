"use client";

import React, { useEffect, useState } from "react";
import Pagination from "../components/Pagination/Pagination";
import { useAppServices } from "../hook/services";
import { useAgencyInfo } from "../context/agency";
import { useUserInfo } from "../context/user";
import { useRouter, useParams } from "next/navigation";
import sample from "../assets/Home/sample.svg";
import Loader from "../components/loader";
import Image from "next/image";

const Events = () => {
  const Service = useAppServices();
  const [agency] = useAgencyInfo();
  const [user] = useUserInfo();
  const [loader, setLoader] = useState(true);
  const [eventsData, setEventsData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  const { agency_id } = useParams();

  const theme_content = agency?.theme_id?.theme_data;
  const itemsPerPage = 3;

  const totalItems = eventsData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEvents = eventsData.slice(startIndex, startIndex + itemsPerPage);

  const middleware = agency_id ? `/app/${agency_id}/` : `/`;

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getEvents = async () => {
    if (!agency?._id) return;

    const { response } = await Service.events.Get({
      query: `agency_id=${agency._id}`,
    });

    if (response) {
      setEventsData(response.data);
    }
    setLoader(false);
  };

  useEffect(() => {
    if (agency?._id) {
      getEvents();
    }
  }, [agency?._id]);

  const handleViewDetails = (event) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    router.push(`${middleware}events/event-detail/${event?.slug}`);
  };

  const formatTo12Hour = (time24) => {
    if (!time24) return "";
    const [hour, minute] = time24.split(":");
    const date = new Date();
    date.setHours(+hour);
    date.setMinutes(+minute);
    return date.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="bg-gray-50 py-12">
      {loader ? (
        <div className="flex justify-center items-center h-screen">
          <Loader />
        </div>
      ) : eventsData.length > 0 ? (
        <div className="w-[90%] lg:w-[1170px] mx-auto">
          <div className="flex flex-col pb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Events</h1>
            <p className="text-sm text-gray-500">Home / Events</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {paginatedEvents.map((event, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                onClick={() => handleViewDetails(event)}
                role="button"
                tabIndex={0}
                aria-label={`View details for ${event?.event_name}`}
              >
                <div className="relative h-48 w-full">
                  <Image
                    src={event?.image || sample}
                    alt={event?.event_name || "event"}
                    fill
                    className="object-cover"
                    sizes="100vw"
                    priority={index === 0}
                  />
                  {event?.event_date && (
                    <div className="px-[23px] py-2 bg-white rounded-xl absolute bottom-[-20px] right-[20px] shadow text-center">
                      <p className="text-sm text-gray-600">
                        {new Date(event.event_date).toLocaleString("en-US", {
                          month: "short",
                        })}
                      </p>
                      <span className="font-semibold text-gray-800">
                        {new Date(event.event_date).getDate()}
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    {event?.event_name}
                  </h2>
                  <div className="space-y-2 text-gray-600">
                    <p className="flex items-center">
                      <i className="fas fa-clock text-gray-500 mr-2"></i>
                      {formatTo12Hour(event?.event_start_time)} -{" "}
                      {formatTo12Hour(event?.event_end_time)}
                    </p>
                    <p className="flex items-center">
                      <i className="fas fa-map-marker-alt text-gray-500 mr-2"></i>
                      {event?.event_location}
                    </p>
                  </div>

                  <button
                    onClick={() => handleViewDetails(event)}
                    className="w-full mt-4 px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
                    style={{
                      background: theme_content?.general?.button_bg || "#EF4444",
                      color: theme_content?.general?.button_text || "#fff",
                    }}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pt-12">
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
          <p className="text-xl text-gray-600">No Events Found</p>
        </div>
      )}
    </div>
  );
};

export default Events;
