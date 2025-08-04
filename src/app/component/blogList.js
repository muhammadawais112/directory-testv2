import { useEffect, useState } from "react";
import Modal from "./popup";
import { useAppServices } from "hook/services";
import { useUserInfo } from "context/user";
import { useAgencyInfo } from "context/agency";
import profile from "../../assets/images/profile.png";
import blogImage from "../../assets/images/table.jpg";

function BlogList(props) {
  const { business } = props;
  const [modal, setModal] = useState(false);
  const [blogDetailState, setBlogDetailState] = useState({});
  const [visibleBlogs, setVisibleBlogs] = useState(4);
  const [blogsData, setBlogsData] = useState([]);
  const Service = useAppServices();
  const [user] = useUserInfo();
  const [agency] = useAgencyInfo();
  const theme_content = agency?.theme_id?.theme_data;

  const closeModal = () => {
    setModal(false);
  };

  const blogDetail = (blog) => {
    setBlogDetailState(blog);
    setModal(true);
  };

  const toggleBlogs = () => {
    if (visibleBlogs === 4) {
      setVisibleBlogs(blogsData.length);
    } else {
      setVisibleBlogs(4);
    }
  };

  const getBlogs = async () => {
    const { response } = await Service.blogs.Get({
      query: `agency_id=${user.agency_id}`,
    });
    if (response) {
      setBlogsData(response.data); // Assuming API returns a list of blogs
    }
  };

  useEffect(() => {
    getBlogs();
  }, []);

  return (
    <section className="bg-white light:bg-gray-900 rounded-md">
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <div className="mx-auto max-w-screen-sm text-center lg:mb-16 mb-8">
          <h2 className="mb-4 text-3xl lg:text-4xl tracking-tight font-extrabold text-gray-900 light:text-white">
            Our Blog
          </h2>
          {/* <p class="font-light text-gray-500 sm:text-xl light:text-gray-400">
            We use an agile approach to test assumptions and connect with the
            needs of your audience early and often.
          </p> */}
        </div>
        <div className="grid gap-8 lg:grid-cols-2">
          {blogsData.slice(0, visibleBlogs).map((blog, index) => (
            <article
              key={index}
              className="p-6 bg-white rounded-lg border border-gray-200 shadow-md light:bg-gray-800 light:border-gray-700"
            >
              <div className="mb-4">
                <img
                  className="w-full h-48 object-cover rounded-lg"
                  src={blog.image || blogImage}
                  alt="Blog Cover"
                />
              </div>

              <h2 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 light:text-white">
                <div href="#">{blog?.title}</div>
              </h2>
              <p className="mb-5 font-light text-gray-500 light:text-gray-400">
                {/* remove html and get first 100 words */}
                {blog?.description
                  .replace(/<[^>]*>?/gm, "")
                  .split(" ")
                  .slice(0, 20)
                  .join(" ")}
                ...
              </p>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <img
                    className="w-7 h-7 rounded-full object-cover"
                    src={business?.profile_image || profile}
                    alt="Jese Leos avatar"
                  />
                  <span className="font-medium light:text-white">
                    {business?.first_name}
                  </span>
                </div>
                <div
                  onClick={() => blogDetail(blog)}
                  className="cursor-pointer inline-flex items-center font-medium text-primary-600 light:text-primary-500 hover:underline"
                >
                  Read more
                  <svg
                    className="ml-2 w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                     />
                  </svg>
                </div>
              </div>
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

      <Modal isOpen={modal} onClose={closeModal} title="Blog Detail">
        <div className="container flex flex-col gap-3">
          <div className="flex flex-col gap-3">
            <div className="flex justify-center">
              <img
                src={blogDetailState?.image || "https://placehold.co/500x300"}
                className="img-fluid rounded-top"
                alt=""
                width={500}
              />
            </div>

            <div className="flex gap-2 items-center">
              <img
                src={business?.profile_image}
                className="w-10 h-10 rounded-full"
                alt=""
              />
              <div>
                <h3 className="font-semibold">{business?.first_name}</h3>
                <span className="text-gray-500">Today</span>
              </div>
            </div>

            <h1 className="text-3xl font-bold">{blogDetailState?.title}</h1>
            <div>
              {/* render html */}
              <div
                dangerouslySetInnerHTML={{
                  __html: blogDetailState?.description,
                }}
              />
            </div>
          </div>
        </div>
      </Modal>
    </section>
  );
}

export default BlogList;
