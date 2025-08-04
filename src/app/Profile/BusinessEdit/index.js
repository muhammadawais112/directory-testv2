import React from "react";
import { useState } from "react";
import BusinessDetail from "./businessdetail";
import SocialUrls from "./socialurls";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import BussinessLinks from "./links";
import Attachments from "./attachments";
import TeamView from "./team";
import NewsFeedView from "./news_feed";
import BusinessHours from "./businessHours";
import BlogView from "./blog";
import JobView from "./job";
import Reviews from "./reviews";
import Analytics from "./analytics";
import AccountOwner from "./accountOwner";
import Events from "./events";
import { useAppServices } from "../../../hook/services";
import { useUserInfo } from "../../../context/user";
import { useAgencyInfo } from "../../../context/agency";
import GoogleImages from "./GoogleImages";

const BussinessEdit = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const AppService = useAppServices();
  const [data, setData] = useState({});
  const [planData, setPlanData] = useState({});
  const { id } = useParams();
  const [ agency ] = useAgencyInfo();
  const [user] = useUserInfo();
  const toggleAccordion = (index) => {
    if (activeIndex === index) {
      setActiveIndex(null); // Close if the same index is clicked
    } else {
      setActiveIndex(index); // Open the clicked accordion item
    }
  };
  const getPlansFeatures = async () => {
    const { response } = await AppService.saas.planfeatures({
      query: `plan_id=${user.plan_id}`,
    });
    if (response) {
      setPlanData(response.data);
    }
  };
  const getAccountData = async () => {
    const { response } = await AppService.accounts.getbyid({
      query: `id=${id}&agency_id=${agency?._id}`,
    });
    if (response) {
      setData(response.data);
    }
  };

  // const GetPlan = async () => {
  //      const { response } = await AppService.saas.AgencyPlan({
  //     query: `agency_id=${data?.agency_id}&is_free_saas=false`,
  //   });
  //   if(response){
  //       setCheckPlanFree(response.data)
  //   }
  // }

  const businessHourFeature = data?.plan?.features?.find(
    (feature) => feature.name === "Business Hour Configurations"
  );
  const TeamsFeature = data?.plan?.features?.find(
    (feature) => feature.name === "Teams"
  );
  const AttachmentFeature = data?.plan?.features?.find(
    (feature) => feature.name === "Featured Image"
  );
  const AdditionalFeature = data?.plan?.features?.find(
    (feature) => feature.name === "Additional Details"
  );
   const blogsFeature = data?.plan?.features?.find(
    (feature) => feature.name === "Blogs"
  );
  const eventsFeature = data?.plan?.features?.find(
    (feature) => feature.name === "Events"
  );
  const jobsFeature = data?.plan?.features?.find(
    (feature) => feature.name === "Jobs"
  );
  const newsFeature = data?.plan?.features?.find(
    (feature) => feature.name === "News Feeds"
  );

  const ExtraLinkFeature = data?.plan?.features?.find(
    (feature) => feature.name === "Extra Links"
  );
  // const GoogleImageFeature = data?.plan?.features?.find(
  //   (feature) => feature.name === "Google Place Images"
  // );

  const SocialMediaFeature = data?.plan?.features?.find(
    (feature) => feature.name === "Social Media"
  );

   const ReviewsFeature = data?.plan?.features?.find(
    (feature) => feature.name === "Reviews"
  );

  const onLoad = async () => {
    getAccountData();
    getPlansFeatures();
  };
  useEffect(() => {
    onLoad();
  }, []);
  const accordionItems = [
    {
      title: "Analytics",
      content: (
        <Analytics
          data={data}
          handleRefresh={onLoad}
          features={planData?.features || []}
        />
      ),
    },
    {
      title: "Account Owner",
      content: (
        <AccountOwner
          data={data}
          handleRefresh={onLoad}
          features={planData?.features || []}
        />
      ),
    },
  ];

  if (AdditionalFeature?.value) {
    accordionItems.push(
       {
      title: "Business Detail",
      content: (
        <BusinessDetail
          data={data}
          handleRefresh={onLoad}
          features={data?.plan?.features}
        />
      ),
    },
    );
  }
  if (AttachmentFeature?.value) {
    accordionItems.push(
       {
      title: "Attachments",
      content: (
        <Attachments
          formData={data}
          handleRefresh={onLoad}
          features={planData?.features || []}
        />
      ),
    },
    );
  }
  if (TeamsFeature?.value) {
    accordionItems.push(
       {
      title: "Team",
      content: (
        <TeamView
          data={data}
          handleRefresh={onLoad}
          features={planData?.features || []}
        />
      ),
    },
    );
  }
  if (blogsFeature?.value) {
    accordionItems.push(
       {
        title: "Blogs",
        content: (
          <BlogView
            formData={data}
            handleRefresh={onLoad}
            features={planData?.features || []}
          />
        ),
      }
    );
  }
  if (newsFeature?.value) {
    accordionItems.push(
      {
        title: "News Feed",
        content: (
          <NewsFeedView
            formData={data}
            handleRefresh={onLoad}
            features={planData?.features || []}
          />
        ),
      },
    );
  }
  if (eventsFeature?.value) {
    accordionItems.push(
       {
        title: "Events",
        content: (
          <Events
            formData={data}
            handleRefresh={onLoad}
            features={planData?.features || []}
          />
        ),
      },
    );
  }
  if (jobsFeature?.value) {
    accordionItems.push(
        {
        title: "Jobs",
        content: (
          <JobView
            formData={data}
            handleRefresh={onLoad}
            features={planData?.features || []}
          />
        ),
      },
    );
  }
  if (ReviewsFeature?.value) {
    accordionItems.push(
        {
      title: "Reviews",
      content: (
        <Reviews
          formData={data}
          handleRefresh={onLoad}
          features={planData?.features || []}
        />
      ),
    },
    );
  }
  if (SocialMediaFeature?.value) {
    accordionItems.push(
       {
      title: "Social Urls",
      content: (
        <SocialUrls
          data={data}
          handleRefresh={onLoad}
          features={planData?.features || []}
        />
      ),
    },
    );
  }
  if (businessHourFeature?.value) {
    accordionItems.push(
       {
      title: "Business Hours",
      content: (
        <BusinessHours
          formData={data}
          handleRefresh={onLoad}
          features={planData?.features || []}
        />
      ),
    },
    );
  }
  if (ExtraLinkFeature?.value) {
    accordionItems.push(
      {
      title: "Links",
      content: (
        <BussinessLinks
          data={data}
          handleRefresh={onLoad}
          features={planData?.features || []}
        />
      ),
    },
    );
  }
  // if (GoogleImageFeature?.value) {
  //   accordionItems.push(
  //     {
  //     title: "Google Place Images",
  //     content: (
  //       <GoogleImages
  //         data={data}
  //         handleRefresh={onLoad}
  //         features={planData?.features || []}
  //       />
  //     ),
  //   },
  //   );
  // }
  
  return (
    <div>
      <main>
        <div className="w-full px-8 py-8">
          {accordionItems.map((item, index) => (
            <div key={index} className="border-b border-gray-200">
              <div
                className="flex justify-between items-center p-4 cursor-pointer"
                onClick={() => toggleAccordion(index)}
              >
                <span className="font-medium">{item.title}</span>
                <span className="text-gray-500">
                  {activeIndex === index ? "-" : "+"}
                </span>
              </div>
              <div
                className={`transition-height duration-300 ease-in-out overflow-hidden ${
                  activeIndex === index ? "height-fit" : "max-h-0"
                }`}
              >
                <div className="p-4">{item.content}</div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default BussinessEdit;
