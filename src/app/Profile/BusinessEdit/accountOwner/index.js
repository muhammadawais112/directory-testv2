import { useEffect, useState } from "react";
import { useAppServices } from "../../../../hook/services";

function AccountOwner({ data }) {
    const AppService = useAppServices();
    const [success, setSuccess] = useState("");
    const [claimBusiness, setClaimBusiness] = useState([]);
    const [loading, setLoading] = useState(false);

    console.log(data,"datadata")

    useEffect(() => {
        if (data) {
            const getClaimBusiness = async () => {
                setLoading(true);
                const { response } = await AppService.claim_business.Get({
                    query: `business_id=${data.id}`,
                });

                if (response) {
                    setClaimBusiness(response.data);
                }
                setLoading(false);
            };
            getClaimBusiness();
        }
    }, [data]);


    console.log(claimBusiness,"claimBusiness")

    return (
        <div className="p-6 bg-gray-100 min-h-fit">
            {success && (
                <div className="mb-4 p-2 text-green-700 bg-green-100 rounded text-center">
                    {success}
                </div>
            )}

            <h2 className="text-2xl font-bold text-gray-800 mb-6">Account Owners</h2>

            {/* Loading State */}
            {loading ? (
                <p className="text-center text-gray-600">Loading account owners...</p>
            ) : claimBusiness.length === 0 ? (
                <p className="text-center text-gray-600">No account owners found.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-gray-600 font-semibold">Name</th>
                                <th className="px-6 py-3 text-left text-gray-600 font-semibold">Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            {claimBusiness.map((owner, index) => (
                                <tr key={owner._id} className="border-b">
                                    <td className="px-6 py-4">{`${owner.first_name} ${owner.last_name}`}</td>
                                    <td className="px-6 py-4">{owner.email}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default AccountOwner;
