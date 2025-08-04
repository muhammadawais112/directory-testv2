import React, { useEffect } from "react";
import Swiper from "swiper/bundle";
import "swiper/css/bundle";
import { GoArrowUpRight } from "react-icons/go";
import './style.css'
import { useRouter, useParams } from "next/navigation";

const FeaturedListing = ({ businesses }) => {
  const navigate = useRouter();

  const { agency_id } = useParams();
  let middleware = `/`;
  if (agency_id) {
    middleware = `/app/${agency_id}/`;
  }

  const handleBusinessDetails = (business) => {
    navigate.push(`${middleware}detail-page/${business?.slug}`);
  };

  useEffect(() => {
    // Initialize Swiper once the component mounts
    new Swiper(".progress-slide-carousel", {
      loop: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
      pagination: {
        el: ".progress-slide-carousel .swiper-pagination",
        type: "progressbar", // or "fraction" if you prefer
      },
    });
  }, []);

  // filter those businesses that have plan_type "premium"
  const getBusinessesPremium = () => {
    return businesses.filter((business) => {
      return business?.plan_type === "premium";
    });
  }
  console.log(getBusinessesPremium(), 'businesses')

  return (
    <div className="w-full relative">
      <div className="swiper progress-slide-carousel swiper-container relative">
        <div className="swiper-wrapper">
          {getBusinessesPremium().map((business, index) => (
            <div key={index} className="swiper-slide">
              <div
                className="h-[500px] md:h-[700px] py-20 md:py-48 flex justify-center items-center px-4"
                style={{
                  backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${business.cover_image || business.profile_image || '/cover.png'})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundBlendMode: "darken",
                  color: "white", 
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div className="flex flex-col md:flex-row w-full md:w-[1170px] mx-auto justify-between relative">
                  <div>
                    <h2 className="text-3xl md:text-[52px] font-semibold pb-[10px] text-white">
                      {business?.first_name}
                    </h2>
                    {business?.business_tags?.map((tag, index) => (
                      <p key={index} className="text-sm md:text-[15px] mb-[48px] text-white">
                        {tag?.label}
                      </p>
                    ))}

                    <div className="flex items-center w-fit bg-white text-black rounded-xl py-4 px-[30px] text-[15px] cursor-pointer" onClick={() => handleBusinessDetails(business)}>
                      <span>View Details</span>
                      <GoArrowUpRight fontSize={16} className="pl-1" />
                    </div>
                  </div>

                  {/* <div className="absolute top-1/2 right-4 md:right-10 transform -translate-y-1/2 flex flex-col space-y-4 z-10">
                    <button className="swiper-button-prev-custom w-10 h-10 rounded-full border border-white text-white flex items-center justify-center hover:bg-white hover:text-gray-800 transition">
                      &lt;
                    </button>

                    <button className="swiper-button-next-custom w-10 h-10 rounded-full border border-white text-white flex items-center justify-center hover:bg-white hover:text-gray-800 transition">
                      &gt;
                    </button>
                  </div> */}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="swiper-pagination !w-[50%] !bottom-10 md:!bottom-20 !top-auto md:w-80 right-0 mx-auto bg-gray-100"></div>
      </div>
    </div>
  );
};

export default FeaturedListing;
