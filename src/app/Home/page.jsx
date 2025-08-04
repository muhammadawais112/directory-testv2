"use client";
import React, { useEffect, useState } from 'react'
import banner from '../../app/assets/Home/banner.svg'
import { BsSearch } from 'react-icons/bs'
import { IoIosArrowDown } from 'react-icons/io'
import Services from './HomeComponents/Services'
import WhyChooseUs from './HomeComponents/WhyChooseUs'
import BusinessesByCities from './HomeComponents/BusinessesByCities'
import ListingTypes from './HomeComponents/ListingTypes'
import FromOurBlog from './HomeComponents/FromOurBlog'
import FeaturedListing from './HomeComponents/FeaturedListing/FeaturedListing'
import Testimonial from './HomeComponents/Testimonial'
import MapContainer from '../../app/components/Map/MapContainer'
import HomeData from './HomeComponents/Data'
import FreeListing from './HomeComponents/FreeListing'
import FeaturedListings from './HomeComponents/FeaturedListings copy'
import { useRouter, useParams } from 'next/navigation'
import { useAgencyInfo } from '../context/agency';

const Home = () => {
  const [agency] = useAgencyInfo()
  const theme_content = agency?.theme_id?.theme_data
  const socialLinks = theme_content?.general
  const themeContentObject = theme_content?.content
  const { loader, businesses, bussinessTags, blogs } = HomeData()
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useRouter()
  const { agency_id } = useParams()
  let middleware = `/`
  if (agency_id) {
    middleware = `/app/${agency_id}/`
  }
  console.log(themeContentObject, 'themeContentObject')

  console.log(businesses, 'businesses123')
  console.log("agency", agency)
  const title =
    agency?.theme_id?.theme_data?.content?.title || "Smart Directory AI";
  const description =
    agency?.theme_id?.theme_data?.content?.description ||
    "Explore AI-powered business listings.";
  useEffect(() => {
    document.title = title;
    const existingMeta = document.querySelector('meta[name="description"]');
    if (existingMeta) {
      existingMeta.setAttribute("content", description);
    } else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content = description;
      document.head.appendChild(meta);
    }
  }, [title, description]);

  return (
    <div className='bg-white'>

      <div className='z-10'>
        {themeContentObject?.showMap && agency?.google_api_key ? (
          <MapContainer
            height='500px'
            addresses={
              themeContentObject?.address || '123 Main St., Anytown, USA'
            }
          />
        ) : (
          <div className='relative'>
            <img
              src={themeContentObject?.main_image || banner}
              alt='banner'
              className='h-[500px] object-cover w-full'
            />

            {/* Dark overlay
            <div className='absolute inset-0 bg-black bg-opacity-10'></div> */}

            {/* Text content */}
            <div className='absolute inset-0 flex flex-col justify-center items-center text-white text-center px-4'>
              <h1 className='text-2xl md:text-4xl font-bold'>
                {themeContentObject?.title || 'Smart Directory AI'}
              </h1>
              <p className='text-sm md:text-lg'>
                {themeContentObject?.sub_title || 'Live Demo'}
              </p>

              <div className='flex justify-center space-x-4 mt-4 relative'>
                <div className='relative w-[330px] !text-black'>
                  <div className='flex items-center justify-between'>
                    <input
                      type='text'
                      placeholder='Search by business name or tag '
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      className='p-3 w-[350px] rounded-md border-none outline-none shadow-sm bg-white'
                    />

                    <button
                      onClick={() => {
                        if (searchTerm) {
                          navigate.push(
                            `${middleware}filter-listing?search=${encodeURIComponent(
                              searchTerm
                            )}`
                          )
                        }
                      }}
                      style={{
                        background:
                          theme_content?.general?.button_bg || '#00A6A9',
                        color: theme_content?.general?.button_text || 'white'
                      }}
                      className='p-2 py-3 rounded-md'
                    >
                      Search
                    </button>
                  </div>

                  {searchTerm && (
                    <ul className='absolute  z-10 w-[320px]  bg-white border border-gray-300 mt-1 rounded-md overflow-auto shadow-lg'>
                      {businesses
                        .filter(biz => {
                          const nameMatch = biz.first_name
                            ?.toLowerCase()
                            .includes(searchTerm.toLowerCase())
                          const tagMatch = (biz.business_tags || []).some(tag =>
                            tag?.label
                              ?.toLowerCase()
                              .includes(searchTerm.toLowerCase())
                          )
                          return nameMatch || tagMatch
                        })
                        .map((biz, index) => (
                          <li
                            onClick={() =>
                              navigate.push(`${middleware}detail-page/${biz?.slug}`)
                            }
                            key={index}
                            className='p-2 hover:bg-gray-100 w-[300px] cursor-pointer text-left'
                          >
                            {biz.first_name}{' '}
                            {biz.business_tags?.length > 0 && (
                              <span className='text-sm text-gray-500'>
                                (
                                {biz.business_tags
                                  .map(tag => tag.label)
                                  .filter(Boolean)
                                  .join(', ')}
                                )
                              </span>
                            )}
                          </li>
                        ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <section className='text-center py-8 px-4 bg-white'>
        <h2 className='text-xl md:text-2xl font-bold text-black'>
          {themeContentObject?.heading_1 || 'Welcome to SmartDirectoryAI!'}
        </h2>
        <p className='text-sm md:text-lg text-black'>
          {themeContentObject?.text_1 ||
            'A brand new business directory powered by AI'}
        </p>
      </section>

      <section className='text-center pb-8 px-4 bg-white'>
        <img
          src={
            themeContentObject?.img_1 ||
            'https://storage.googleapis.com/msgsndr/s8fbgevCLY2YSeR5r9gH/media/af4db2df-cbda-4d6c-83dc-3e593a49aa96.png'
          }
          alt='Logo'
          className='mx-auto max-h-[150px]'
        />
        <br />
        <p className='text-sm md:text-lg text-black'>
          {themeContentObject?.text_2 || 'Explore our directory demo below'}
        </p>

        <div className='flex justify-center space-x-4 mt-4'>
          {socialLinks?.learn_more && (
            <button
              style={{
                background: theme_content?.general?.button_bg || '#00A6A9',
                color: theme_content?.general?.button_text || 'white'
              }}
              className='p-2'
            >
              <a
                href={socialLinks?.learn_more}
                target='_blank'
                rel='noopener noreferrer'
              >
                Learn More
              </a>
            </button>
          )}
          {socialLinks?.contact_us && (
            <button
              style={{
                background: theme_content?.general?.button_bg || '#00A6A9',
                color: theme_content?.general?.button_text || 'white'
              }}
              className='p-2'
            >
              <a
                href={socialLinks?.contact_us}
                target='_blank'
                rel='noopener noreferrer'
              >
                Contact Us
              </a>
            </button>
          )}
        </div>

        {themeContentObject?.showMap && agency?.google_api_key ? (
          <div className='flex justify-center space-x-4 mt-4 relative'>
            <div className='relative w-[300px] '>
              <div className='flex items-center justify-between'>
                <input
                  type='text'
                  placeholder='Search by business name or tag'
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className='p-3 border border-gray-300 w-[320px] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-black'
                />
                <button
                  onClick={() => {
                    if (searchTerm) {
                      navigate.push(
                        `${middleware}filter-listing?search=${encodeURIComponent(
                          searchTerm
                        )}`
                      )
                    }
                  }}
                  style={{
                    background: theme_content?.general?.button_bg || '#00A6A9',
                    color: theme_content?.general?.button_text || 'white'
                  }}
                  className='p-2 py-3 rounded-md'
                >
                  Search
                </button>
              </div>
              {searchTerm && (
                <ul className='absolute  z-10 w-[320px]  bg-white border border-gray-300 mt-1 rounded-md overflow-auto shadow-lg text-black'>
                  {businesses
                    .filter(biz => {
                      const nameMatch = biz.first_name
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase())
                      const tagMatch = (biz.business_tags || []).some(tag =>
                        tag?.label
                          ?.toLowerCase()
                          .includes(searchTerm.toLowerCase())
                      )
                      return nameMatch || tagMatch
                    })
                    .map((biz, index) => (
                      <li
                        onClick={() =>
                          navigate.push(`${middleware}detail-page/${biz.slug}`)
                        }
                        key={index}
                        className='p-2 hover:bg-gray-100 w-[300px] cursor-pointer text-left'
                      >
                        {biz.first_name}{' '}
                        {biz.business_tags?.length > 0 && (
                          <span className='text-sm text-gray-500'>
                            (
                            {biz.business_tags
                              .map(tag => tag.label)
                              .filter(Boolean)
                              .join(', ')}
                            )
                          </span>
                        )}
                      </li>
                    ))}
                </ul>
              )}
            </div>
          </div>
        ) : (
          ''
        )}
      </section>

      {businesses.length > 0 && (
        <div className='bg-[#F7F7F7]'>
          <div className='w-[90%] lg:w-[1170px] mx-auto py-[120px]'>
            <FeaturedListings businesses={businesses} />
          </div>
        </div>
      )}

      {businesses.length > 0 && (
        <div className='bg-[#F7F7F7]'>
          <div className='w-[90%] lg:w-[1170px] mx-auto pb-[120px]'>
            <FreeListing businesses={businesses} />
          </div>
        </div>
      )}

      {/* <div className='w-[90%] lg:w-[1170px] mx-auto py-[120px]'>
        <WhyChooseUs />
      </div> */}

      {bussinessTags.length > 0 && (
        <div className='w-[90%] lg:w-[1170px] mx-auto py-[120px] bg-white'>
          <BusinessesByCities bussinessTags={bussinessTags} />
        </div>
      )}

      {/* <div className='bg-[#EB6753] text-white'>
        <div className='w-[90%] lg:w-[1170px] mx-auto py-[120px] pb-[140px]'>
          <ListingTypes />
        </div>
      </div> */}

      {/* <div className='bg-[#FEF7F6] text-black'>
        <div className='w-[90%] lg:w-[1170px] mx-auto py-[120px] pb-[140px]'>
          <Testimonial />
        </div>
      </div> */}

      {businesses.length > 0 && (
        <div className=''>
          <FeaturedListing businesses={businesses} />
        </div>
      )}

      {blogs.length > 0 && (
        <div className='w-[100%] lg:w-[100%] px-[20%] py-[120px] bg-gray-50'>
          <FromOurBlog blogsData={blogs} />
        </div>
      )}
    </div>
  )
}

export default Home
