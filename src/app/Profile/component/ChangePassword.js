import { useState } from "react";
import { useAppServices } from "../../../hook/services";
import { useAgencyInfo } from "../../../context/agency";
import Modal from "../../../components/popup";

function ChangePassword({ isOpen, onClose, user }) {
  const Service = useAppServices();
  const [agency] = useAgencyInfo();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const theme_content = agency?.theme_id?.theme_data?.general;

  const passwordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.target);
    const data = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });

    if (data.new_password !== data.confirm_password) {
      setError("New password and confirm password do not match.");
      setLoading(false);
      return;
    }

    const payload = {
      _id: user?.id,
      password: data.new_password,
    };

    try {
      const { response } = await Service.accounts.update({ payload });

      if (response) {
        onClose();
      } else {
        setError(
          "Failed to update the password. Please check your previous password."
        );
      }
    } catch (err) {
      setError("An error occurred while updating the password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      size={"w-[500px]"}
      isOpen={isOpen}
      title="Change Password"
      onClose={onClose}
    >
      <form onSubmit={passwordSubmit} style={{ with: "70%" }}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Previous Password
            </label>
            <input
              type="password"
              name="previous_password"
              required
              placeholder="Enter your previous password"
              className="block w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <input
              type="password"
              name="new_password"
              required
              placeholder="Enter your new password"
              className="block w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirm_password"
              required
              placeholder="Confirm your new password"
              className="block w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="submit"
              className=" focus:ring-4  font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center"
              disabled={loading}
              style={{
                background: theme_content?.button_bg || "#EF4444",
                color: theme_content?.button_text || "#fff",
                padding: "5px 10px",
                borderRadius: "4px",
              }}
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
              Change Password
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}

export default ChangePassword;
