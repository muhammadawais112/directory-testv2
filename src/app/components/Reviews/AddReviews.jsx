"use client";
import React, { useState } from 'react';
import { useAgencyInfo } from '../../context/agency';
import { useUserInfo } from '../../context/user';
import { useAppServices } from '../../hook/services';
import { useRouter } from 'next/navigation';

const AddReviews = ({ business = {}, getReviews, reviews, setReviews }) => {
  const [agency] = useAgencyInfo();
  const Service = useAppServices();
  const [user, setUser] = useUserInfo();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: '',
    content: "",
    business_id: business.id,
    account_id: user.id,
    user_id: user._id,
    agency_id: agency._id,
  });
  const navigate = useRouter();

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if(!user.email){
        navigate("/login");
        return;
    }
    const payload = {
      id: reviews.length + 1,
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
      rating: '',
      content: "",
      business_id: business.id,
      account_id: user.id,
      user_id: user._id,
      agency_id: agency._id,
    });
    setShowReviewForm(false);
  };

  return (
    <div className='w-full mt-5'>
      <div className="p-8 rounded-lg">
        <h1 className="text-xl font-semibold mb-6 text-black">Leave A Review</h1>
        <form onSubmit={handleSubmitReview}>
          <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-6">
            <div>
              <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-2">
                Rating
              </label>
              <select
                id="rating"
                name="rating"
                value={newReview.rating}
                onChange={(e) =>
                  setNewReview({ ...newReview, rating: Number(e.target.value) })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="review" className="block text-sm font-medium text-gray-700 mb-2">
              Review
            </label>
            <textarea
              id="review"
              name="review"
              rows="6"
              placeholder="Write a Review"
              value={newReview.content}
              onChange={(e) =>
                setNewReview({ ...newReview, content: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            ></textarea>
          </div>

          <button
            type="submit"
            className="flex items-center justify-center w-full px-4 py-3 bg-white text-black font-semibold border border-black rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {user.email ? 'Submit Review' : 'Login to Add Review'}
            <span className="ml-2">➡️</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddReviews;
