"use client"
import React, { useEffect, useState } from "react";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useUserInfo } from "../../context/user";
import { useAppServices } from "../../hook/services";
import { useAgencyInfo } from "../../context/agency";
import Modal from "../../components/popup";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";
import localforage from "localforage";
import Select from "react-select";
import { useRouter } from "next/navigation";

const AddCard = ({ isOpen, onClose, opensubmodel, product, yearlyPrice }) => {
  const [user, Update] = useUserInfo();
  const AppService = useAppServices();
  const [agency] = useAgencyInfo();
  const stripe = useStripe();
  const element = useElements();
  const [loading, setLoading] = useState(false);
  const [ownedBusiness, setOwnedBusiness] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const navigate = useRouter();

  const handleChange = (option) => {
    setSelectedBusiness(option);
  };

  const getOwned = () => {
  AppService.claim_business
    .GetOwnedBusiness({ query: `account_id=${user?.id}&status=approved` })
    .then((res) => {
      const filtered = res?.response?.data?.filter(
        (item) => item.business.plan_type === "free"
      );
      setOwnedBusiness(filtered);

      if (filtered.length === 1) {
        const onlyBusiness = filtered[0];
        setSelectedBusiness({
          label: onlyBusiness?.business?.first_name,
          value: onlyBusiness?.business?._id,
        });
      }
    });
};

  useEffect(() => {
    getOwned();
  }, []);

  // const handleSubscription = async (userData) => {
  //   const payload = {
  //     agency_id: agency._id,
  //     price_id: yearlyPrice ? product?.yearly_id : product.monthly_id,
  //     card_id: userData?.card_id,
  //     account_id: userData?.id,
  //     yearlyPrice: yearlyPrice,
  //     business_id: selectedBusiness.value,
  //     plan_id: product?._id,
  //     plan_type: "premium",
  //   };
  //   console.log(payload, "payload");
  //   const { response } = await AppService.subscriptions.account({ payload });
  //   console.log(response);
  //   if (response) {
  //     if (response.status == "completed") {
  //       Update(response.data);
  //       onClose();
  //       Swal.fire({
  //         icon: "success",
  //         title: "Account Upgraded",
  //         text: `You have been purchased ${product?.product_name} ${
  //           product.currency_symbol ? product.currency_symbol : "$"
  //         }${
  //           yearlyPrice
  //             ? parseInt(product?.yearly_amount / 100)
  //             : parseInt(product?.monthly_amount / 100)
  //         } ${yearlyPrice ? "Annually" : "Monthly"}`,
  //         padding: "2em",
  //         customClass: "sweet-alerts",
  //       });
  //     } else {
  //       stripe
  //         .confirmCardPayment(response.data.client_secret, {
  //           payment_method: response.data.paymentMethod_id, // your payment method id
  //         })
  //         .then(async function (result) {
  //           console.log(result, "resultresult");
  //           if (result?.paymentIntent?.status == "succeeded") {
  //             const payload = {
  //               price_id: yearlyPrice ? product?.yearly_id : product.monthly_id,
  //               card_id: userData?.card_id,
  //               account_id: userData?.id,
  //               yearlyPrice: yearlyPrice,
  //               subscription_data: response.subscription_data,
  //               confirm_subscription: true,
  //               business_id: selectedBusiness.value,
  //               plan_id: product?._id,
  //               plan_type: "premium",
  //             };
  //             console.log(payload, "payload");
  //             const update_result = await AppService.subscriptions.account({
  //               payload,
  //             });
  //             if (update_result.response) {
  //               Update(update_result.response.data);
  //               onClose();
  //             }
  //           } else {
  //             onClose();
  //           }
  //         });
  //     }
  //   } else {
  //     toast.error("Something went wrong while making subscription");
  //     // onClose();
  //   }
  // };
  const handleSubscription = async (userData) => {
  const payload = {
    agency_id: agency._id,
    price_id: yearlyPrice ? product?.yearly_id : product.monthly_id,
    card_id: userData?.card_id,
    account_id: userData?.id,
    yearlyPrice: yearlyPrice,
    business_id: selectedBusiness?.value,
    plan_id: product?._id,
    plan_type: "premium",
  };
  console.log(payload, "payload");

  const { response } = await AppService.subscriptions.account({ payload });
  console.log(response);

  if (response) {
    if (response.status === "completed") {
      Update(response.data);

      if (!ownedBusiness || ownedBusiness.length === 0) {
        navigate.push(`/add-new-business`);
      } else {
        onClose();
        Swal.fire({
          icon: "success",
          title: "Account Upgraded",
          text: `You have been purchased ${product?.product_name} ${
            product.currency_symbol ? product.currency_symbol : "$"
          }${
            yearlyPrice
              ? parseInt(product?.yearly_amount / 100)
              : parseInt(product?.monthly_amount / 100)
          } ${yearlyPrice ? "Annually" : "Monthly"}`,
          padding: "2em",
          customClass: "sweet-alerts",
        });
      }
    } else {
      stripe
        .confirmCardPayment(response.data.client_secret, {
          payment_method: response.data.paymentMethod_id,
        })
        .then(async function (result) {
          console.log(result, "resultresult");
          if (result?.paymentIntent?.status === "succeeded") {
            const confirmPayload = {
              ...payload,
              subscription_data: response.subscription_data,
              confirm_subscription: true,
            };
            const update_result = await AppService.subscriptions.account({ payload: confirmPayload });
            if (update_result.response) {
              Update(update_result.response.data);
              if (!ownedBusiness || ownedBusiness.length === 0) {
                navigate(`/register/business`);
              } else {
                onClose();
              }
            }
          } else {
            onClose();
          }
        });
    }
  } else {
    toast.error("Something went wrong while making subscription");
  }
};

  const handleCard = async (e) => {
    e.preventDefault();
    setLoading(true);

    const name = e.target.name?.value;
    const email = e.target.email?.value;

    if (!element) {
      toast.error("Stripe element is not available.");
      setLoading(false);
      return;
    }

    try {
      const source = await stripe.createSource(element.getElement(CardElement));
      const paymentMethod = await stripe.createPaymentMethod({
        type: "card",
        card: element.getElement(CardElement),
      });

      if (paymentMethod.error) {
        toast.error(
          paymentMethod.error.message || "Payment method creation failed."
        );
        setLoading(false);
        return;
      }

      const payload = {
        name,
        account_id: user.id,
        make_default: true,
        paymentMethod: paymentMethod.paymentMethod,
        source_id: source.source.id,
        agency_id: agency._id,
      };

      if (!user?.id) {
        payload.email = email;
      }

      const { response, error } = await AppService.user_card_details.create({
        payload,
      });

      if (error) {
        toast.error(error.message);
      } else if (response) {
        toast.success("User created and Card added successfully");
        // console.log(response.data, "response.data");
        if (user?._id) {
          handleSubscription(response.data);
        } else {
          console.log(response.data,"Card Data")
          localforage.setItem("user", { ...response.data });
          Update(response.data);
          handleSubscription(response.data);
        }
      }
    } catch (err) {
      toast.error(err?.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
      onClose();
    }
  };

  const handleSubmitClick = (e) => {
  e.preventDefault(); 
    handleCard(e);
};


  const ownedBusinessMap =
    ownedBusiness?.map((business) => ({
      label: business?.business?.first_name,
      value: business?.business?._id,
    })) ?? [];

  return (
    <Modal
      isOpen={isOpen}
      title="Add Card Details"
      onClose={onClose}
      style={{ width: "600px" }}
    >
      {user?.id && (
            <>
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Select Business
                </label>
                {ownedBusinessMap.length > 1 ? (
                  <Select
                    options={ownedBusinessMap}
                    value={selectedBusiness}
                    onChange={handleChange}
                    placeholder="Select a business..."
                    isClearable
                  />
                ) : (
                  <div>{selectedBusiness?.label}</div>
                )}
              </div>
            </>
          )}
      <div className="space-y-6 mt-5">
        {/* Product Summary */}
        <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
          <h3 className="text-lg font-semibold mb-2 text-gray-800">
            Plan Summary: {product?.plan?.planName || "N/A"}
          </h3>
          <p className="text-sm text-gray-600 mb-3">
            {product?.plan?.description}
          </p>
          <div className="text-sm text-gray-700 space-y-1">
            <p>
              <strong>Monthly:</strong>{" "}
              {product.currency_symbol ? product.currency_symbol : "$"}
              {(product.monthly_amount / 100).toFixed(2)}
            </p>
            <p>
              <strong>Yearly:</strong>{" "}
              {product.currency_symbol ? product.currency_symbol : "$"}
              {(product.yearly_amount / 100).toFixed(2)}
            </p>
          </div>
          {product?.features?.length > 0 && (
            <div className="mt-3">
              <h4 className="font-medium text-sm text-gray-700 mb-1">
                Included Features:
              </h4>
              <ul className="list-disc pl-5 text-sm text-gray-600">
                {product.features
                  .filter((f) => f.value)
                  .map((f, idx) => (
                    <li key={idx}>{f.name}</li>
                  ))}
              </ul>
            </div>
          )}
        </div>

        {/* Card Form */}
        <form onSubmit={handleSubmitClick} className="space-y-5">
          <div>
            <label
              htmlFor="card"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Card Information
            </label>
            <div className="border border-gray-300 rounded-md p-2 bg-white">
              <CardElement />
            </div>
          </div>

          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Name on Card
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              placeholder="Enter your full name"
              className="block w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          {!user?.id && (
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                placeholder="Enter your Email"
                className="block w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          )}

          <div className="flex justify-end">
            {loading ? (
              <button
                type="submit"
                disabled={loading}
                className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-6 py-2.5 inline-flex items-center"
              >
                ....Please wait
              </button>
            ) : (
              <button
                type="submit"
                className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-6 py-2.5 inline-flex items-center"
              >
                Buy Now
              </button>
            )}
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AddCard;
