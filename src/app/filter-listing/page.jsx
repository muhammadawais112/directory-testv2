"use client";
import React, { useEffect, useState } from 'react'
import { FaChevronDown, FaExternalLinkAlt, FaHeart } from 'react-icons/fa'
import bg from '@/app/assets/images/profile.png'
// import './listing.css'
import { useTopnavInfo } from '../../app/context/topnav'
import Pagination from '../../app/components/Pagination/Pagination'
import MapContainer from '../../app/components/Map/MapContainer'
import { useRouter, useParams } from 'next/navigation'
import { useAppServices } from '../../app/hook/services'
import { useAgencyInfo } from '../../app/context/agency'
import Loader from '../../app/components/loader'
import banner from '@/app/assets/Home/banner.svg'
import { LuCopyPlus } from 'react-icons/lu'
import { CiHeart } from 'react-icons/ci'
import { useSearchParams } from 'next/navigation'
import { useUserInfo } from '../../app/context/user'
import { SlUserUnfollow } from 'react-icons/sl'
import Image from 'next/image';

const FilterListing = () => {
  const [
    topnav,
    selctedItems,
    setselctedItems,
    selctedItemsType,
    setselctedItemsType,
    selected_category,
    setselected_category
  ] = useTopnavInfo()
  const { id } = useParams()
  const AppService = useAppServices()
  const navigate = useRouter()
  const [agency] = useAgencyInfo()
  const [user, , , planData] = useUserInfo()
  const theme_content = agency?.theme_id?.theme_data
  const themeContentObject = theme_content?.content
  // Hold the full list and the filtered list of businesses.
  const [allBusinesses, setAllBusinesses] = useState([])
  const [businesses, setBusinesses] = useState([])
  const [loader, setLoader] = useState(true)
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get('search')?.toLowerCase() || ''

  const { agency_id } = useParams()
  let middleware = `/`
  if (agency_id) {
    middleware = `/app/${agency_id}/`
  }
  // Dropdown states
  const [isCategoryOpen, setIsCategoryOpen] = useState(false)
  const [isSubCategoryOpen, setIsSubCategoryOpen] = useState(false)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  // Fetch businesses data
  const getBusinesses = async () => {
    const { response } = await AppService.accounts.get({
      query: `agency_id=${agency?._id}&tags=business`
    })
    if (!response) {
      setLoader(false)
      return
    }
    setAllBusinesses(response.data)
    setBusinesses(response.data)
    setLoader(false)
  }

  // Filtering function based on selected category or sub-category
  const BusinessFilter = data => {
    let filtered = [...data]

    // Filter by selected tags
    if (selctedItems && selctedItems.length > 0) {
      const selectedTags = selctedItems.flatMap(item => item.tags || [])
      if (selectedTags.length > 0) {
        filtered = filtered.filter(business =>
          business.business_tags?.some(bTag =>
            selectedTags.some(sTag => sTag._id === bTag.value)
          )
        )
      } else {
        filtered = []
      }
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(business => {
        const nameMatch = business.first_name
          ?.toLowerCase()
          .includes(searchQuery)
        const tagMatch = business.business_tags?.some(tag =>
          tag.label?.toLowerCase().includes(searchQuery)
        )
        return nameMatch || tagMatch
      })
    }

    setBusinesses(filtered)
  }

  // Re-apply filter whenever the selected items change.
  useEffect(() => {
    BusinessFilter(allBusinesses)
    setCurrentPage(1) // reset pagination on filter change
  }, [selctedItems, allBusinesses, selctedItemsType])

  // Clear all filters and show all businesses.
  const clearFilters = () => {
    setselected_category(null)
    setselctedItems([])
    setselctedItemsType('')
    setBusinesses(allBusinesses)
  }

  // Handle selection for category and sub-category.
  const handleTagsFilter = (item, type) => {
    if (type === 'category') {
      setselected_category(item)
      // Get all sub-categories for the selected category.
      const filteredSubs = topnav?.sub_categories?.filter(
        sub => sub?.category?._id === item?._id
      )
      // If no sub-categories exist, clear the filter to return no results.
      if (!filteredSubs || filteredSubs.length === 0) {
        setselctedItems([])
      } else {
        setselctedItems(filteredSubs)
      }
      setselctedItemsType('category')
    } else if (type === 'sub_category') {
      // For sub-category selection, we use only the selected sub-category’s tags.
      setselctedItems([item])
      setselctedItemsType('sub_category')
    }
  }

  // Close dropdowns when clicking outside.
  useEffect(() => {
    const closeDropdown = e => {
      if (!e.target.closest('.dropdown-container')) {
        setIsCategoryOpen(false)
        setIsSubCategoryOpen(false)
      }
    }
    document.addEventListener('click', closeDropdown)
    return () => document.removeEventListener('click', closeDropdown)
  }, [])

  useEffect(() => {
    getBusinesses()
  }, [])

  // Pagination calculations.
  const totalItems = businesses.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedBusinesses = businesses.slice(
    startIndex,
    startIndex + itemsPerPage
  )

  const handlePageChange = page => {
    setCurrentPage(page)
  }

  useEffect(() => {
    clearFilters()
  }, [])

  const [followedBusinesses, setFollowedBusinesses] = useState([])

  const fetchFollowed = async () => {
    if (user?._id && agency?._id) {
      const { response } = await AppService.followBusiness.Get({
        agency_id: agency._id,
        account_ref_id: user._id
      })

      console.log(response.data, 'followed business')

      if (response?.data?.length) {
        setFollowedBusinesses(response.data)
      }
    }
  }

  useEffect(() => {
    fetchFollowed()
  }, [user, agency])

  const followFunction = async business => {
    if (!user?._id) {
      navigate.push('/login')
      return
    }

    const payload = {
      business_id: business?.id,
      business_ref_id: business?._id,
      account_id: user?.id,
      account_ref_id: user?._id,
      agency_id: agency?._id
    }

    const { response } = await AppService.followBusiness.create({ payload })

    if (response) {
      setFollowedBusinesses(prev => [...prev, business.id])
      fetchFollowed()
    }
  }
  const isBusinessFollowed = id => {
    return followedBusinesses.some(item => item.business_id === id)
  }
  const unFollowFunction = async _id => {
    console.log('Trying to unfollow with _id:', _id)

    try {
      const { response } = await AppService.followBusiness.Delete({
        query: `_id=${_id}`
      })

      console.log('Unfollow API Response:', response)

      if (response.success) {
        // Remove the unfollowed business from the state
        setFollowedBusinesses(prev =>
          prev.filter(business => business._id !== _id)
        )
        console.log('Unfollowed successfully and state updated')
      }
    } catch (error) {
      console.error('Error during unfollow:', error)
    } finally {
      // You can also call fetchFollowed() to ensure that the most recent list is fetched from the server
      fetchFollowed()
    }
  }

  const [likedBusinesses, setLikedBusinesses] = useState([])

  const fetchLikedBusinesses = async () => {
    if (user?._id && agency?._id) {
      const { response } = await AppService.likeBusiness.Get({
        agency_id: agency._id,
        account_id: user._id
      })

      if (response?.data?.length) {
        setLikedBusinesses(response.data) // Store the full like object
      }
    }
  }

  useEffect(() => {
    fetchLikedBusinesses()
  }, [user, agency])

  const likeFunction = async business => {
    if (!user?._id) {
      navigate.push('/login')
      return
    }

    const payload = {
      business_id: business._id,
      account_id: user._id,
      agency_id: agency._id
    }

    const { response } = await AppService.likeBusiness.create({ payload })

    if (response.success) {
      setLikedBusinesses(prev => [...prev, business._id])
      fetchLikedBusinesses()
    }
  }

  const unLikeFunction = async likeId => {
    try {
      const { response } = await AppService.likeBusiness.Delete({
        query: `_id=${likeId}` // Pass the like's _id here
      })

      if (response.success) {
        setLikedBusinesses(
          prev => prev.filter(like => like._id !== likeId) // Filter based on _id
        )
      }
    } catch (error) {
      console.error('Error during unliking:', error)
    }
  }

  return (
    <div className='bg-gray-50'>
      {loader ? (
        <div className='flex justify-center items-center h-screen bg-white'>
          <Loader />
        </div>
      ) : paginatedBusinesses.length > 0 ? (
        <>
          {/* <div className="z-10">
                        {themeContentObject?.showMap && agency?.google_api_key ? <MapContainer height='500px' addresses={themeContentObject?.address || "123 Main St., Anytown, USA"} />
                            : <img src={themeContentObject?.main_image || banner} alt="banner" className=' h-[500px] object-cover w-full' />}
                    </div> */}

          <div className='w-[90%] lg:w-[1170px] mx-auto py-[60px]'>
            <div className='flex flex-col pb-[60px]'>
              <h3 className='text-[30px] font-semibold text-black'>See how we can help</h3>
              <p className='text-sm text-gray-600'>Home / Listings</p>
            </div>

            {/* Filter Header */}
            <div className='flex justify-between mb-[30px] items-center text-black'>
              <p>
                Showing {startIndex + 1}–
                {Math.min(startIndex + itemsPerPage, totalItems)} of{' '}
                {totalItems} results
              </p>

              <div className='flex items-center space-x-3 text-gray-700 text-sm'>
                {/* Category Dropdown */}
                <div className='relative inline-block dropdown-container'>
                  <button
                    onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                    className='w-32 bg-gray-100 border border-gray-200 py-2 px-4 rounded-md flex items-center justify-between focus:outline-none'
                  >
                    {selected_category ? selected_category.name : 'Categories'}
                    <FaChevronDown className='text-xs ml-2' />
                  </button>

                  {isCategoryOpen && (
                    <div className='absolute left-0 mt-2 z-10 bg-white divide-y divide-gray-100 rounded-lg shadow-md w-44'>
                      <ul className='py-2 text-sm text-gray-700'>
                        {topnav?.categories?.map(category => (
                          <li
                            key={category._id}
                            onClick={() => {
                              handleTagsFilter(category, 'category')
                              setIsCategoryOpen(false)
                              setIsSubCategoryOpen(false)
                            }}
                            className={`block px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                              selected_category &&
                              selected_category._id === category._id
                                ? 'bg-gray-200'
                                : ''
                            }`}
                          >
                            {category.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Subcategory Dropdown */}
                <div className='relative inline-block dropdown-container'>
                  <button
                    onClick={() => setIsSubCategoryOpen(!isSubCategoryOpen)}
                    className='w-32 bg-gray-100 border border-gray-200 py-2 px-4 rounded-md flex items-center justify-between focus:outline-none'
                    disabled={!selected_category}
                  >
                    {selctedItemsType === 'sub_category' && selctedItems[0]
                      ? selctedItems[0].name
                      : 'Subcategories'}
                    <FaChevronDown className='text-xs ml-2' />
                  </button>

                  {isSubCategoryOpen && (
                    <div className='absolute left-0 mt-2 z-10 bg-white divide-y divide-gray-100 rounded-lg shadow-md w-44'>
                      <ul className='py-2 text-sm text-gray-700'>
                        {selected_category ? (
                          topnav?.sub_categories
                            ?.filter(
                              sub =>
                                sub?.category?._id === selected_category?._id
                            )
                            .map(sub => (
                              <li
                                key={sub._id}
                                onClick={() => {
                                  handleTagsFilter(sub, 'sub_category')
                                  setIsSubCategoryOpen(false)
                                }}
                                className={`block px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                                  selctedItemsType === 'sub_category' &&
                                  selctedItems[0]?._id === sub._id
                                    ? 'bg-gray-200'
                                    : ''
                                }`}
                              >
                                {sub.name}
                              </li>
                            ))
                        ) : (
                          <li className='px-4 py-2 text-gray-500'>
                            Select a category first
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Clear Filters Button */}
                <button
                  onClick={clearFilters}
                  className='text-sm text-blue-500 hover:underline'
                >
                  Clear Filters
                </button>
              </div>
            </div>

            {/* Listings */}
            {paginatedBusinesses.length > 0 ? (
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {paginatedBusinesses.map(business => (
                  <div key={business.id}>
                    <div
                      className='relative mx-auto cursor-pointer !w-[370px] !h-[390px] rounded-xl overflow-hidden shadow-sm border'
                      onClick={() =>
                        navigate.push(`${middleware}detail-page/${business.slug}`)
                      }
                    >
                      <div className='relative'>
                        <Image
                          src={business.profile_image || bg}
                          alt={business.first_name}
                          className='w-full h-[220px] object-cover'
                          width={500}
                          height={220}
                        />
                      </div>

                      <div
                        className='p-4 cursor-pointer'
                        onClick={() =>
                          navigate.push(`${middleware}detail-page/${business.slug}`)
                        }
                      >
                        <h2 className='text-lg text-black'>
                          {business.first_name.slice(0, 25)}
                        </h2>
                        <p className='text-gray-600'>
                          {/* {business?.address}, {business?.city}, {business?.country} */}
                          {(() => {
                            const address = business?.address?.trim()
                            const city = business?.city?.trim()
                            const state = business?.state?.trim()

                            const fullAddress = address
                              ? `${address}, ${city || ''}${
                                  state ? ', ' + state : ''
                                }`
                              : `${city || ''}${state ? ', ' + state : ''}`

                            const displayText = fullAddress.slice(0, 25)
                            const isTruncated = fullAddress.length > 25

                            return displayText + (isTruncated ? '...' : '')
                          })()}
                        </p>
                        <div className="flex gap-[10px] overflow-x-scroll scroll-smooth whitespace-nowrap [-webkit-overflow-scrolling:touch] [scrollbar-width:none]">
                          {business?.business_tags?.map((tag, index) => (
                            <h3
                              key={index}
                              className='bg-white w-fit px-[10px] my-2 py-1 rounded-md border border-gray-300 font-bold text-black'
                            >
                              {tag?.label}
                            </h3>
                          ))}
                        </div>
                      </div>

                      <div className=' absolute bottom-2 w-full px-4 pt-2'>
                        <div className='border-t  pt-2 flex justify-end'>
                          <span
                            onClick={() =>
                              navigate.push(
                                `${middleware}detail-page/${business.slug}`
                              )
                            }
                            className='w-8 h-8 flex justify-center items-center cursor-pointer text-black'
                          >
                            <FaExternalLinkAlt />
                          </span>

                          {isBusinessFollowed(business.id) ? (
                            <span
                              onClick={e => {
                                e.stopPropagation()
                                const matched = followedBusinesses.find(
                                  fb => fb.business_id === business.id
                                )
                                if (matched?._id) {
                                  unFollowFunction(matched._id)
                                }
                              }}
                              className='w-8 h-8 flex justify-center items-center cursor-pointer'
                            >
                              <LuCopyPlus />
                              <SlUserUnfollow />
                            </span>
                          ) : (
                            <span
                              onClick={e => {
                                e.stopPropagation()
                                followFunction(business)
                              }}
                              className='w-8 h-8 flex justify-center items-center cursor-pointer text-black hover:text-blue-500'
                            >
                              <LuCopyPlus />
                            </span>
                          )}

                          {likedBusinesses.some(
                            like => like.business_id === business._id
                          ) ? (
                            <span
                              onClick={e => {
                                e.stopPropagation()
                                const matchedLike = likedBusinesses.find(
                                  like => like.business_id === business._id
                                )
                                if (matchedLike?._id) {
                                  unLikeFunction(matchedLike._id) // Use matchedLike._id here
                                }
                              }}
                              className='w-8 h-8 flex justify-center items-center cursor-pointer bg-white text-red-500'
                            >
                              <FaHeart />
                            </span>
                          ) : (
                            <span
                              onClick={e => {
                                e.stopPropagation()
                                likeFunction(business)
                              }}
                              className='w-8 h-8 flex justify-center items-center cursor-pointer  text-gray-500'
                            >
                              <CiHeart />
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className='text-center py-10 text-gray-600'>
                No Listing found.
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className='pt-8'>
                <Pagination
                  currentPage={currentPage}
                  totalItems={totalItems}
                  itemsPerPage={itemsPerPage}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </div>
        </>
      ) : (
        <div className='flex flex-col items-center justify-center py-20'>
          <p className='text-xl text-gray-600'>No Listing Found</p>
        </div>
      )}
    </div>
  )
}

export default FilterListing
