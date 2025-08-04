"use client";
import React, { useEffect, useRef, useState } from "react";
import { useRouter, useParams } from "next/navigation";
// import { v4 as uuidv4 } from "uuid";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { useAppServices, useUploadImage } from "@/app/hook/services";
import { useAgencyInfo } from "@/app/context/agency";

function Events({ formData, handleRefresh }) {
  const [agency] = useAgencyInfo();
  const theme_content = agency?.theme_id?.theme_data;
  const AppService = useAppServices();
  const uploadImage = useUploadImage();
  const navigate = useRouter();
  const { agency_id } = useParams();
  let middleware = `/`;
  if (agency_id) {
    middleware = `/app/${agency_id}/`;
  }
  const [eventsData, setEventsData] = useState([]);

  const getEvents = async () => {
    const { response } = await AppService.events.Get({
      query: `account_id=${formData._id}`,
    });
    if (response) {
      setEventsData(response.data); // Assuming API returns a list of events
    }
  };

  const [success, setSuccess] = useState("");
  const [popup, setPopup] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(false);

  const quillRef = useRef(null);
  const quillInstance = useRef(null);

  const [applicantsPopup, setApplicantsPopup] = useState(false);
  const [applicants, setApplicants] = useState([]);
  const [currentFormData, setCurrentFormData] = useState({
    event_name: "",
    event_date: "",
    event_start_time: "",
    event_end_time: "",
    image: null,
  });

  useEffect(() => {
    if (popup) {
      setTimeout(() => {
        if (quillRef.current && !quillInstance.current) {
          quillInstance.current = new Quill(quillRef.current, {
            theme: "snow",
            placeholder: "Event Description...",
            modules: {
              toolbar: [
                [{ header: [1, 2, false] }],
                ["bold", "italic", "underline"],
                ["image", "code-block"],
              ],
            },
          });
        }

        if (quillInstance.current) {
          quillInstance.current.root.innerHTML =
            selectedEvent?.event_description || "";
        }
      }, 100);
    }

    return () => {
      if (!popup && quillInstance.current) {
        quillInstance.current = null;
      }
    };
  }, [popup, selectedEvent]);

  const closeApplicantsPopup = () => setApplicantsPopup(false);

  const openPopup = () => setPopup(true);

  const closePopup = () => {
    setPopup(false);
    setSelectedEvent(null);
    setCurrentFormData({
      event_name: "",
      event_date: "",
      event_start_time: "",
      event_end_time: "",
      image: null,
    });
    if (quillInstance.current) {
      quillInstance.current.root.innerHTML = "";
    }
    setSuccess("");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setCurrentFormData((prevData) => ({
      ...prevData,
      image: file,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const description = quillInstance.current?.root.innerHTML || "";

    const image = e.target.image.files[0];
    let image_url = selectedEvent?.image || "";

    if (image) {
      try {
        const uploadResponse = await uploadImage({
          file: image,
          desiredPath: "events",
        });
        image_url = uploadResponse.response.data;
      } catch (error) {
        console.error("Image upload failed:", error);
        setSuccess("Image upload failed.");
        setLoading(false);
        return;
      }
    }

    const payload = {
      event_name: currentFormData.event_name,
      event_date: currentFormData.event_date,
      event_description: description,
      event_start_time: currentFormData.event_start_time,
      event_end_time: currentFormData.event_end_time,
      event_location: currentFormData.event_location,
      image: image_url,
      account_id: formData._id,
      agency_id: formData.agency_id,
    };

    let response;

    if (selectedEvent) {
      // Update event
      response = await AppService.events.Update({
        payload: { ...payload, _id: selectedEvent._id }, // Include _id for update
      });
    } else {
      // Create new event
      response = await AppService.events.Create({ payload });
    }

    if (response) {
      handleRefresh();
      setSuccess(
        selectedEvent
          ? "Event updated successfully!"
          : "New event created successfully!"
      );
      closePopup();
      setSelectedEvent(null);
      getEvents(); // Refresh events after update/create
    }

    setLoading(false);
  };

  const handleEdit = (event) => {
    console.log(event, "event");
    setSelectedEvent(event); // Set the selected event for editing
    setCurrentFormData({
      event_name: event.event_name,
      event_date: event.event_date,
      event_description: event.event_description,
      event_start_time: event.event_start_time,
      event_end_time: event.event_end_time,
      event_location: event.event_location,
      image: event.image,
      account_id: formData._id,
      agency_id: agency?._id,
    });
    openPopup();
  };

  const handleDelete = async (event) => {
    setLoading(true);
    try {
      const { response } = await AppService.events.Delete({
        query: `_id=${event._id}`, // ✅ Send event ID for deletion
      });

      if (response) {
        handleRefresh();
        setSuccess("Event deleted successfully!");
        getEvents();
      }
    } catch (error) {
      console.error("Error deleting event:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setSuccess("");
  };

  useEffect(() => {
    getEvents();
  }, [formData]);

  const formatTo12Hour = time24 => {
        const [hour, minute] = time24.split(':')
        const date = new Date()
        date.setHours(+hour)
        date.setMinutes(+minute)
        return date.toLocaleTimeString([], {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        })
      }

  return (
    <div className="p-6 bg-gray-100 min-h-fit">
      {success && (
        <div className="mb-4 p-2 text-green-700 bg-green-100 rounded">
          {success}
        </div>
      )}

      <div className="flex justify-end items-center mb-6">
        <button
          style={{
            background: theme_content?.general?.button_bg || "#EF4444",
            color: theme_content?.general?.button_text || "#fff",
          }}
          onClick={openPopup}
          className="px-4 py-2  rounded-md"
        >
          Add New Event
        </button>
      </div>

      <div className="overflow-x-auto">
        <div className="flex bg-gray-200 p-4 rounded-t-lg">
          <div className="w-1/5 font-semibold">Name</div>
          <div className="w-1/5 font-semibold">Date</div>
          <div className="w-1/5 font-semibold">Start Time</div>
          <div className="w-1/5 font-semibold">End Time</div>
          <div className="w-1/5 font-semibold">Actions</div>
        </div>

        {eventsData?.map((event, index) => (
          <div
            key={index}
            className="flex items-center bg-white p-4 border-b border-gray-300"
          >
            <div className="w-1/5">{event?.event_name}</div>
            <div className="w-1/5">{event?.event_date}</div>
            <div className="w-1/5">{formatTo12Hour(event?.event_start_time)}</div>
            <div className="w-1/5">{formatTo12Hour(event?.event_end_time)}</div>
            <div className="w-1/5 flex space-x-2">
              <button
                onClick={() => {
                  navigate(`${middleware}events-application/${event._id}`, {
                    state: { event },
                  });
                }}
                disabled={loading}
                className={`px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 ${
                  loading ? "cursor-not-allowed opacity-50" : ""
                }`}
              >
                View
              </button>
              <button
                onClick={() => {
                  handleEdit(event);
                }}
                disabled={loading}
                className={`px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 ${
                  loading ? "cursor-not-allowed opacity-50" : ""
                }`}
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(event)}
                disabled={loading}
                className={`px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 ${
                  loading ? "cursor-not-allowed opacity-50" : ""
                }`}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Popup Modal */}
      {popup && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl overflow-y-auto max-h-full">
            <h2 className="text-2xl font-bold mb-4">
              {selectedEvent ? "Edit Event" : "Add New Event"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-wrap -mx-3 mb-6">
                {/* Event Name */}
                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                  <label className="block uppercase tracking-wide text-gray-700 text-sm font-bold mb-2">
                    Event Name
                  </label>
                  <input
                    type="text"
                    name="event_name"
                    value={currentFormData.event_name}
                    onChange={handleChange}
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
                    placeholder="Event Name"
                    disabled={loading}
                    required
                  />
                </div>

                {/* Event Date */}
                <div className="w-full md:w-1/2 px-3">
                  <label className="block uppercase tracking-wide text-gray-700 text-sm font-bold mb-2">
                    Event Date
                  </label>
                  <input
                    type="date"
                    name="event_date"
                    value={currentFormData.event_date}
                    onChange={handleChange}
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              <div className="flex flex-wrap -mx-3 mb-6">
                {/* Start Time */}
                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                  <label className="block uppercase tracking-wide text-gray-700 text-sm font-bold mb-2">
                    Start Time
                  </label>
                  <input
                    type="time"
                    name="event_start_time"
                    value={currentFormData.event_start_time}
                    onChange={handleChange}
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
                    disabled={loading}
                    required
                  />
                </div>

                {/* End Time */}
                <div className="w-full md:w-1/2 px-3">
                  <label className="block uppercase tracking-wide text-gray-700 text-sm font-bold mb-2">
                    End Time
                  </label>
                  <input
                    type="time"
                    name="event_end_time"
                    value={currentFormData.event_end_time}
                    onChange={handleChange}
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              <div className="flex flex-wrap -mx-3 mb-6">
                {/* Image Upload */}
                <div className="w-full px-3">
                  <label className="block uppercase tracking-wide text-gray-700 text-sm font-bold mb-2">
                    Image
                  </label>
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="block w-full text-gray-700 bg-gray-200 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="mb-6">
                {/* Event Description */}
                <label className="block uppercase tracking-wide text-gray-700 text-sm font-bold mb-2">
                  Event Description
                </label>
                <div
                  ref={quillRef}
                  className="h-48 bg-white border border-gray-300 rounded-md"
                ></div>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={closePopup}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={loading}
                >
                  {loading
                    ? "Saving..."
                    : selectedEvent
                    ? "Update Event"
                    : "Add Event"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Applicants Popup */}
      {applicantsPopup && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50 overflow-auto">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl mx-4">
            <h2 className="text-2xl font-bold mb-4">Interested Persons</h2>
            <div className="max-h-96 overflow-y-auto">
              {applicants.length > 0 ? (
                <ul className="space-y-4">
                  {applicants.map((applicant, index) => (
                    <li
                      key={index}
                      className="p-4 border border-gray-300 rounded-md bg-gray-50"
                    >
                      <p className="font-semibold text-lg">
                        {applicant.first_name} {applicant.last_name}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">
                  No one is interested in this event.
                </p>
              )}
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={closeApplicantsPopup}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Events;
