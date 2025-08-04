import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import banner from '@/app/assets/Blogs/cover.png'
import { useAppServices } from "../../hook/services";
import { useEffect, useState } from "react";
import Image from "next/image";

const PhotosSection = ({ business }) => {
  const [showGallery, setShowGallery] = useState(false);
  const Service = useAppServices();
  console.log(business, 'business1222')
  const [planDataForBusiness, setPlanDataForBusiness] = useState({});

  const FeaturedImage = planDataForBusiness?.features?.find(
    (feature) => feature.name === "Featured Image"
  );

  const getPlanDataForBusiness = async (_id) => {
    const { response } = await Service.accounts.planData({
      query: `business_id=${_id}`,
    });
    if (response) {
      setPlanDataForBusiness(response.data);
    }
  };

  useEffect(() => {
    getPlanDataForBusiness(business._id);
  },[business._id])
  return (
    <div className="flex flex-wrap md:flex-nowrap gap-4">
      <div className="w-full md:w-2/3">
        {business?.cover_image
          ? <Image
            alt="Main placeholder"
            className="w-full h-[400px] rounded-lg object-cover shadow-md"
            src={business?.cover_image }
            width={500}
            height={220}
          />
          : <Image
            alt="Main placeholder"
            className="w-full h-[400px] rounded-lg object-cover shadow-md"
            src={business?.profile_image || banner}
            width={500}
            height={220}
          />
        }
      </div>
       {FeaturedImage?.value && (
         <div className="w-full md:w-1/3 flex flex-col gap-4 relative">
        {business?.attachments?.slice(0, 2).map((image, index) => (
          <Image
            key={index}
            alt={`Attachment ${index + 1}`}
            className="w-full h-[190px] rounded-lg object-cover shadow-md"
            src={image || banner}
            width={500}
            height={220}
          />
        ))}

        {business?.attachments?.length > 2 && (
          <button
            className="absolute bottom-3 right-3 mt-2 px-4 py-2 bg-white text-black rounded-lg"
            onClick={() => setShowGallery(true)}
          >
            See All {business?.attachments?.length} Photos
          </button>
        )}
      </div>
       )}

      {showGallery && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
          <div className="relative bg-white p-10 rounded-lg shadow-lg flex flex-col overflow-hidden">

            <button
              className="absolute top-3 right-2 text-black px-3 py-1 rounded-md hover:bg-red-700 transition"
              onClick={() => setShowGallery(false)}
            >
              ✕
            </button>

            <div className="flex-grow flex justify-center items-center">
              <ImageGallery
                items={business?.attachments?.map((img, idx) => ({
                  original: img,
                  thumbnail: img,
                  originalAlt: `Attachment ${idx + 1}`,
                  thumbnailAlt: `Thumbnail ${idx + 1}`,
                })) || []}
                showThumbnails={true}
                showFullscreenButton={false}
                showPlayButton={false}
                thumbnailPosition="right"
                lazyLoad={true}
                showIndex={true}
                additionalClass="max-h-[80vh] w-[700px] flex items-center justify-center"
                renderItem={(item) => (
                  <div className="w-full h-full flex items-center justify-center">
                    <img
                      src={item.original}
                      alt={item.originalAlt || 'dummy'}
                      className="max-h-[80vh] w-[700px] object-cover rounded-lg"
                    />
                  </div>
                )}
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default PhotosSection;
