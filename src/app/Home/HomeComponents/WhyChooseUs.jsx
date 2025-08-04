import React from 'react';
import WhyChooseUsImg from '../../assets/Home/why-choose.svg';
import { IoMdHome } from "react-icons/io";
import securityIcon from '../../assets/Home/security-icon.svg';
import keywordingIcon from '../../assets/Home/keywording-icon.svg';
import investmentIcon from '../../assets/Home/investment-icon.svg';

const reasons = [
  {
    icon: securityIcon,
    title: "Reason 1",
    description:
      "Nullam sollicitudin blandit eros eu pretium. Nullam maximus ultricies auctor.",
  },
  {
    icon: keywordingIcon,
    title: "Reason 2",
    description:
      "Nullam sollicitudin blandit eros eu pretium. Nullam maximus ultricies auctor.",
  },
  {
    icon: investmentIcon,
    title: "Reason 3",
    description:
      "Nullam sollicitudin blandit eros eu pretium. Nullam maximus ultricies auctor.",
  },
];

const WhyChooseUs = () => {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 items-center">
        <div className="relative">
          <img
            src={WhyChooseUsImg}
            alt="WhyChooseUs"
            className="w-full md:w-[570px] md:h-[660px] h-auto object-cover"
          />

          <div className="rounded-xl bg-white absolute bottom-[20px] right-[20px] md:right-[-81px] shadow flex p-[20px]">
            <span className="w-[60px] h-[60px] bg-black flex justify-center items-center rounded-full">
              <IoMdHome fontSize={24} color="white" />
            </span>

            <div className="ml-[10px] flex flex-col">
              <span className="text-sm text-[#717171]">Total</span>
              <span className="text-xl font-semibold">4,382 Listings</span>
            </div>
          </div>
        </div>

        <div className="ml-0 md:ml-[49px] mt-6 md:mt-0">
          <div className="mb-12">
            <h2 className="text-4xl font-bold mb-4">Why Choose Us</h2>
            <p className="text-gray-500">
              As the complexity of buildings to increase, <br /> the field of
              architecture.
            </p>
          </div>

          <div>
            {reasons.map((reason) => (
              <div key={reason.title} className="flex mb-[30px]">
                <span className="w-[70px] h-16 bg-[#F7F7F7] flex justify-center items-center rounded-full">
                  <img src={reason.icon} alt="icon" className="object-cover " />
                </span>

                <div className="pl-[20px]">
                  <h3 className="font-bold mb-2">{reason.title}</h3>
                  <p>{reason.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between max-w-[740px] mx-auto mt-[60px] space-y-4 md:space-y-0">
        <div className="text-center">
          <h3 className="text-[42px] font-semibold">4M</h3>
          <p className="text-sm">Awward Winning</p>
        </div>

        <div className="text-center">
          <h3 className="text-[42px] font-semibold">12K</h3>
          <p className="text-sm">Listings</p>
        </div>

        <div className="text-center">
          <h3 className="text-[42px] font-semibold">20M</h3>
          <p className="text-sm">Happy Customer</p>
        </div>
      </div>
    </div>
  );
};

export default WhyChooseUs;
