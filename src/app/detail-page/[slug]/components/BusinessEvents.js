import { useState } from "react";
import { useRouter } from "next/navigation";
import blogImage from '@/app/assets/Blogs/main.png';
import { useAgencyInfo } from "../../../context/agency";
import Image from "next/image";

function BusinessEvents({ blogsData }) {
  const [visibleBlogs, setVisibleBlogs] = useState(4);
  const [agency] = useAgencyInfo();
  const theme_content = agency?.theme_id?.theme_data;
  const navigate = useRouter();

  let middleware = `/`;

  const toggleBlogs = () => {
    if (visibleBlogs === 4) {
      setVisibleBlogs(blogsData.length);
    } else {
      setVisibleBlogs(4);
    }
  };


  const handleViewDetails = (event) => {
    navigate.push(`${middleware}event-detail/${event?.slug}`);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const formatTo12Hour = time24 => {
    const [hour, minute] = time24.split(':')
    const date = new Date()
    date.setHours(+hour)
    date.setMinutes(+minute)
    return date.toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

 
  return (
    <section className="bg-white light:bg-gray-900 rounded-md mt-8">
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <div className="grid gap-8 lg:grid-cols-2">
          {blogsData.slice(0, visibleBlogs).map((blog, index) => (
            <article
              key={index}
              onClick={() => handleViewDetails(blog)}
              className="p-6 bg-white text-black rounded-lg border cursor-pointer border-gray-200 shadow-md light:bg-gray-800 light:border-gray-700"
            >
              <div className="mb-4">
                <Image
                  className="w-full h-48 object-cover rounded-lg"
                  src={blog.image || blogImage}
                  alt="Blog Cover"
                  width={500}
                  height={220}
                />
              </div>
              <h2 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 light:text-white">
                <div href="#">{blog?.event_name}</div>
              </h2>

             <div className="flex justify-between">
             {blog?.event_start_time && (
                <div className="mb-1 flex text-black">
                  Start Time:
                  <p className="font-light text-gray-500 light:text-gray-400 ml-1">
                    {formatTo12Hour(blog?.event_start_time)}
                  </p>
                </div>
              )}

              {blog?.event_end_time && (
                <div className="mb-1 flex text-black">
                  End Time:
                  <p className="font-light text-gray-500 light:text-gray-400 ml-1">
                    {formatTo12Hour(blog?.event_end_time)}
                  </p>
                </div>
              )}
             </div>

              {blog.event_date && (
                <div className="mb-1 flex text-black">
                  Event Date:
                  <p className="font-light text-gray-500 light:text-gray-400 ml-1">
                    {blog?.event_date}
                  </p>
                </div>
              )}
              {blog?.event_description
                .replace(/<[^>]*>?/gm, "")
                .split(" ")
                .slice(0, 20)
                .join(" ")}
              ...
            </article>
          ))}
        </div>

        <div className="text-center mt-6">
          {blogsData.length > 4 && (
            <button
              style={{
                background: theme_content?.general?.button_bg || "#00A6A9",
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

export default BusinessEvents;
