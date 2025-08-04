// import { useAppServices } from "@/app/hook/services";
import { useEffect, useState } from "react";
// import { useAgencyInfo } from "../../context/agency";
import { useAppServices } from "@/app/hook/services";
import { useAgencyInfo } from "@/app/context/agency";

const HomeData = () => {
    const AppService = useAppServices();
    const [agency] = useAgencyInfo()
    const [businesses, setBusinesses] = useState([]);
    const [bussinessTags, setBussinessTags] = useState([]);
    const [blogs, setBlogs] = useState([]);
    const [loader, setLoader] = useState(true);

    const getBusinesses = async () => {
        const { response } = await AppService.accounts.get({
            query: `agency_id=${agency?._id}&tags=business`,
        });
        if (!response) return setLoader(false);
        const sorted = response?.data?.sort((a, b) => a.order - b.order);
        setBusinesses(sorted);
        return setLoader(false);
    };

    const getBussinessTags = async () => {
        const { response } = await AppService.accounts.businessTags({
            query: `agency_id=${agency?._id}`,
        });
        if (!response) return setLoader(false);
        const sorted = response?.data?.sort((a, b) => a.order - b.order);
        setBussinessTags(sorted);
        return setLoader(false);
    };

    const getBlogs = async () => {
        const { response } = await AppService.blogs.Get({
            query: `agency_id=${agency?._id}`,
        });
        if (!response) return setLoader(false);
        setBlogs(response.data);
        return setLoader(false);
    };

    const onLoad = () => {
        getBusinesses();
        getBussinessTags();
        getBlogs();
    };

    useEffect(onLoad, []);

    return {
        loader,
        businesses,
        bussinessTags,
        blogs
    };
}

export default HomeData;