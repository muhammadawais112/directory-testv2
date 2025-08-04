import { useState } from "react";
import { useNavigate } from "react-router-dom";
import blogImage from "../../../assets/Blogs/main.png";
import { useAgencyInfo } from "../../../context/agency";
import Image from "next/image";
function BusinessJobs({ blogsData }) {
  const [visibleBlogs, setVisibleBlogs] = useState(4);
  const [agency] = useAgencyInfo();
  const theme_content = agency?.theme_id?.theme_data;
  const navigate = useNavigate();

  let middleware = `/`;
  if (agency._id) {
    middleware = `/app/${agency._id}/`;
  }

  const toggleBlogs = () => {
    if (visibleBlogs === 4) {
      setVisibleBlogs(blogsData.length);
    } else {
      setVisibleBlogs(4);
    }
  };


  const handleViewDetails = (job) => {
    navigate(`${middleware}job-detail`, { state: { job } });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <section className="bg-white light:bg-gray-900 rounded-md mt-8">
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <div className="mx-auto max-w-screen-sm text-center lg:mb-16 mb-8">
          <h2 className="mb-4 text-3xl lg:text-4xl tracking-tight font-extrabold text-gray-900 light:text-white">
            Our Jobs
          </h2>
        </div>
        <div className="grid gap-8 lg:grid-cols-2">
          {blogsData.slice(0, visibleBlogs).map((blog, index) => (
            <article
              key={index}
              onClick={() => handleViewDetails(blog)}
              className="p-6 bg-white rounded-lg border cursor-pointer border-gray-200 shadow-md light:bg-gray-800 light:border-gray-700"
            >
              <div className="mb-4">
                <Image
                  className="w-full h-48 object-cover rounded-lg"
                  src={blog.image || blogImage}
                  alt="Blog Cover"
                />
              </div>

              <h2 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 light:text-white">
                <div href="#">{blog?.title}</div>
              </h2>

              {blog?.location && (
                <p className="mb-1 flex">
                  Location:
                  <p className="font-light text-gray-500 light:text-gray-400 ml-1">
                    {blog?.location}
                  </p>
                </p>
              )}

              {blog?.email && (
                <p className="mb-1 flex">
                  Email:
                  <p className="font-light text-gray-500 light:text-gray-400 ml-1">
                    {blog?.email}
                  </p>
                </p>
              )}

              {blog?.phone && (
                <p className="mb-1 flex">
                  Phone:
                  <p className="font-light text-gray-500 light:text-gray-400 ml-1">
                    {blog?.phone}
                  </p>
                </p>
              )}

              <p className="mb-5 font-light text-gray-500 light:text-gray-400">
                {/* remove html and get first 100 words */}
                {blog?.description
                  .replace(/<[^>]*>?/gm, "")
                  .split(" ")
                  .slice(0, 20)
                  .join(" ")}
                ...
              </p>
            </article>
          ))}
        </div>

        <div className="text-center mt-6">
          {blogsData.length > 4 && (
            <button
              style={{
                background: theme_content?.general?.button_bg || "#EF4444",
                color: theme_content?.general?.button_text || "#fff",
              }}
              onClick={toggleBlogs}
              className="px-6 py-2 rounded-md"
            >
              {visibleBlogs === 4 ? "Show More" : "Show Less"}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

export default BusinessJobs;
