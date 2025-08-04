"use client"
import Loader from '@/app/components/loader';
import { useAgencyInfo } from '@/app/context/agency';
import FromOurBlog from '@/app/Home/HomeComponents/FromOurBlog';
import { useAppServices } from '@/app/hook/services';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'


const Blogs = () => {
    const Service = useAppServices();
    const [agency] = useAgencyInfo();
    const [loader, setLoader] = useState(false);
    const [blogsData, setBlogsData] = useState([]);
    const { slug, agency_id } = useParams();


    const getBlogs = async () => {
        setLoader(true)
        const { response } = await Service.blogs.Get({
            query: `agency_id=${agency_id}`,
        });
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
    if (typeof agency_id !== "undefined") {
        middleware = `/app/${agency_id}`;
    }


    return (
        <div>
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