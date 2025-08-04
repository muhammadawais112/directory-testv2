"use client";
import { useEffect, useRef, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { useAppServices, useUploadImage } from "@/app/hook/services";
import { useAgencyInfo } from "@/app/context/agency";

function BlogView({ formData, handleRefresh }) {
  const uploadImage = useUploadImage();
  const AppService = useAppServices();
  const [success, setSuccess] = useState("");
  const [popup, setPopup] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null); // State for editing
  const [loading, setLoading] = useState(false);
  const [agency] = useAgencyInfo();
  const theme_content = agency?.theme_id?.theme_data;
  const quillRef = useRef(null);
  const quillInstance = useRef(null);

  const [blogsData, setBlogsData] = useState([]);

  const getBlogs = async () => {
    const { response } = await AppService.blogs.Get({
      query: `account_id=${formData._id}`,
    });
    if (response) {
      setBlogsData(response.data); // Assuming API returns a list of blogs
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
        if (selectedBlog && quillInstance.current) {
          quillInstance.current.root.innerHTML = selectedBlog.description || "";
        }
      }, 100);
    }
    return () => {
      if (!popup && quillInstance.current) {
        quillInstance.current = null;
      }
    };
  }, [popup, selectedBlog]);

  const openPopup = () => setPopup(true);

  const closePopup = () => {
    setPopup(false);
    setSelectedBlog(null); // Reset selected blog on close
    quillInstance.current = null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const description = quillInstance.current?.root.innerHTML || "";

    const image = e.target.image.files[0];
    let image_url = selectedBlog?.image || ""; // Preserve existing image URL

    if (image) {
      await uploadImage({
        file: image,
        desiredPath: "blogs",
      }).then(({ response }) => {
        image_url = response.data;
      });
    }

    const payload = {
      title: e.target.title.value,
      image: image_url,
      description,
      date: new Date().toISOString(),
      account_id: formData._id,
      agency_id: agency?._id,
    };

    let response;

    if (selectedBlog) {
      // Update blog
      response = await AppService.blogs.Update({
        payload: { ...payload, _id: selectedBlog._id }, // Include _id for update
      });
    } else {
      // Create blog
      response = await AppService.blogs.Create({ payload });
    }

    if (response) {
      handleRefresh();
      setSuccess(
        selectedBlog
          ? "Blog updated successfully!"
          : "New blog created successfully!"
      );
      setPopup(false);
      setSelectedBlog(null);
      getBlogs(); // Refresh blogs after update/create
    }

    setLoading(false);
  };

  const editBlog = (blog) => {
    setSelectedBlog(blog);
    if (quillInstance.current) {
      quillInstance.current.root.innerHTML = blog.description || "";
    }
    openPopup();
  };

  const deleteBlog = async (blog) => {
    const { response } = await AppService.blogs.Delete({
      query: `_id=${blog._id}`,
    });

    if (response) {
      handleRefresh();
      setSuccess("Blog deleted successfully!");
      getBlogs();
    }
  };

  useEffect(() => {
    getBlogs();
  }, [formData]);

  return (
    <div className="p-6 bg-gray-100">
      {success && (
        <div className="mb-4 p-2 text-green-700 bg-green-100 rounded">
          {success}
        </div>
      )}

      <div className="flex justify-end items-center mb-3">
        <button
          onClick={openPopup}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          style={{
            background: theme_content?.general?.button_bg || "#EF4444",
            color: theme_content?.general?.button_text || "#fff",
          }}
        >
          Add Blog
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {blogsData?.map((blog, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <img
              src={blog.image}
              alt={blog.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-lg font-semibold">{blog.title}</h2>
              <div className="flex justify-between mt-4">
                <button
                  onClick={() => {
                    editBlog(blog);
                  }}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteBlog(blog)}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
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
          <div className="bg-white rounded-lg shadow-lg p-6 w-full md:w-1/2">
            <h2 className="text-xl font-bold mb-4">
              {selectedBlog ? "Edit Blog" : "Add Blog"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  name="title"
                  defaultValue={selectedBlog?.title || ""}
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

export default BlogView;
