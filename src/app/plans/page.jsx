"use client";
import React, { useEffect, useState } from "react";
import NeedHelp from "../components/NeedHelp/NeedHelp";
import { useAgencyInfo } from "../context/agency";
import { useUserInfo } from "../context/user";
import { useRouter, useParams } from "next/navigation";
import { useAppServices } from "../hook/services";
import SubscriptionModel from "./components";
import toast from "react-hot-toast";

const Pricing = () => {
  const [agency] = useAgencyInfo();
  const [user] = useUserInfo();
  const navigate = useRouter();
  const AppService = useAppServices();
  const theme_content = agency?.theme_id?.theme_data;
  const [yearlyPrice, setYearlyPrice] = useState(false);
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [data, setData] = useState([]);
  const { agency_id } = useParams();
  let middleware = `/`;
  if (agency_id) {
    middleware = `/app/${agency_id}/`;
  }

  const onLoad = async () => {
    const { response } = await AppService.saas.products({
      query: `agency_id=${agency._id}`,
    });
    if (response) {
      const sortedData = response.data.sort((a, b) =>
        a.is_free_saas ? -1 : 1
      );
      setData(sortedData);
    }
  };

  const FreePlan = async (id) => {
    const payload = {
      plan_id: id,
      _id: user?.id,
    };

    try {
      const { response } = await AppService.accounts.update({ payload });

      if (response) {
        toast.success("Plan Subscribe Successfully");
      } else {
        console.log(
          "Failed to update the password. Please check your previous password."
        );
      }
    } catch (err) {
      console.log("An error occurred while updating the password.");
    }
  };

  useEffect(() => {
    onLoad();
  }, []);
  // const features = [
  //   {
  //     name: "Business Description",
  //     value: true,
  //   },
  //   {
  //     name: "Additional Details",
  //     value: true,
  //   },
  //   {
  //     name: "Address",
  //     value: true,
  //   },
  //   {
  //     name: "Phone",
  //     value: true,
  //   },
  //   {
  //     name: "Website",
  //     value: true,
  //   },
  //   {
  //     name: "Email Address",
  //     value: true,
  //   },
  //   {
  //     name: "Featured Image",
  //     value: true,
  //   },
  //   { name: "Google Map Configuration", value: false },
  //   { name: "Reviews", value: false },
  //   { name: "Business Hour Configurations", value: false },
  //   { name: "Video", value: false },
  //   { name: "Image Slideshow", value: false },
  //   { name: "Company Logo", value: false },
  //   { name: "Scheduled Days", value: false },
  //   { name: "Extra Links", value: false },
  //   { name: "Shortcode", value: false },
  //   { name: "Social Media", value: false },
  //   { name: "Content_Blog_Article-Custom_Made_(Worth_$300+)", value: false },
  //   { name: "Promo_Video_(Custom_Made_20sec)_(Worth_$249)", value: false },
  //   {
  //     name: "Google_Business_Profile/SEO_Website_AUDIT_(Worth_$249)",
  //     value: false,
  //   },
  //   {
  //     name: "Google_Business_Profile-Pro_Tips_N_Tricks_E-Book_(Worth$99)",
  //     value: false,
  //   },
  // ];

  console.log(data, "data123");

  return (
    <div className="p-10">
      <h2 className="text-center text-2xl font-semibold">
        Choose Your Perfect Plan From Us
      </h2>
      <div className="flex justify-center mt-4">
        <span
          className={`cursor-pointer px-4 py-2 ${
            billingCycle === "monthly"
              ? "text-blue-600 font-bold"
              : "text-gray-500"
          }`}
          onClick={() => {
            setBillingCycle("monthly");
            setYearlyPrice(false);
          }}
        >
          Monthly
        </span>
        <span className="text-gray-400">|</span>
        <span
          className={`cursor-pointer px-4 py-2 ${
            billingCycle === "yearly"
              ? "text-blue-600 font-bold"
              : "text-gray-500"
          }`}
          onClick={() => {
            setBillingCycle("yearly");
            setYearlyPrice(true);
          }}
        >
          Annually
        </span>
      </div>

      <div className="flex flex-col md:flex-row justify-center gap-8 mt-8">
        {data
          .filter((product) => {
            // Only show enabled accounts
            if (!product?.isenable_account) return false;

            // Hide plans with no price for the selected billing cycle
            const amount = yearlyPrice
              ? product?.yearly_amount
              : product?.monthly_amount;

            // Convert to number for comparison
            const numericAmount = parseInt(amount, 10);

            // If not a free plan and the price is 0 or missing, skip
            if (
              !product.is_free_saas &&
              (!numericAmount || numericAmount === 0)
            ) {
              return false;
            }

            return true;
          })
          .map((product, index) => (
            <div
              key={index}
              className={`p-6 border rounded-lg w-80 text-center shadow-md ${
                product?.product_name === "Professional"
                  ? "border-red-500 bg-red-50"
                  : "border-gray-300"
              }`}
            >
              <h3 className="text-lg font-semibold">{product?.product_name}</h3>
              <p className="text-2xl font-bold mt-2">
                {product?.is_free_saas
                  ? "FREE"
                  : `${
                      product.currency_symbol ? product.currency_symbol : "$"
                    }${
                      yearlyPrice
                        ? parseInt(product?.yearly_amount / 100)
                        : parseInt(product?.monthly_amount / 100)
                    }`}
              </p>
              <p className="text-gray-500 text-sm capitalize">
                {billingCycle == "yearly" ? "Annually" : "Monthly"}
              </p>

              <ul className="mt-4 text-left px-6 space-y-2">
                {product.features.map((feature, i) => (
                  <li
                    key={feature.name + i}
                    className="flex items-center gap-3 border-b py-1"
                  >
                    {feature.value ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="24"
                        height="24"
                        fill="none"
                        stroke="green"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M20 6L9 17l-5-5"></path>
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="24"
                        height="24"
                        fill="none"
                        stroke="red"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M18 6L6 18M6 6l12 12"></path>
                      </svg>
                    )}
                    <span className="w-full text-center break-words overflow-hidden">
                      {feature.name}
                    </span>
                  </li>
                ))}
              </ul>

              {
                product.is_free_saas ? (
                  <div className="w-full flex justify-center">
                    <span
                      style={{
                        background:
                          theme_content?.general?.button_bg || "#EF4444",
                        color: theme_content?.general?.button_text || "#fff",
                      }}
                      className="text-center py-2 rounded inline-block w-fit px-2 mt-2 cursor-pointer"
                      onClick={() => {
                        FreePlan(product._id);
                        navigate.push(`${middleware}add-new-business`);
                        window.scrollTo({
                          top: 0,
                          behavior: "smooth", // Smooth scrolling effect
                        });
                      }}
                    >
                      ADD YOUR BUSINESS
                    </span>
                  </div>
                ) : !product.is_free_saas && !product.external ? (
                  <SubscriptionModel
                    product={product}
                    yearlyPrice={yearlyPrice}
                    billingCycle={billingCycle}
                  />
                ) : (
                  <div className="w-full flex justify-center">
                    <a
                      href={
                        billingCycle === "monthly"
                          ? product.monthly_url
                          : product.yearly_url
                      }
                      style={{
                        background:
                          theme_content?.general?.button_bg || "#EF4444",
                        color: theme_content?.general?.button_text || "#fff",
                      }}
                      className="text-center py-2 rounded inline-block w-fit px-2 mt-2 cursor-pointer"
                      target="blank"
                    >
                      BUY NOW
                    </a>
                  </div>
                )
                // (!yearlyPrice &&
                //     user.plans.find(
                //       (plan) => plan.price_id == product.monthly_id
                //     )) ||
                //   (yearlyPrice &&
                //     user.plans.find(
                //       (plan) => plan.price_id == product.yearly_id
                //     )) ? (
                //   <div className="w-full flex justify-center">
                //     <a
                //       style={{
                //         background:
                //           theme_content?.general?.button_bg || "#EF4444",
                //         color: theme_content?.general?.button_text || "#fff",
                //       }}
                //       className="text-center py-2 rounded inline-block w-[50%] opacity-70 cursor-pointer"
                //     >
                //       Subscribed
                //     </a>
                //   </div>
                // ) : (
                //   <SubscriptionModel
                //     product={product}
                //     yearlyPrice={yearlyPrice}
                //   />
                // )
              }
            </div>
          ))}
      </div>

      <NeedHelp />
    </div>
  );
};

export default Pricing;
