import React from 'react'
import { FaArrowRight, FaPhoneAlt } from 'react-icons/fa'
import { useAgencyInfo } from '../../context/agency';
import { useUserInfo } from '../../context/user';

const NeedHelp = () => {
    const [agency] = useAgencyInfo();
    const [user] = useUserInfo();
    const theme_content = agency?.theme_id?.theme_data;

    const themeContentObject = theme_content?.content;
    return (
        <div>
            <div className="bg-gray-100 py-12  max-w-4xl mx-auto my-16">
                <div className=" mx-auto p-8 rounded-lg flex flex-col md:flex-row items-center justify-between">
                    <div className="mb-6 md:mb-0">
                        <h2 className="text-2xl font-semibold mb-2">Have questions before signing up?</h2>
                        <p className="text-gray-500">Contact us now for more information about our listing options.</p>
                    </div>
                    <div className="flex space-x-4">
                        <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-200">
                            Contact Us
                            <FaArrowRight className="ml-2" />
                        </button>
                        <button className="flex items-center px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700">
                            <FaPhoneAlt className="mr-2" />
                            {themeContentObject?.phone || "(555) 123-4567"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NeedHelp