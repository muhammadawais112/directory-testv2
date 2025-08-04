import { useEffect, useState } from "react";
import { useAppServices } from "../../../../hook/services";
import Image from "next/image";
function Reviews({ formData, handleRefresh }) {
    const [reviews, setReviews] = useState([]);
    const Service = useAppServices();



    useEffect(() => {
        const getReviews = async () => {
            const { response } = await Service.reviews.Get({
                query: `business_id=${formData.id}`
            });
            if (!response) return;
            setReviews(response.data);
        };
        getReviews();
    }, [formData]);
    console.log(reviews, "reviews");
    return (
        <div className="p-6 bg-gray-100">
            <h1 className="text-2xl font-bold mb-6">User Reviews</h1>
            {reviews.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {reviews.map((review, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-lg shadow-md p-4 flex flex-col"
                        >
                            <div className="flex items-center mb-4">
                                <Image
                                    src={"https://e7.pngegg.com/pngimages/178/595/png-clipart-user-profile-computer-icons-login-user-avatars-monochrome-black-thumbnail.png"}
                                    alt={review.name || "User"}
                                    className="w-12 h-12 rounded-full object-cover mr-4"
                                />
                                <div>
                                    <h2 className="text-lg font-semibold">
                                        {review.name || "Anonymous"}
                                    </h2>
                                    <p className="text-sm text-gray-500">
                                        {new Date(review.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center mb-2">
                                {[...Array(review?.rating)].map((_, starIndex) => (
                                    <span
                                        key={starIndex}
                                        className={`text-yellow-500 ${starIndex < review.rating
                                            ? "fas fa-star"
                                            : "far fa-star"
                                            }`}
                                    >
                                        ★
                                    </span>
                                ))}
                            </div>
                            <p className="text-gray-700 mb-4">{review.content}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-600">No reviews available.</p>
            )}
        </div>
    );
}

export default Reviews;
