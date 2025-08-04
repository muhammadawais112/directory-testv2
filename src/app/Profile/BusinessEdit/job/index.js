import { useEffect, useRef, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { v4 as uuidv4 } from "uuid";
import { useNavigate, useParams } from "react-router-dom";
import { useAgencyInfo } from "../../../../context/agency";
import { useAppServices, useUploadImage } from "../../../../hook/services";

function JobView({ formData, handleRefresh }) {
  const [agency] = useAgencyInfo();
  const theme_content = agency?.theme_id?.theme_data;
  const uploadImage = useUploadImage();
  const AppService = useAppServices();
  const [success, setSuccess] = useState("");
  const [popup, setPopup] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(false);
  const quillRef = useRef(null);
  const quillInstance = useRef(null);
  const [jobsData, setJobsData] = useState([]);
  const navigate = useNavigate();
  const { agency_id } = useParams();
  let middleware = `/`;
  if (agency_id) {
    middleware = `/app/${agency_id}/`;
  }
  const getJobs = async (e) => {
    const { response } = await AppService.jobs.Get({
      query: `account_id=${formData._id}`,
    });
    setJobsData(response?.data);
  };

  useEffect(() => {
    if (popup) {
      setTimeout(() => {
        if (quillRef.current && !quillInstance.current) {
          quillInstance.current = new Quill(quillRef.current, {
            theme: "snow",
          });
        }
        if (selectedJob && quillInstance.current) {
          quillInstance.current.root.innerHTML = selectedJob.description || "";
        }
      }, 100);
    }
    return () => {
      if (!popup && quillInstance.current) {
        quillInstance.current = null;
      }
    };
  }, [popup, selectedJob]);

  const openPopup = () => setPopup(true);

  const closePopup = () => {
    setPopup(false);
    setSelectedJob(null);
    quillInstance.current = null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const description = quillInstance.current?.root.innerHTML || "";

    const image = e.target.image.files[0];
    let image_url = selectedJob?.image || "";

    if (image) {
      await uploadImage({
        file: image,
        desiredPath: "jobs",
      }).then(({ response }) => {
        image_url = response.data;
      });
    }

    const payload = {
      title: e.target.title.value,
      location: e.target.location.value,
      image: image_url,
      phone: e.target.phone.value,
      email: e.target.email.value,
      website: e.target.website.value,
      description,
      account_id: formData._id,
      agency_id: agency?._id,
    };

    let response;

    if (selectedJob) {
      response = await AppService.jobs.Update({
        payload: { ...payload, _id: selectedJob._id }, // Include _id for update
      });
    } else {
      response = await AppService.jobs.Create({ payload });
    }

    if (response) {
      handleRefresh();
      setSuccess(
        selectedJob
          ? "Job updated successfully!"
          : "New job created successfully!"
      );
      setPopup(false);
      setSelectedJob(null);
      getJobs();
    }

    setLoading(false);
  };

  const editJob = (job) => {
    setSelectedJob(job);
    if (quillInstance.current) {
      quillInstance.current.root.textContent = job.description || "";
    }
    openPopup();
  };

  const deleteJob = async (job) => {
    const { response } = await AppService.jobs.Delete({
      toaster: true,
      query: `_id=${job._id}`,
    });

    if (response) {
      handleRefresh();
      setSuccess("Job removed successfully!");
    }
  };

  useEffect(() => {
    getJobs();
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
          style={{
            background: theme_content?.general?.button_bg || "#EF4444",
            color: theme_content?.general?.button_text || "#fff",
          }}
          onClick={openPopup}
          className="px-4 py-2  rounded-md "
        >
          Add Job
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {jobsData?.map((job, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <img
              src={job.image || "path/to/default-image.jpg"}
              alt={job.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-lg font-semibold">{job.title}</h2>
              <p>
                <b>Location:</b> {job.location}
              </p>
              <p>
                <b>Phone:</b> {job.phone}
              </p>
              <p>
                <b>Email:</b> {job.email}
              </p>
              <p>
                <b>Website:</b>{" "}
                <a href={job.website} target="_blank" rel="noopener noreferrer">
                  {job.website}
                </a>
              </p>
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => {
                    navigate(`${middleware}jobs-application/${job._id}`, {
                      state: { job },
                    });
                  }}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 ml-2"
                >
                  View
                </button>
                <button
                  onClick={() => {
                    editJob(job);
                  }}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 ml-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteJob(job)}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 ml-2"
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
              {selectedJob ? "Edit Job" : "Add Job"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  name="title"
                  defaultValue={selectedJob?.title || ""}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div className="flex justify-between">
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    defaultValue={selectedJob?.location || ""}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    Phone
                  </label>
                  <input
                    type="text"
                    name="phone"
                    defaultValue={selectedJob?.phone || ""}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-between">
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    defaultValue={selectedJob?.email || ""}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    Website
                  </label>
                  <input
                    type="url"
                    name="website"
                    defaultValue={selectedJob?.website || ""}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
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
                 />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={closePopup}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md"
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

export default JobView;
