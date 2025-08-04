import React from "react";
import banner from '../../assets/Blogs/main.png'

const VideoCard = () => {
    return (
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl ">
            <h1 className="text-xl font-semibold mb-4">
                360° Virtual Tour
            </h1>
            <div className="bg-gray-200 rounded-lg overflow-hidden">
                <img alt="Placeholder image with a circle and triangle shapes" className=" object-cover" height={350} src={banner}  />
            </div>
        </div>
    );
};

export default VideoCard;
