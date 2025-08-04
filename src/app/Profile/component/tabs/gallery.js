import { useAppServices, useUploadImage } from "hook/services";
import Modal from "pages/component/popup";
import React, { useState } from "react";
import Image from "next/image";

function GalleryTab({ user }) {
    const [previewImage, setPreviewImage] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState(null);
    const uploadImageHook = useUploadImage();
    const Service = useAppServices()

    const uploadImage = (e) => {
        if (!e.target || !e.target.files || e.target.files.length === 0) {
            return;
        }
        const reader = new FileReader();
        reader.onload = () => {
            const output = document.getElementById("attachmentImage");
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
                desiredPath: "attachment",
            });
            if (response) {
                image_url = response.data;
                updateUserAccount(
                    { attachments: [...user.attachments, image_url] }
                ).then(() => {

                    // also update the user context
                    user.attachments.push(image_url);

                    setLoading(false);
                    setIsAddModalOpen(false);
                })
            }
        }
        setLoading(false);
    }

    const updateUserAccount = async (data) => {
        const payload = {
            _id: user?.id,
            ...data
        }

       await Service.accounts.update({ payload });
    
    }

    return (
        <div className="p-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-gray-800 mb-4">Gallery</h1>

                {/* Add Attachment Button */}
                <button
                    className="px-4 py-2 text-sm text-white bg-blue-500 hover:bg-blue-600 rounded-lg"
                    onClick={() => setIsAddModalOpen(true)}
                >
                    Add Attachment
                </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {user.attachments.map((attachment, index) => (
                    <div key={index} className="grid gap-4">
                        <div>
                            <Image
                                className="h-auto max-w-full rounded-lg cursor-pointer"
                                src={attachment}
                                alt={`Attachment ${index + 1}`}
                                onClick={() => setPreviewImage(attachment)}
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* Preview Modal */}
            {previewImage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="relative bg-white rounded-lg shadow-lg">
                        <button
                            className="absolute top-2 right-2 text-white hover:text-gray-400 bg-black px-2 rounded-lg"
                            onClick={() => setPreviewImage(null)}
                        >
                            &times;
                        </button>
                        <Image
                            className="h-auto max-w-full rounded-lg"
                            src={previewImage}
                            alt="Preview"
                            width={800}
                        />
                    </div>
                </div>
            )}

            <Modal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title="Add Attachment"
                size="max-w-lg"
            >
                <div className="p-4">
                    {/* preview */}
                    <Image
                        src={"https://placehold.co/800"}
                        alt="Attachment Photo"
                        className="w-full h-48 object-attachment rounded-md mb-4"
                        id="attachmentImage"
                    />
                    <input type="file" className="w-full border border-gray-300 rounded-md p-2 mb-4" onChange={(e) => uploadImage(e)} />
                    <div className="flex justify-end">
                        <button
                            type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center"
                            disabled={loading}
                            onClick={updateCover}
                        >
                            {
                                loading && (
                                    <svg aria-hidden="true" role="status" className="inline w-4 h-4 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                                    </svg>
                                )
                            }
                            Save
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}

export default GalleryTab;
