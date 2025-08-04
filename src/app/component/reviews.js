import { useUserInfo } from "context/user";
import { useState, useEffect } from "react";
import {
  FaStar,
  FaStarHalfAlt,
  FaFilter,
  FaSortAmountDown,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAppServices } from "hook/services";
import { useAgencyInfo } from "context/agency";

function ReviewsComponent(props) {
  const [agency] = useAgencyInfo();
  const navigate = useNavigate();
  const Service = useAppServices();
  const { business } = props;
  const [user, setUser] = useUserInfo();

  const [reviews, setReviews] = useState([]);
  const [sortBy, setSortBy] = useState("date");
  const [filterRating, setFilterRating] = useState("all");
  const [expandedReviews, setExpandedReviews] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({
    name: "",
    rating: 5,
    content: "",
    business_id: business.id,
    account_id: user.id,
    user_id: user._id,
    agency_id: agency._id,
  });

  const getReviews = async () => {
    const { response } = await Service.reviews.Get({
      query: `business_id=${business.id}`,
    });
    if (!response) return;
    setReviews(response.data);
  };

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

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    const payload = {
      id: reviews.length + 1,
      // name: newReview.name,
      reviewerImage:
        "https://e7.pngegg.com/pngimages/178/595/png-clipart-user-profile-computer-icons-login-user-avatars-monochrome-black-thumbnail.png",
      reviewDate: new Date().toISOString().split("T")[0],
      rating: newReview.rating,
      content: newReview.content,
      business_id: business.id,
      account_id: user.id,
      user_id: user._id,
      agency_id: agency._id,
    };

    console.log(payload, "payload");

    const { response } = await Service.reviews.create({ payload });

    console.log(response, "response");
    getReviews();
    setReviews([payload, ...reviews]);
    setNewReview({
      // name: "",
      rating: 5,
      content: "",
      business_id: business.id,
      account_id: user.id,
      user_id: user._id,
      agency_id: agency._id,
    });
    setShowReviewForm(false);
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

  const filteredReviews = reviews.filter((review) => {
    if (filterRating === "positive") return review.rating >= 4;
    if (filterRating === "negative") return review.rating <= 2;
    return true;
  });
  const theme_content = agency?.theme_id?.theme_data;

  console.log(reviews, "reviews123");

  return (
    <div className="max-w-4xl mx-auto pt-10">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
          {/* Section Title */}
          <h2 className="text-2xl md:text-3xl font-bold text-center md:text-left">
            Customer Reviews
          </h2>

          {/* Buttons */}
          {user?.id ? (
            <button
              style={{
                background: theme_content?.general?.button_bg || "#00A6A9",
                color: theme_content?.general?.button_text || "#fff",
              }}
              onClick={() => setShowReviewForm(!showReviewForm)}
              className=" px-4 py-2 rounded-lg transition-colors w-fit md:w-auto"
            >
              {showReviewForm ? "Cancel Review" : "Write a Review"}
            </button>
          ) : (
            <button
              style={{
                background: theme_content?.general?.button_bg || "#00A6A9",
                color: theme_content?.general?.button_text || "#fff",
              }}
              onClick={() => navigate("/login")}
              className=" px-4 py-2 rounded-lg transition-colors w-fit md:w-auto"
            >
              Login to Write a Review
            </button>
          )}
        </div>

        {showReviewForm && (
          <form
            onSubmit={handleSubmitReview}
            className="bg-white p-6 rounded-lg shadow-md mb-6"
          >
            {/* <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="name"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                value={newReview.name}
                onChange={(e) =>
                  setNewReview({ ...newReview, name: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div> */}

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Rating
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewReview({ ...newReview, rating: star })}
                    className={`text-2xl ${
                      star <= newReview.rating
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                  >
                    <FaStar />
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="review"
              >
                Review
              </label>
              <textarea
                id="review"
                value={newReview.content}
                onChange={(e) =>
                  setNewReview({ ...newReview, content: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="4"
                required
               />
            </div>

            <button
              style={{
                background: theme_content?.general?.button_bg,
                color: theme_content?.general?.button_text,
              }}
              type="submit"
              className="w-full px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
            >
              Submit Review
            </button>
          </form>
        )}

        {reviews.length === 0 ? (
          <div className="bg-white p-6 rounded-lg text-center">
            <p>No reviews yet. Be the first to review!</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="relative">
              <select
                className="appearance-none bg-white border rounded-lg py-2 px-4 pr-8 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={sortBy}
                onChange={(e) => handleSort(e.target.value)}
              >
                <option value="date">Most Recent</option>
                <option value="rating">Highest Rated</option>
                <option value="relevance">Most Relevant</option>
              </select>
              <FaSortAmountDown className="absolute right-2 top-3 text-gray-400" />
            </div>

            <div className="flex gap-2">
              <button
                className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                  filterRating === "positive"
                    ? "bg-green-500 text-white"
                    : "bg-white border"
                }`}
                onClick={() =>
                  handleFilter(filterRating === "positive" ? "all" : "positive")
                }
              >
                <FaFilter />
                Positive
              </button>
              <button
                className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                  filterRating === "negative"
                    ? "bg-red-500 text-white"
                    : "bg-white border"
                }`}
                onClick={() =>
                  handleFilter(filterRating === "negative" ? "all" : "negative")
                }
              >
                <FaFilter />
                Negative
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {filteredReviews
          .slice()
          .reverse()
          .map((review) => (
            <div
              key={review.id}
              className={`bg-white rounded-lg p-6 shadow-md ${
                review.rating >= 4
                  ? "border-l-4 border-green-500"
                  : review.rating <= 2
                  ? "border-l-4 border-red-500"
                  : ""
              }`}
            >
              <div className="flex items-start gap-4">
                <img
                  src={
                    review?.user_id?.profile_image ||
                    "https://e7.pngegg.com/pngimages/178/595/png-clipart-user-profile-computer-icons-login-user-avatars-monochrome-black-thumbnail.png"
                  }
                  alt={review.name}
                  className="w-12 h-12 rounded-full object-cover"
                  onError={(e) => {
                    e.target.src =
                      "https://e7.pngegg.com/pngimages/178/595/png-clipart-user-profile-computer-icons-login-user-avatars-monochrome-black-thumbnail.png";
                  }}
                />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">
                        {review?.user_id?.first_name}{" "}
                        {review?.user_id?.last_name?.charAt(0)}
                      </h3>
                      <div className="flex gap-1 my-1">
                        {renderStars(review.rating)}
                      </div>
                    </div>
                    <span className="text-gray-500 text-sm">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="mt-2 text-gray-600">
                    {expandedReviews.includes(review.id)
                      ? review.content
                      : `${review.content.slice(0, 150)}...`}
                  </p>
                  <button
                    className="mt-2 text-blue-500 hover:text-blue-700 font-medium"
                    onClick={() => toggleReadMore(review.id)}
                  >
                    {expandedReviews.includes(review.id)
                      ? "Show Less"
                      : "Read More"}
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default ReviewsComponent;
