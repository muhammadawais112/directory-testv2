"use client";
import { useEffect, useRef, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { useAppServices, useUploadImage } from "@/app/hook/services";
import { useAgencyInfo } from "@/app/context/agency";

function NewsFeedView({ formData, handleRefresh }) {
  console.log(formData, "formData");
  const uploadImage = useUploadImage();
  const AppService = useAppServices();
  const [success, setSuccess] = useState("");
  const [popup, setPopup] = useState(false);
  const [selectedNewsFeed, setSelectedNewsFeed] = useState(null); // State for editing
  const [loading, setLoading] = useState(false);
  const [newsFeedsData, setNewsFeedsData] = useState([]);
  const [agency] = useAgencyInfo();
  const theme_content = agency?.theme_id?.theme_data;

  const quillRef = useRef(null);
  const quillInstance = useRef(null);

  const getNewsFeeds = async () => {
    const { response } = await AppService.newsFeed.Get({
      query: `account_id=${formData._id}`,
    });
    if (response) {
      setNewsFeedsData(response.data); // Assuming API returns a list of news feeds
    }
  };

  useEffect(() => {
    if (popup) {
      setTimeout(() => {
        if (quillRef.current && !quillInstance.current) {
          quillInstance.current = new Quill(quillRef.current, {
            theme: "snow",
          });
        }
        if (selectedNewsFeed && quillInstance.current) {
          quillInstance.current.root.innerHTML =
            selectedNewsFeed.description || "";
        }
      }, 100);
    }
    return () => {
      if (!popup && quillInstance.current) {
        quillInstance.current = null;
      }
    };
  }, [popup, selectedNewsFeed]);

  const openPopup = () => setPopup(true);

  const closePopup = () => {
    setPopup(false);
    setSelectedNewsFeed(null); // Reset selected news feed on close
    quillInstance.current = null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let description = quillInstance.current?.root.innerHTML.trim() || "";

    // Ensure paragraph formatting
    description = description
      .replace(/<div>/g, "<p>")
      .replace(/<\/div>/g, "</p>");

    const image = e.target?.image?.files[0];
    let image_url = selectedNewsFeed?.image || ""; // Preserve existing image URL

    if (image) {
      await uploadImage({
        file: image,
        desiredPath: "news_feed",
      }).then(({ response }) => {
        image_url = response.data;
      });
    }

    const payload = {
      title: e.target.title.value,
      image: image_url,
      description,
      account_id: formData._id,
      agency_id: agency?._id,
    };

    let response;

    if (selectedNewsFeed) {
      // Update news feed
      response = await AppService.newsFeed.Update({
        payload: { ...payload, _id: selectedNewsFeed._id }, // Include _id for update
      });
    } else {
      // Create news feed
      response = await AppService.newsFeed.Create({ payload });
    }

    if (response) {
      handleRefresh();
      setSuccess(
        selectedNewsFeed
          ? "News Feed updated successfully!"
          : "New News Feed created successfully!"
      );
      setPopup(false);
      setSelectedNewsFeed(null);
      getNewsFeeds(); // Refresh news feed after update/create
    }

    setLoading(false);
  };

  const deleteNewsFeed = async (newsFeed) => {
    const { response } = await AppService.newsFeed.Delete({
      query: `_id=${newsFeed._id}`, // Send news feed ID as query param for deletion
    });

    if (response) {
      handleRefresh();
      setSuccess("News Feed deleted successfully!");
      getNewsFeeds(); // Refresh news feeds after deletion
    }
  };

  const editNewsFeed = (newsFeed) => {
    setSelectedNewsFeed(newsFeed);
    if (quillInstance.current) {
      quillInstance.current.root.innerHTML = newsFeed.description || "";
    }
    openPopup();
  };

  useEffect(() => {
    getNewsFeeds();
  }, [formData]);

  return (
    <div className="p-6 bg-gray-100">
      <div className="flex justify-end items-center mb-3">
        <button
          style={{
            background: theme_content?.general?.button_bg || "#EF4444",
            color: theme_content?.general?.button_text || "#fff",
          }}
          onClick={openPopup}
          className="px-4 py-2 rounded-md"
        >
          Add News Feed
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {newsFeedsData?.map((news, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <img
              src={news?.image}
              alt={news?.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-lg font-semibold">{news?.title}</h2>
              <div className="flex justify-between mt-4">
                <button
                  onClick={() => {
                    editNewsFeed(news);
                  }}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                  onClick={() => deleteNewsFeed(news)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Popup Modal */}
      {popup && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full container">
            <h2 className="text-xl font-bold mb-4">
              {selectedNewsFeed ? "Edit News Feed" : "Add News Feed"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  name="title"
                  defaultValue={selectedNewsFeed?.title || ""}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Image</label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  className="w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Description
                </label>
                <div
                  ref={quillRef}
                  className="border border-gray-300 rounded-md"
                ></div>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={closePopup}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default NewsFeedView;
