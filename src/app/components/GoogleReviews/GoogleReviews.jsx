import React, { useEffect, useRef, useState } from "react";
import { useLoadScript } from "@react-google-maps/api";
import env from "../../config";
import { useAppServices } from "../../hook/services";
import { useUserInfo } from "../../context/user";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import googleReview from '../../assets/DetailPage/googleReview.png'

const libraries = ["places"];

const GoogleReviews = ({ business }) => {
    const [places, setPlaces] = useState(null);
    const Service = useAppServices();
    const [expandedReviews, setExpandedReviews] = useState([]);

    const placeId = business?.google_place_id;

    const fetchReviews = async () => {
        try {
            const { response } = await Service.reviews.GetFromGoogle({
                query: `place_id=${placeId}`,
            });

            setPlaces(response.data)
        } catch (err) {
            console.error("Fetch Reviews Error:", err);
        }
    };

    useEffect(() => {
        fetchReviews()
    }, [business?.google_place_id])

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars.push(<FaStar key={i} className="text-yellow-400" />);
            } else if (i - 0.5 <= rating) {
                stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
            } else {
                stars.push(<FaStar key={i} className="text-gray-300" />);
            }
        }
        return stars;
    };

    return (
        <div>
            {business?.google_place_id && <div className='w-[90%] mx-auto'>
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-bold">Average Ratting</h2>

                    <span className="text-yellow-500 flex space-x-2">
                        {renderStars(places?.rating)}
                    </span>
                </div>

                {places?.reviews?.map((review, index) => (
                    <div
                        key={index} className="flex items-start space-x-4 mt-8">
                        <div className="flex-1">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h4 className="font-semibold">
                                        {review?.author_name}{" "}
                                        {review?.user_id?.last_name?.charAt(0)}
                                    </h4>
                                </div>
                                <div className="flex items-center">
                                    <span className="text-yellow-500 flex space-x-2">
                                        {renderStars(review?.rating)}
                                    </span>
                                </div>
                            </div>
                            <p className="mt-2 text-gray-700">
                                {review?.text}
                            </p>
                        </div>
                    </div>
                ))}
            </div>}
        </div>
    );
};

export default GoogleReviews;
