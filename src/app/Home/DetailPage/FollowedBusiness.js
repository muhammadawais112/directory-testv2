import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import businessImage from "../../../assets/Blogs/main.png";
import { useAgencyInfo } from "../../../context/agency";
import { useAppServices } from "../../../hook/services";

function FollowedBusiness({ user }) {
  const [agency] = useAgencyInfo();
  const navigate = useNavigate();
  const Service = useAppServices();
  const { agency_id } = useParams();

  let middleware = `/`;
  if (agency_id) {
    middleware = `/app/${agency_id}/`;
  }
  const [data, setdata] = useState([]);
  const theme_content = agency?.theme_id?.theme_data;

  useEffect(() => {
    Service.followBusiness
      .Get({
        query: `account_id=${user.id}`,
      })
      .then((res) => {
        console.log(res, "res");
        setdata(res?.response?.data);
      });
  }, []);

  const handleBusinessDetails = (slug) => {
    navigate(`${middleware}detail-page/${slug}`);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">
          Businesses List ({data.length})
        </h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
        {data.map((business, index) => (
          <div className="bg-white shadow-md rounded-xl">
            <img
              src={business?.business_ref_id?.profile_image || businessImage}
              alt="Featured Listing 1"
              className="w-full mb-2 rounded-t-xl h-[300px] object-cover"
            />

            <h2 className="text-xl font-semibold text-gray-800 ml-4">
              {business?.business_ref_id?.first_name}
            </h2>

            <div className="flex justify-end gap-2 border-t pt-4 m-4">
              <a
                onClick={() =>
                  handleBusinessDetails(business?.business_ref_id?.slug)
                }
                style={{
                  background: theme_content?.general?.button_bg || "#7b06db",
                  color: theme_content?.general?.button_text || "#fff",
                }}
                className="px-4 py-2 rounded cursor-pointer text-center"
              >
                View
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FollowedBusiness;
