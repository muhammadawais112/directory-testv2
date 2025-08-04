import React from "react";
import { useState } from "react";
import { useAppServices } from "../../../../hook/services";
import { useAgencyInfo } from "../../../../context/agency";

const SocialUrls = ({ data, handleRefresh, features }) => {
  const [agency] = useAgencyInfo();
  const theme_content = agency?.theme_id?.theme_data;

  const AppService = useAppServices();
  const [loading, setLoading] = useState(false);
  const linksdisabled = features.find(
    (feature) => feature.name == "Social Media" && feature.value == true
  )
    ? true
    : false;
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      _id: data.id,
      instagram: e.target.instagram.value,
      facebook: e.target.facebook.value,
      twitter: e.target.twitter.value,
      linked_in: e.target.linked_in.value,
      youtube: e.target.youtube.value,
    };
    const { response } = await AppService.accounts.update({ payload });
    if (response) {
      handleRefresh();
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="facebook"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Facebook
            </label>
            <input
              type="text"
              disabled={linksdisabled}
              id="facebook"
              name="facebook"
              defaultValue={data?.facebook || ""}
              placeholder="Enter your Facebook link"
              className="block w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="instagram"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Instagram
            </label>
            <input
              type="text"
              disabled={linksdisabled}
              id="instagram"
              name="instagram"
              defaultValue={data?.instagram || ""}
              placeholder="Enter your Instagram link"
              className="block w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="twitter"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Twitter
            </label>
            <input
              type="text"
              disabled={linksdisabled}
              id="twitter"
              name="twitter"
              defaultValue={data?.twitter || ""}
              placeholder="Enter Twitter link"
              className="block w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="linked_id"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              LikedIn
            </label>
            <input
              type="text"
              disabled={linksdisabled}
              id="linked_in"
              name="linked_in"
              defaultValue={data?.linked_in || ""}
              placeholder="Enter your LikedIn link"
              className="block w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="youtube"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Youtube
            </label>
            <input
              type="text"
              disabled={linksdisabled}
              id="youtube"
              name="youtube"
              defaultValue={data?.youtube || ""}
              placeholder="Your Youtube Link"
              className="block w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          <button
           style={{
            background: theme_content?.general?.button_bg || "#EF4444",
            color: theme_content?.general?.button_text || "#fff",
          }}
            type="submit"
            className=" focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 inline-flex items-center"
            disabled={loading || linksdisabled}
          >
            {loading && (
              <svg
                aria-hidden="true"
                role="status"
                className="inline w-4 h-4 me-3 text-white animate-spin"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="#E5E7EB"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentColor"
                />
              </svg>
            )}
            Update
          </button>
        </div>
      </form>
    </div>
  );
};

export default SocialUrls;
