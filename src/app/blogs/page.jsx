"use client"
import React, { useEffect, useState } from 'react'
import FromOurBlog from '../Home/HomeComponents/FromOurBlog'
import { useAppServices } from '../hook/services';
import { useAgencyInfo } from '../context/agency';
import Loader from '../components/loader';

const Blogs = () => {
    const Service = useAppServices();
    const [agency] = useAgencyInfo();
    const [loader, setLoader] = useState(false);
    const [blogsData, setBlogsData] = useState([]);
    console.log("agency._id",agency._id)

    const getBlogs = async () => {
        setLoader(true)
        const { response } = await Service.blogs.Get({
            query: `agency_id=${agency._id}`,
        });
        console.log("data Blogs",response)
        if (response) {
            setBlogsData(response.data);
            setLoader(false) // Assuming API returns a list of blogs
        } else {
            setLoader(false) // Assuming API returns a list of blogs
        }
    };

    useEffect(() => {
        getBlogs();
    }, []);

    let middleware = "/";
    return (
        <div className='bg-gray-50'>
            {loader ? (
                <Loader />
            ) : blogsData.length > 0 ? (
                <>
                    <div className='w-[90%] lg:w-[1170px] mx-auto py-[120px]'>
                        <FromOurBlog blogsData={blogsData} middleware={middleware} />
                    </div>
                </>
            ) : (
                <p className="text-center text-gray-500 py-8">No blog found.</p>
            )}
        </div>
    )
}

export default Blogs