import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppServices } from "../../../../hook/services";

function Analytics({ formData, handleRefresh }) {
    const AppService = useAppServices();
    const { id } = useParams();

    const [followersCount, setFollowersCount] = useState(0);
    const [claimRequests, setClaimRequests] = useState(0);
    const [claimRequestsApproved, setClaimRequestsApproved] = useState(0);
    const [claimRequestsPending, setClaimRequestsPending] = useState(0);
    const [reviews, setReviews] = useState(0);
    const [success, setSuccess] = useState("");

    const fetchAnalyticsData = async () => {
        try {
            const followersResponse = await AppService.followBusiness.Get({
                query: `business_id=${id}`,
            });
            setFollowersCount(followersResponse?.response?.data?.length || 0);

            const claimRequestsResponse = await AppService.claim_business.Get({
                query: `business_id=${id}`,
            });
            setClaimRequests(claimRequestsResponse?.response?.data?.length || 0);

            const claimApprovedResponse = await AppService.claim_business.Get({
                query: `business_id=${id}&status=approved`,
            });
            setClaimRequestsApproved(claimApprovedResponse?.response?.data?.length || 0);

            const claimPendingResponse = await AppService.claim_business.Get({
                query: `business_id=${id}&status=pending`,
            });
            setClaimRequestsPending(claimPendingResponse?.response?.data?.length || 0);

            const reviewsResponse = await AppService.reviews.Get({
                query: `business_id=${id}`,
            });
            setReviews(reviewsResponse?.response?.data?.length || 0);
        } catch (error) {
            console.error("Error fetching analytics data:", error);
        }
    };

    useEffect(() => {
        fetchAnalyticsData();
    }, []);

    return (
        <div className="p-6 bg-gray-100 min-h-fit">
            {success && (
                <div className="mb-4 p-2 text-green-700 bg-green-100 rounded">
                    {success}
                </div>
            )}

            <h2 className="text-2xl font-bold text-gray-800 mb-6">Business Analytics</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white shadow-md rounded-lg p-4 flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-700">Directory Visits</h3>
                        <p className="text-xl font-bold">{formData?.traffic || 0}</p>
                    </div>
                </div>

                <div className="bg-white shadow-md rounded-lg p-4 flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-700">New Followers</h3>
                        <p className="text-xl font-bold">{followersCount}</p>
                    </div>
                </div>

                <div className="bg-white shadow-md rounded-lg p-4 flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-700">Claim Requests</h3>
                        <p className="text-xl font-bold">{claimRequests}</p>
                    </div>
                </div>

                <div className="bg-white shadow-md rounded-lg p-4 flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-700">Approved Requests</h3>
                        <p className="text-xl font-bold">{claimRequestsApproved}</p>
                    </div>
                </div>

                <div className="bg-white shadow-md rounded-lg p-4 flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-700">Pending Requests</h3>
                        <p className="text-xl font-bold">{claimRequestsPending}</p>
                    </div>
                </div>

                <div className="bg-white shadow-md rounded-lg p-4 flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-700">New Reviews</h3>
                        <p className="text-xl font-bold">{reviews}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Analytics;
