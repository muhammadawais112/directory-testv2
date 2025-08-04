"use client";

import { useAgencyInfo } from "@/app/context/agency";
import { useUserInfo } from "@/app/context/user";
import { useAppServices } from "@/app/hook/services";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import sample from "../../../../../assets/Home/sample.svg"
import Pagination from "@/app/components/Pagination/Pagination";
import { BsCheck } from "react-icons/bs";
import { useRouter, useParams } from "next/navigation";
import Loader from "@/app/components/loader";
import Image from "next/image";

const EventsDetail = () => {
  const Service = useAppServices();
  const [agency] = useAgencyInfo();
  const [user] = useUserInfo();
  const router = useRouter();
  const { agency_id, slug } = useParams();

  const [loader, setLoader] = useState(true);
  const [eventActivities, setEventActivities] = useState([]);
  const [eventDetail, setEventDetail] = useState(null);
  const [eventsData, setEventsData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const theme_content = agency?.theme_id?.theme_data;
  const itemsPerPage = 3;
  const totalItems = eventsData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEvents = eventsData.slice(startIndex, startIndex + itemsPerPage);

  const middleware = agency_id ? `/app/${agency_id}/` : `/`;

  const getSingleEvent = async () => {
    if (!slug || !agency?._id) return;

    const { response } = await Service.events.GetSingleEvent({
      query: `agency_id=${agency._id}&slug=${slug}`,
    });

    if (response) setEventDetail(response.data);
  };

  const getEvents = async () => {
    if (!agency?._id) return;

    const { response } = await Service.events.Get({
      query: `agency_id=${agency._id}`,
    });

    if (response) {
      setEventsData(response.data);
      setLoader(false);
    }
  };

  const getEventActivities = async () => {
    if (!user?._id) return;

    try {
      const { response } = await Service.accounts.getApplyForEvent({
        query: `account_id=${user._id}`,
      });

      if (response?.success && Array.isArray(response.data)) {
        setEventActivities(response.data);
      } else {
        setEventActivities([]);
        console.error("Failed to fetch event activities:", response?.message);
      }
    } catch (error) {
      console.error("Error fetching event activities:", error);
    }
  };

  const isEventMarked = (eventId, action) => {
    const activity = eventActivities?.find((a) => a.event_id === eventId);
    return activity ? activity[action] : false;
  };

  const handleEventAction = async (eventId, action) => {
    try {
      const existingActivity = eventActivities?.find(
        (activity) => activity?.event_id === eventId
      );

      const isMarked = existingActivity ? existingActivity[action] : false;

      const payload = {
        _id: existingActivity?._id,
        event_id: eventId,
        account_id: user?._id,
        agency_id: agency?._id,
        interested:
          action === "interested"
            ? !isMarked
            : existingActivity?.interested || false,
        going:
          action === "going"
            ? !isMarked
            : existingActivity?.going || false,
      };

      const { response } = await Service.accounts.applyForEvent({ payload });

      if (response?.success) {
        const updated = eventActivities.filter(
          (activity) => activity?.event_id !== eventId
        );
        updated.push(response.data);
        setEventActivities(updated);

        await getEventActivities();

        toast.success(
          action === "interested"
            ? isMarked
              ? "Marked as Not Interested"
              : "Marked as Interested"
            : isMarked
              ? "Canceled Going"
              : "Marked as Going"
        );
      }
    } catch (error) {
      console.error("Error toggling event action:", error);
    }
  };

  const handleViewDetails = (eventData) => {
    if (!eventData?.slug) return;

    window.scrollTo({ top: 0, behavior: "smooth" });
    router.push(`${middleware}events/event-detail/${eventData.slug}`);
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

  useEffect(() => {
    getEvents();
    getEventActivities();
  }, [agency?._id, user?._id]);

  useEffect(() => {
    getSingleEvent();
  }, [slug, agency?._id]);

  if (loader) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

  if (!eventDetail) {
    return (
      <p className="text-center text-gray-500">No event data available.</p>
    );
  }

  return (
    <div className="">
      <Image
        src={eventDetail?.image || sample}
        alt="banner"
        className="!w-full h-[500px] object-cover"
      />

      <div className="w-[90%] lg:w-[1170px] mx-auto py-[60px]">
        <div className="bg-white p-6 rounded-lg shadow w-full my-8">
          <h1 className="text-xl font-bold mb-4">
            {eventDetail?.event_name} ({eventDetail?.event_date})
          </h1>

          <div
            className="text-gray-700 mb-4"
            dangerouslySetInnerHTML={{
              __html: eventDetail?.event_description?.replace(/\n/g, "<br />"),
            }}
          ></div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <p className="font-semibold">Address</p>
              <p>{eventDetail?.event_location}</p>
            </div>
            <div>
              <p className="font-semibold">Event Date</p>
              <p>{eventDetail?.event_date}</p>
            </div>
            <div>
              <p className="font-semibold">Start Time</p>
              <p>{formatTo12Hour(eventDetail?.event_start_time)}</p>
            </div>
            <div>
              <p className="font-semibold">End Time</p>
              <p>{formatTo12Hour(eventDetail?.event_end_time)}</p>
            </div>
          </div>

          <div className="mb-8 space-x-2">
            <button
              style={{
                background:
                  theme_content?.general?.button_bg || "#EF4444",
                color: theme_content?.general?.button_text || "#fff",
              }}
              onClick={() =>
                user?._id
                  ? handleEventAction(eventDetail._id, "interested")
                  : router.push("/login")
              }
              className={`px-4 py-2 rounded-md text-sm ${isEventMarked(eventDetail._id, "interested")
                ? "bg-red-600 text-white hover:bg-red-700 transition"
                : "bg-green-600 text-white hover:bg-green-700 transition"
                }`}
            >
              {user?._id
                ? isEventMarked(eventDetail._id, "interested")
                  ? (
                    <>
                      <BsCheck className="inline-block mr-2 text-lg" />
                      Interested
                    </>
                  )
                  : "Interested"
                : "Login to Mark Interested"}
            </button>

            <button
              style={{
                background:
                  theme_content?.general?.button_bg || "#EF4444",
                color: theme_content?.general?.button_text || "#fff",
              }}
              onClick={() =>
                user?._id
                  ? handleEventAction(eventDetail._id, "going")
                  : router.push("/login")
              }
              className={`px-4 py-2 rounded-md text-sm ${isEventMarked(eventDetail._id, "going")
                ? "bg-red-600 text-white hover:bg-red-700 transition"
                : "bg-green-600 text-white hover:bg-green-700 transition"
                }`}
            >
              {user?._id
                ? isEventMarked(eventDetail._id, "going")
                  ? (
                    <>
                      <BsCheck className="inline-block mr-2 text-lg" />
                      Attending
                    </>
                  )
                  : "Attending"
                : "Login to Mark Attending"}
            </button>
          </div>
        </div>

        {/* Related Events */}
        {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {paginatedEvents.map((eventData, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
              onClick={() => handleViewDetails(eventData)}
              role="button"
              tabIndex={0}
              aria-label={`View details for ${eventData?.event_name}`}
            >
              <div className="relative h-48">
                <img
                  src={eventData?.image || sample}
                  alt={eventData?.event_name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = sample;
                  }}
                />
                {eventData?.event_date && (
                  <div className="px-[23px] py-2 bg-white rounded-xl absolute bottom-[-20px] right-[20px] shadow text-center">
                    <p className="text-sm text-gray-600">
                      {new Date(eventData.event_date).toLocaleString("en-US", {
                        month: "short",
                      })}
                    </p>
                    <span className="font-semibold text-gray-800">
                      {new Date(eventData.event_date).getDate()}
                    </span>
                  </div>
                )}
              </div>

              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  {eventData?.event_name}
                </h2>
                <div className="space-y-2 text-gray-600">
                  <p className="flex items-center">
                    <i className="fas fa-clock text-gray-500 mr-2"></i>
                    {formatTo12Hour(eventData?.event_start_time)} -{" "}
                    {formatTo12Hour(eventData?.event_end_time)}
                  </p>
                  <p className="flex items-center">
                    <i className="fas fa-map-marker-alt text-gray-500 mr-2"></i>
                    {eventData?.event_location}
                  </p>
                </div>

                <button
                  onClick={() => handleViewDetails(eventData)}
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
        </div> */}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pt-12">
            <Pagination
              currentPage={currentPage}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsDetail;
