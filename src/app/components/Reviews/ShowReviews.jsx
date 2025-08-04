"use client";
import React, { useEffect, useState } from "react";
import { BsStarFill } from "react-icons/bs";
import {
  FaStar,
  FaStarHalfAlt,
  FaFilter,
  FaSortAmountDown,
} from "react-icons/fa";
import { useAgencyInfo } from "../../context/agency";
import { useNavigate } from "react-router";
import { useAppServices } from "../../hook/services";
import { useUserInfo } from "../../context/user";

const ShowReviews = ({
  business = [],
  getReviews,
  reviews,
  setReviews,
  ReviewsFeature,
  GoogleReviewsFeature,
}) => {
  const [agency] = useAgencyInfo();
  const Service = useAppServices();

  const [sortBy, setSortBy] = useState("date");
  const [filterRating, setFilterRating] = useState("all");
  const [expandedReviews, setExpandedReviews] = useState([]);

  useEffect(() => {
    getReviews();
  }, [business.id]);

  const handleSort = (sortType) => {
    setSortBy(sortType);
    let sortedReviews = [...reviews];

    switch (sortType) {
      case "date":
        sortedReviews.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        break;
      case "rating":
        sortedReviews.sort((a, b) => b.rating - a.rating);
        break;
      case "relevance":
        sortedReviews.sort(
          (a, b) =>
            b.rating * 0.7 +
            (new Date(b.createdAt) - new Date("2024-01-01")) * 0.3 -
            (a.rating * 0.7 +
              (new Date(a.createdAt) - new Date("2024-01-01")) * 0.3)
        );
        break;
      default:
        break;
    }

    setReviews(sortedReviews);
  };

  const handleFilter = (filterType) => {
    setFilterRating(filterType);
  };

  const toggleReadMore = (reviewId) => {
    setExpandedReviews((prev) =>
      prev.includes(reviewId)
        ? prev.filter((id) => id !== reviewId)
        : [...prev, reviewId]
    );
  };

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
  const agencyReviewValue = parseFloat(agency?.review?.value);
  const filteredReviews = reviews.filter((review) => {
    if (filterRating === "positive") return review.rating >= 4;
    if (filterRating === "negative") return review.rating <= 2;
    return true;
  });
  // const filteredReviews = agencyReviewValue
  // ? reviews.filter((review) => review.rating >= agencyReviewValue)
  // : reviews;
  const theme_content = agency?.theme_id?.theme_data;

  const [places, setPlaces] = useState(null);

  const placeId = business?.google_place_id;

  const fetchReviews = async () => {
    try {
      const { response } = await Service.reviews.GetFromGoogle({
        query: `place_id=${placeId}&apiKey=${agency?.google_api_key}`,
      });

      setPlaces(response?.data);
    } catch (err) {
      console.error("Fetch Reviews Error:", err);
    }
  };

  const GoogleReviews = places?.reviews;
  const filteredGoogleReview = agencyReviewValue
    ? GoogleReviews?.filter((item) => item.rating >= agencyReviewValue)
    : GoogleReviews;
  useEffect(() => {
    fetchReviews();
  }, [business?.google_place_id]);

  function convertTimestampToReadableDate(timestamp) {
    // Convert to milliseconds (JavaScript works with milliseconds)
    const date = new Date(timestamp * 1000);

    // Return the formatted date in a human-readable format
    return date.toLocaleString(); // You can also use toISOString() if you prefer the ISO format
  }

  return (
    <div className="w-[96%] mx-auto">
      {business?.google_place_id && GoogleReviewsFeature?.value && (
        <div>
          <div>
            {filteredGoogleReview?.map((review, index) => (
              <div
                key={
                  review.id || `${review.author_name}-${review.time}-${index}`
                }
                className="flex items-start space-x-4 mt-8"
              >
                <img
                  alt={review?.author_name}
                  className="w-10 h-10 rounded-full"
                  height="40"
                  src={
                    review?.profile_photo_url ||
                    "https://storage.googleapis.com/a1aa/image/H3N03cI4_Gq9K7U5AJZKd7X7pEFIpe2VPbG3QOetyr8.jpg"
                  }
                  width="40"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold text-black">
                        {review?.author_name}{" "}
                        {review?.user_id?.last_name?.charAt(0)}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {new Date(review.time * 1000).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <span className="text-yellow-500 flex space-x-2">
                        {renderStars(review.rating)}
                      </span>
                    </div>
                  </div>
                  <p className="mt-2 text-gray-700">{review?.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {ReviewsFeature?.value && (
        <>
          {filteredReviews
            .slice()
            .reverse()
            .map((review) => (
              <div key={review.id} className="flex items-start space-x-4 mt-8">
                <img
                  alt="User profile picture"
                  className="w-10 h-10 rounded-full"
                  height="40"
                  src={
                    review?.user_id?.profile_image ||
                    "https://storage.googleapis.com/a1aa/image/H3N03cI4_Gq9K7U5AJZKd7X7pEFIpe2VPbG3QOetyr8.jpg"
                  }
                  width="40"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold">
                        {review?.user_id?.first_name}{" "}
                        {review?.user_id?.last_name?.charAt(0)}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <span className="text-yellow-500 flex space-x-2">
                        {renderStars(review.rating)}
                      </span>
                    </div>
                  </div>
                  <p className="mt-2 text-gray-700">
                    {expandedReviews.includes(review.id)
                      ? review.content
                      : `${review.content.slice(0, 150)}...`}
                  </p>
                </div>
              </div>
            ))}
        </>
      )}
    </div>
  );
};

export default ShowReviews;
