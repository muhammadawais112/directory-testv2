import React from 'react';
import { IconContext } from 'react-icons';
// import key from '../../assets/Home/key.svg'
// import money from '../../assets/Home/money.svg'
// import timer from '../../assets/Home/timer.svg'
import key from "../../../../assets/Home/key.svg"
import money from "../../../../assets/Home/money.svg"
import timer from "../../../../assets/Home/timer.svg"

import { CgArrowTopRight } from "react-icons/cg";

const servicesData = [
    {
        id: 1,
        img: money,
        title: "Visibility",
        description: "Nullam sollicitudin blandit eros eu pretium. Nullam maximus ultricies auctor.",
        buttonText: "Submit a Listing",
    },
    {
        id: 2,
        img: timer,
        title: "Trust",
        description: "Nullam sollicitudin blandit eros eu pretium. Nullam maximus ultricies auctor.",
        buttonText: "Submit a Listing",
    },
    {
        id: 3,
        img: key,
        title: "Network",
        description: "Nullam sollicitudin blandit eros eu pretium. Nullam maximus ultricies auctor.",
        buttonText: "Submit a Listing",
    }
];



const ServiceCard = ({ img, title, description, buttonText, buttonIcon }) => {
    return (
        <div className=" w-[100%] mx-auto md:w-[370px] overflow-hidden hover:shadow-lg p-6 flex flex-col justify-center">

            <img src={img} alt="img" className='w-[150p] h-[150px]' />

            <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2 text-center">{title}</div>
                <p className="text-gray-700 text-base text-center">
                    {description}
                </p>
            </div>
            <div className="px-6 pt-4 pb-2 w-fit mx-auto">
                <button className="bg-black hover:bg-gray-900 text-white font-bold py-2 px-4 rounded-[12px] inline-flex items-center ">
                    {buttonText}
                    <CgArrowTopRight fontSize={25} />
                </button>
            </div>
        </div>
    );
};

const Services = () => {
    return (

        <div className=''>

        <div className='flex flex-col justify-center text-center pb-[60px]'>
            <h3 className='text-[30px] font-semibold'>
            See how We can help
            </h3>

            <p className='text-sm'>Aliquam lacinia diam quis lacus euismod</p>
        </div>
        
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {servicesData.map(service => (
                <ServiceCard
                    key={service.id}
                    img={service.img}
                    title={service.title}
                    description={service.description}
                    buttonText={service.buttonText}
                    buttonIcon={service.buttonIcon}
                />
            ))}
        </div>
        </div>
    );
};


export default Services;
