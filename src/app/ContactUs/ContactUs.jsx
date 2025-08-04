import React from 'react'
import Services from '../Home/HomeComponents/Services'
import { FaArrowRight } from 'react-icons/fa'
import banner from '../../assets/Home/banner.svg'
import NeedHelp from '../../components/NeedHelp/NeedHelp'
import MapContainer from '../../components/Map/MapContainer'


const ContactUs = () => {
    return (
        <div>
            <div className='z-10'>
            <MapContainer height='700px'/>
                {/* <img src={banner} alt="banner" className=' h-[50vh] object-cover !w-[100%]' /> */}
            </div>
            
            <div className="flex justify-center items-center mx-auto mt-16">
                <div className="bg-white p-8 border rounded-lg shadow-lg w-full max-w-md">
                    <h2 className="text-2xl font-semibold mb-6">Have questions? Get in touch!</h2>
                    <form>
                        <div className="mb-4">
                            <label htmlFor="first-name" className="block text-sm font-medium mb-2">
                                First Name
                            </label>
                            <input
                                type="text"
                                id="first-name"
                                placeholder="Your Name"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="last-name" className="block text-sm font-medium mb-2">
                                Last Name
                            </label>
                            <input
                                type="text"
                                id="last-name"
                                placeholder="Your Name"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="email" className="block text-sm font-medium mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                placeholder="Your Email"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <div className="mb-6">
                            <label htmlFor="message" className="block text-sm font-medium mb-2">
                                Message
                            </label>
                            <textarea
                                id="message"
                                rows="4"
                                placeholder="There are many variations of passages."
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-red-500 text-white py-2 rounded-lg font-semibold hover:bg-red-600 transition duration-200 flex justify-center items-center"
                        >
                            Submit <FaArrowRight className="ml-2" />
                        </button>
                    </form>
                </div>
            </div>

            <div className=' w-[90%] lg:w-[1170px] mx-auto py-[120px]'>
        <Services />
      </div>

      <NeedHelp/>
        </div>
    )
}

export default ContactUs