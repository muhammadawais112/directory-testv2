import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useAgencyInfo } from "../../../context/agency";
import { useAppServices } from "../../../hook/services";
import { useUserInfo } from "../../../context/user";
import Loader from "../../../components/loader";

const EventsActivity = () => {
  const AppService = useAppServices();
  const [loader, setLoader] = useState(true);
  const [user] = useUserInfo();
  const [eventActivities, setEventActivities] = useState([]);

  const getEventActivities = async () => {
    try {
      setLoader(true);
      const { response } = await AppService.accounts.getApplyForEvent({
        query: `account_id=${user?._id}`,
      });

      if (response?.success && Array.isArray(response.eventsResults)) {
        setEventActivities(response.eventsResults);
      } else {
        setEventActivities([]);
      }
    } catch (error) {
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    getEventActivities();
  }, []);

  console.log(eventActivities, "eventActivities");

  return (
    <div className="">
      {loader ? (
        <Loader />
      ) : eventActivities?.length > 0 ? (
        <div className="p-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-800 mb-4">
              Your Events Activities Lists
            </h1>
          </div>

          {/* Looping over Job Data */}
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {eventActivities?.length > 0 ? (
              eventActivities.map((data, index) => (
                <div
                  key={index}
                  className="border p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 bg-white"
                >
                  {data?.event_id?.image && (
                    <img
                      src={data?.event_id?.image}
                      alt={data?.event_id?.event_name || "Event Image"}
                      className="w-full h-48 object-cover rounded-md mb-4"
                    />
                  )}

                  <h2 className="text-xl font-bold mb-2">
                    {data?.event_id?.event_name || "No Title"}
                  </h2>

                  <p className="text-gray-600 text-sm mb-2">
                    <span className="font-semibold">Event Date:</span>{" "}
                    {data?.event_id?.event_date}
                  </p>

                  <div className="flex justify-between text-gray-600 text-sm mb-2">
                    <p>
                      <span className="font-semibold">Start:</span>{" "}
                      {data?.event_id?.event_start_time}
                    </p>
                    <p>
                      <span className="font-semibold">End:</span>{" "}
                      {data?.event_id?.event_end_time}
                    </p>
                  </div>

                  <div className="flex justify-between text-gray-600 text-sm mb-2">
                    <p>
                      <span className="font-semibold">Going:</span>{" "}
                      {data?.going ? "Yes" : "No"}
                    </p>
                    <p>
                      <span className="font-semibold">Interested:</span>{" "}
                      {data?.interested ? "Yes" : "No"}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center col-span-full py-8">
                No events found.
              </p>
            )}
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500 py-8">No Data found.</p>
      )}
    </div>
  );
};

export default EventsActivity;
