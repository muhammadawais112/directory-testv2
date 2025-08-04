"use client";
import React, { useState } from "react";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { toast } from "react-hot-toast";
import Modal from "@/app/components/popup";
import { useUserInfo } from "@/app/context/user";
import { useAppServices } from "@/app/hook/services";
import { useAgencyInfo } from "@/app/context/agency";

const AddCard = ({ isOpen, onClose, opensubmodel, product,setOpenUpgradeModel }) => {
  const [user, Update] = useUserInfo();
  const AppService = useAppServices();
  const [agency] = useAgencyInfo();
  const stripe = useStripe();
  const element = useElements();
  const [loading, setLoading] = useState(false);

  // const handleCard = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);

  //   const name = e.target.name.value;
  //   const email = e.target.email.value;

  //   if (!element) {
  //     toast.error("Stripe element is not available.");
  //     setLoading(false);
  //     return;
  //   }

  //   try {
  //     const source = await stripe.createSource(element.getElement(CardElement));
  //     const paymentMethod = await stripe.createPaymentMethod({
  //       type: "card",
  //       card: element.getElement(CardElement),
  //     });

  //     if (paymentMethod.error) {
  //       toast.error(
  //         paymentMethod.error.message || "Payment method creation failed."
  //       );
  //       setLoading(false);
  //       return;
  //     }

  //     const payload = {
  //       name,
  //       email,
  //       account_id: user.id,
  //       make_default: true,
  //       paymentMethod: paymentMethod.paymentMethod,
  //       source_id: source.source.id,
  //       agency_id: agency._id,
  //     };

  //     const { response, error } = await AppService.user_card_details.create({
  //       payload,
  //     });

  //     if (error) {
  //       toast.error(error.message);
  //     } else if (response) {
  //       setLoading(false);
  //       toast.success("Card added successfully");
  //       Update(response.data);
  //       onClose();
  //       opensubmodel();
  //     }
  //   } catch (err) {
  //     toast.error(err?.message || "An unexpected error occurred.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

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

    const { response, error } = await AppService.user_card_details.create({ payload });

    if (error) {
      toast.error(error.message);
    } else if (response) {
      toast.success("Card added successfully");
      if (Update) Update(response.data);
      if (onClose) onClose();
      if (opensubmodel) opensubmodel();
    }
  } catch (err) {
    toast.error(err?.message || "An unexpected error occurred.");
  } finally {
    setLoading(false);
    setOpenUpgradeModel(false);
  }
};



  return (
      <div className="space-y-6 w-[100%]">
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
        <form onSubmit={handleCard} className="space-y-5">
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
          {!user.id && (
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
            ): (
              <button
              type="submit"
              className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-6 py-2.5 inline-flex items-center"
            >
              Add Card
            </button>
            )}
          </div>
        </form>
      </div>
  );
};

export default AddCard;
