"use client";
import { useState } from "react";
import backgroundImage from "@/app/assets/Home/bg.png";
import toast from 'react-hot-toast'
import localforage from "localforage";
import Modal from "@/app/components/popup";
import { useAppServices, useUploadImage } from "@/app/hook/services";
import { useAgencyInfo } from "@/app/context/agency";
import Image from "next/image";

function CoverPhoto(props) {
  const { user,Update } = props;
  const [showModal, setShowModal] = useState(false);
  const uploadImageHook = useUploadImage();
  const Service = useAppServices();
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [agency] = useAgencyInfo();
  const theme_content = agency?.theme_id?.theme_data?.general;


  const uploadImage = (e) => {
    if (!e.target || !e.target.files || e.target.files.length === 0) {
      console.error("No file selected.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const output = document.getElementById("coverImage");
      if (output) {
        output.src = reader.result;
      }
    };
    setImage(e.target.files[0]);
    reader.readAsDataURL(e.target.files[0]);
  };

  const updateCover = async () => {
    setLoading(true);
    if (image) {
      let image_url = "";
      const { response } = await uploadImageHook({
        toaster: true,
        file: image,
        desiredPath: "cover",
      });
      if (response) {
        // coverImageMain
        const coverImageMain = document.getElementById("coverImageMain");
        if (coverImageMain) {
          coverImageMain.src = response.data;
        }

        setLoading(false);
        setShowModal(false);
        toast.success('Image updated successfully')
        image_url = response.data;
        updateUserAccount({ cover_image: image_url });
      }
    }
    setLoading(false);
  };

  const updateUserAccount = async (data) => {
    const payload = {
      _id: user?.id,
      ...data,
    };

    const { response } = await Service.accounts.update({ payload });
    if (response) {
      console.log("User updated successfully");
      Update(response.data); // ✅ Pass updated user data to context  
      localforage.setItem("user", response.data);
    }
  };

  return (
    <>
      <div className="relative">
        <Image
          src={user?.cover_image || backgroundImage}
          alt="Cover Photo"
          className="w-full h-48 object-cover"
          id="coverImageMain"
          width={500}
          height={220}
        />
        <div className="absolute bottom-0 left-4 transform translate-y-1/2">
          <img
            src={user?.profile_image || 'https://storage.googleapis.com/a1aa/image/9yoSNoTq1IJRjVg32oKHF28vC3N97ngxfp2quHLEChY.jpg'}
            alt="Profile Picture"
            className="w-24 h-24 rounded-full border-4 border-white object-cover"
          />
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="absolute bottom-2 right-4 bg-white text-gray-700 border border-gray-300 rounded-md px-3 py-1 text-sm shadow-sm cursor-pointer"
        >
          Edit Cover Photo
        </button>
      </div>

      {/*  */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Edit Cover Photo"
        size="max-w-lg"
      >
        <div className="p-4">
          {/* preview */}
          <img
            src={user?.cover_image || "https://placehold.co/1200x300"}
            alt="Cover Photo"
            className="w-full h-48 object-cover rounded-md mb-4"
            id="coverImage"
          />
          <input
            type="file"
            className="w-full border border-gray-300 rounded-md p-2 mb-4 text-black"
            onChange={(e) => uploadImage(e)}
          />
          <div className="flex justify-end">
            <button
              type="button"
              className=" focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 inline-flex items-center"
              onClick={updateCover}
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
              Update
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default CoverPhoto;
