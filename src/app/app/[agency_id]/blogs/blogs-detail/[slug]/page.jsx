"use client"
import React, { useEffect, useState } from "react";
// import banner from "../../../../assets/Blogs/main.png";
import banner from "@/app/assets/Blogs/main.png"
import { useAgencyInfo } from "@/app/context/agency";
import FromOurBlog from "@/app/Home/HomeComponents/FromOurBlog";
import { useAppServices } from "@/app/hook/services";
import { useParams } from "next/navigation";
import Image from "next/image";


const BlogDetail = () => {
  const Service = useAppServices();
  const { slug, agency_id } = useParams();
  console.log("agency_id", agency_id)
  const [agency] = useAgencyInfo();
  const [loader, setLoader] = useState(false);
  const [blog, setBlog] = useState({});
  const [blogsData, setBlogsData] = useState([]);

  let middleware = "/";
  if (typeof agency_id !== "undefined") {
    middleware = `/app/${agency_id}`;
  }

  const getSingleBlog = async () => {
    const { response } = await Service.blogs.GetSingleBlog({
      query: `agency_id=${agency_id}&slug=${slug}`,
    });
    console.log("response", response)
    if (response) {
      setBlog(response?.data);
    }
  };

  const getBlogs = async () => {
    setLoader(true);
    const { response } = await Service.blogs.Get({
      query: `agency_id=${agency._id}`,
    });
    if (response) {
      setBlogsData(response.data);
      setLoader(false); // Assuming API returns a list of blogs
    } else {
      setLoader(false); // Assuming API returns a list of blogs
    }
  };

  useEffect(() => {
    getBlogs();
    getSingleBlog();
  }, [slug]);

  return (
    <div>
      <Image
        src={blog?.image || banner}
        alt="banner"
        className="!w-full h-[500px] object-cover"
        width={400}
        height={400}
      />

      <div className="pt-16">
        <div>
          <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-semibold mb-4">{blog?.title}</h1>
            <div
              className="text-gray-700 mb-4"
              dangerouslySetInnerHTML={{
                __html: blog?.description
                  ?.replace(/<h1>/g, '<h1 class="text-3xl font-bold mb-4">')
                  .replace(/<h2>/g, '<h2 class="text-2xl font-semibold mb-3">')
                  .replace(/<h3>/g, '<h3 class="text-xl font-medium mb-2">'),
              }}
            ></div>
            {/* <p className="mb-4">It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text.</p> */}

            {/* <div className="bg-pink-100 p-4 mb-6">
                            <p className="italic mb-2">Aliquam hendrerit sollicitudin purus, quis rutrum mi accumsan nec. Quisque bibendum orci ac nibh facilisis, at malesuada orci congue.</p>
                            <p className="font-semibold">Luis Pickford</p>
                        </div>

                        <h2 className="text-2xl font-semibold mb-4">2. Choose methods wisely</h2>
                        <ul className="space-y-2">
                            <li className="flex items-center">
                                <BsCheck fontSize={20} className='mr-1' color='green' />
                                <span>Become a UI/UX designer.</span>
                            </li>
                            <li className="flex items-center">
                                <BsCheck fontSize={20} className='mr-1' color='green' />
                                <span>You will be able to start earning money Figma skills.</span>
                            </li>
                            <li className="flex items-center">
                                <BsCheck fontSize={20} className='mr-1' color='green' />
                                <span>Build a UI project from beginning to end.</span>
                            </li>
                            <li className="flex items-center">
                                <BsCheck fontSize={20} className='mr-1' color='green' />
                                <span>Work with colors & fonts.</span>
                            </li>
                            <li className="flex items-center">
                                <BsCheck fontSize={20} className='mr-1' color='green' />
                                <span>You will create your own UI Kit.</span>
                            </li>
                            <li className="flex items-center">
                                <BsCheck fontSize={20} className='mr-1' color='green' />
                                <span>Build & test a complete mobile app.</span>
                            </li>
                            <li className="flex items-center">
                                <BsCheck fontSize={20} className='mr-1' color='green' />
                                <span>Learn to design mobile apps & websites.</span>
                            </li>
                            <li className="flex items-center">
                                <BsCheck fontSize={20} className='mr-1' color='green' />
                                <span>Design 3 different logos.</span>
                            </li>
                            <li className="flex items-center">
                                <BsCheck fontSize={20} className='mr-1' color='green' />
                                <span>Create low-fidelity wireframe.</span>
                            </li>
                            <li className="flex items-center">
                                <BsCheck fontSize={20} className='mr-1' color='green' />
                                <span>Downloadable exercise files.</span>
                            </li>
                        </ul> */}
          </div>

          {/* <div className="flex justify-between items-center w-full max-w-2xl mx-auto py-4 border-t border-gray-200 mt-6">
                        <div className="flex items-center space-x-3">
                            <span className="text-gray-700 font-medium">Share this post</span>
                            <FaFacebookF className="text-gray-600 hover:text-black cursor-pointer" />
                            <FaTwitter className="text-gray-600 hover:text-black cursor-pointer" />
                            <FaInstagram className="text-gray-600 hover:text-black cursor-pointer" />
                            <FaLinkedinIn className="text-gray-600 hover:text-black cursor-pointer" />
                        </div>

                        <div className="flex space-x-2">
                            <span className="px-4 py-2 bg-pink-100 text-gray-700 rounded-full text-sm font-medium">
                                Figma
                            </span>
                            <span className="px-4 py-2 bg-pink-100 text-gray-700 rounded-full text-sm font-medium">
                                Sketch
                            </span>
                            <span className="px-4 py-2 bg-pink-100 text-gray-700 rounded-full text-sm font-medium">
                                HTML5
                            </span>
                        </div>
                    </div> */}
        </div>

        {/* <div>
                    <ShowReviews />
                </div>
                <div>
                    <AddReviews />
                </div> */}

        <div className="w-[90%] lg:w-[1170px] mx-auto py-[120px]">
          <FromOurBlog blogsData={blogsData} middleware={middleware} />
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
