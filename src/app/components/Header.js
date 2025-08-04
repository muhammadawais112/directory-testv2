"use client"
import React, { useEffect, useRef, useState } from "react";
import logo from "../assets/Header/Logo.svg";
import { FaPhoneAlt } from "react-icons/fa";
import { IoPersonCircleOutline } from "react-icons/io5";
import { HiBars2 } from "react-icons/hi2";
import { CgArrowTopRight } from "react-icons/cg";
import { useAgencyInfo } from "../context/agency";
import { useUserInfo } from "../context/user";
import { useTopnavInfo } from "../context/topnav";
import { useAppServices } from "../hook/services";
import { useRouter, useParams } from 'next/navigation';


const Header = ({ agency_id }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  console.log("data", agency_id)
  const navigate = useRouter();
  const [agency] = useAgencyInfo();
  const Service = useAppServices();
  const theme_content = agency?.theme_id?.theme_data;
  const themeContentObject = theme_content?.content;
  const [isOpen, setIsOpen] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [events, setEvents] = useState([]);
  const [Jobs, setJobs] = useState([]);
  const [news, setNews] = useState([]);
  const [user, , clear] = useUserInfo();
  console.log(
    "Data Handling", agency_id
  )
  // const { agency_id } = useParams();
  let middleware = `/`;
  if (agency_id) {
    middleware = `/app/${agency_id}/`;
  }
  console.log("agency_id", agency_id)

  const getBlogsData = async () => {
    const { response } = await Service.blogs.Get({
      query: `agency_id=${agency_id ? agency_id : agency?._id}`,
    });
    if (response) {
      setBlogs(response.data);
    }
  };
  const getEventsData = async () => {
    const { response } = await Service.events.Get({
            query: `agency_id=${agency_id ? agency_id : agency?._id}`,

    });
    if (response) {
      setEvents(response.data);
    }
  };
  const getJobsData = async () => {
    const { response } = await Service.jobs.Get({
      query: `agency_id=${agency_id ? agency_id : agency?._id}`,
    });
    if (response) {
      setJobs(response.data);
    }
  };
  const getNewsData = async () => {
    const { response } = await Service.newsFeed.Get({
      query: `agency_id=${agency_id ? agency_id : agency?._id}`,
    });
    if (response) {
      setNews(response.data);
    }
  };

  useEffect(() => {
    getBlogsData();
    getEventsData();
    getJobsData();
    getNewsData();
  }, []);

  const [
    topnav,
    selctedItems,
    setselctedItems,
    ,
    setselctedItemsType,
    ,
    setselected_category,
  ] = useTopnavInfo();

  console.log(topnav, "topnav11111");

  const handleTagsFilter = (item, type) => {
    if (type === "category") {
      setselected_category(item);
      const filter_data = topnav?.sub_categories?.filter(
        (sub_category) => sub_category?.category?._id === item?._id
      );
      setselctedItems(filter_data);
    } else {
      setselctedItems([item]);
      setselected_category(item);
    }
    setselctedItemsType("category");
    setIsOpen(false);
    setIsMobileMenuOpen(false);
  };

  const logout = () => {
    clear();
    navigate.push(`${middleware}`);
    setIsOpen(false);
    setIsMobileMenuOpen(false);
  };

  const handleNavigate = (nav) => {
    navigate.push(nav);
    setIsOpen(false);
    setIsMobileMenuOpen(false);
  };

  const desktopDropdownRef = useRef(null);
  const mobileDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        (desktopDropdownRef.current &&
          desktopDropdownRef.current.contains(event.target)) ||
        (mobileDropdownRef.current &&
          mobileDropdownRef.current.contains(event.target))
      ) {
        return;
      }
      setIsOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  console.log("Header middleware",middleware)

  return (
    <header
      className="shadow"
      style={{
        backgroundColor: theme_content?.general?.topbar_bg || "white",
        color: theme_content?.general?.topbar_text || "black",
      }}
    >
      <div className=" flex justify-between items-center px-8 py-4">
        {/* Left Section: Logo & Navigation */}
        <div className="flex items-center space-x-8">
          <img
            onClick={() => handleNavigate(`${middleware}`)}
            src={
              theme_content?.general?.logo ||
              "https://snapshotstore.fra1.digitaloceanspaces.com/Untitled%20design%20%287%29-83731"
            }
            alt="Directory Logo"
            className="h-10 cursor-pointer"
          />
          <nav className="hidden md:flex">
            <ul className="flex space-x-4">
              <li>
                <span
                  onClick={() => handleNavigate(`${middleware}`)}
                  className="cursor-pointer hover:opacity-90 transition-colors duration-200"
                >
                  Home
                </span>
              </li>
              {topnav?.categories?.map((category) => {
                const subCategories = topnav?.sub_categories?.filter(
                  (item) => item.category?._id === category?._id
                );

                return (
                  <li
                    key={category?._id}
                    className="relative group cursor-pointer"
                  >
                    <span
                      onClick={() => {
                        handleTagsFilter(category, "category");
                        navigate(
                          `${middleware}filter-business/${category?.name
                            ?.toLowerCase()
                            .replace(/[^a-z0-9]+/g, "-")
                            .replace(/^-+|-+$/g, "")}`
                        );
                      }}
                      className="hover:text-gray-300"
                    >
                      {category.name}
                    </span>

                    {subCategories.length > 0 && (
                      <div className="absolute top-full left-0 mt-1 w-48 bg-white text-black rounded-md shadow-md z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                        <ul>
                          {subCategories.map((sub_category) => (
                            <li
                              key={sub_category?._id}
                              onClick={() => {
                                handleTagsFilter(sub_category, "sub_category");
                                navigate(
                                  `${middleware}filter-business/${sub_category?.name
                                    ?.toLowerCase()
                                    .replace(/[^a-z0-9]+/g, "-")
                                    .replace(/^-+|-+$/g, "")}`
                                );
                              }}
                              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            >
                              {sub_category.name}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </li>
                );
              })}
              {blogs?.length > 0 &&
                (!theme_content?.menu_customize ||
                  theme_content?.menu_customize?.blog?.visibility) ? (
                <li className="relative group cursor-pointer">
                  <span
                    onClick={() => handleNavigate(`${middleware}blogs`)}
                    className="cursor-pointer hover:opacity-90 transition-colors duration-200"
                  >
                    Blog
                  </span>
                  {theme_content?.menu_customize?.blog?.subMenu?.length > 0 && (
                    <div className="absolute top-full left-0 mt-1 w-48 rounded-md bg-white text-black shadow-md z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      <ul className="overflow-hidden rounded-md">
                        {theme_content?.menu_customize?.blog?.subMenu.map(
                          (submenu, index) =>
                            submenu.isEnable && (
                              <li
                                key={index}
                                onClick={() =>
                                  handleNavigate(`${middleware}${submenu.url}`)
                                }
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                              >
                                {submenu.name}
                              </li>
                            )
                        )}
                      </ul>
                    </div>
                  )}
                </li>
              ) : (
                <></>
              )}


              {events.length > 0 &&
                (!theme_content?.menu_customize ||
                  theme_content?.menu_customize?.events?.visibility) ? (
                <li className="relative group cursor-pointer">
                  <span
                    onClick={() => handleNavigate(`${middleware}events`)}
                    className="hover:text-gray-300"
                  >
                    Events
                  </span>

                  {/* Check if submenus exist and render enabled submenus */}
                  {theme_content?.menu_customize?.events?.subMenu?.length >
                    0 && (
                      <div className="absolute top-full left-0 mt-1 w-48 bg-white text-black rounded-md shadow-md z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                        <ul className="overflow-hidden rounded-md">
                          {theme_content.menu_customize.events.subMenu.map(
                            (submenu, index) =>
                              submenu?.isEnable && (
                                <li
                                  key={index}
                                  onClick={() =>
                                    handleNavigate(`${middleware}${submenu.url}`)
                                  }
                                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                >
                                  {submenu.name}
                                </li>
                              )
                          )}
                        </ul>
                      </div>
                    )}
                </li>
              ) : null}
              {Jobs?.length > 0 &&
                (!theme_content?.menu_customize ||
                  theme_content?.menu_customize?.jobs?.visibility) ? (
                <li className="relative group cursor-pointer">
                  <span
                    onClick={() => handleNavigate(`${middleware}jobs`)}
                    className="hover:text-gray-300"
                  >
                    Jobs
                  </span>

                  {/* Check if submenus exist and render enabled submenus */}
                  {theme_content?.menu_customize?.jobs?.subMenu?.length > 0 && (
                    <div className="absolute top-full left-0 mt-1 w-48 bg-white text-black rounded-md shadow-md z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      <ul className="overflow-hidden rounded-md">
                        {theme_content?.menu_customize?.jobs?.subMenu?.map(
                          (submenu, index) =>
                            submenu?.isEnable && (
                              <li
                                key={index}
                                onClick={() =>
                                  handleNavigate(`${middleware}${submenu.url}`)
                                }
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                              >
                                {submenu.name}
                              </li>
                            )
                        )}
                      </ul>
                    </div>
                  )}
                </li>
              ) : null}
              {news.length > 0 &&
                (!theme_content?.menu_customize ||
                  theme_content?.menu_customize?.news?.visibility) ? (
                <li className="relative group cursor-pointer">
                  <span
                    onClick={() => handleNavigate(`${middleware}news-feeds`)}
                    className="hover:text-gray-300"
                  >
                    News
                  </span>

                  {/* Check if submenus exist and render enabled submenus */}
                  {theme_content?.menu_customize?.news?.subMenu?.length > 0 && (
                    <div className="absolute top-full left-0 mt-1 w-48 bg-white text-black rounded-md shadow-md z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      <ul className="overflow-hidden rounded-md">
                        {theme_content?.menu_customize?.news?.subMenu?.map(
                          (submenu, index) =>
                            submenu.isEnable && (
                              <li
                                key={index}
                                onClick={() =>
                                  handleNavigate(`${middleware}${submenu.url}`)
                                }
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                              >
                                {submenu.name}
                              </li>
                            )
                        )}
                      </ul>
                    </div>
                  )}
                </li>
              ) : null}
              {!theme_content?.menu_customize ||
                theme_content?.menu_customize?.pricing?.visibility ? (
                <li className="relative group cursor-pointer">
                  <span
                    onClick={() => handleNavigate(`${middleware}plans`)}
                    className="hover:text-gray-300"
                  >
                    Pricing
                  </span>

                  {theme_content?.menu_customize?.pricing?.subMenu?.length >
                    0 && (
                      <div className="absolute top-full left-0 mt-1 w-48 bg-white text-black rounded-md shadow-md z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                        <ul className="overflow-hidden rounded-md">
                          {theme_content?.menu_customize?.pricing?.subMenu?.map(
                            (submenu, index) =>
                              submenu.isEnable && (
                                <li
                                  key={index}
                                  onClick={() =>
                                    handleNavigate(`${middleware}${submenu.url}`)
                                  }
                                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                >
                                  {submenu.name}
                                </li>
                              )
                          )}
                        </ul>
                      </div>
                    )}
                </li>
              ) : null}

              {theme_content?.pages?.map((page, index) => (
                <li
                  key={index}
                  className="cursor-pointer hover:opacity-90 transition-colors duration-200"
                  onClick={() => {
                    const cleanedName = page.name
                      .toLowerCase()
                      .trim()
                      .replace(/[^a-z0-9\s]/g, "")
                      .replace(/\s+/g, "-")
                      .replace(/-+/g, "-");
                    navigate.push(`${middleware}pages/${encodeURIComponent(cleanedName)}`);
                    setIsOpen(false);
                  }}
                >
                  {page.name}
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Right Section: Contact Info, Login, Add Listing, Menu */}
        <div className="hidden md:flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <FaPhoneAlt />
            <a
              href={`tel:${themeContentObject?.phone}`}
              className="cursor-pointer"
            >
              {themeContentObject?.phone || "+1 234 567 890"}
            </a>
          </div>

          {user?.email ? (
            <>
              <span
                className="text-sm py-2 px-4 md:py-0 md:px-0 cursor-pointer hover:bg-gray-100 md:hover:bg-transparent"
                onClick={() => handleNavigate(`${middleware}profile`)}
              >
                PROFILE
              </span>
              <span
                className="text-sm py-2 px-4 md:py-0 md:px-0 cursor-pointer hover:bg-gray-100 md:hover:bg-transparent"
                onClick={logout}
              >
                Logout
              </span>
            </>
          ) : (
            <div className="flex items-center space-x-2">
              <IoPersonCircleOutline fontSize={18} />
              <span>
                <span
                  onClick={() => handleNavigate(`${middleware}login`)}
                  className="cursor-pointer"
                >
                  Login
                </span>{" "}
                /{" "}
                <span
                  onClick={() => handleNavigate(`${middleware}register`)}
                  className="cursor-pointer"
                >
                  Register
                </span>
              </span>
            </div>
          )}
          <div
            style={{
              borderColor: theme_content?.general?.topbar_text || "black",
            }}
            onClick={() => handleNavigate(`${middleware}add-new-business`)}
            className="flex items-center cursor-pointer px-[25px] py-[13px] space-x-2 border rounded-xl"
          >
            <span>Add New Business</span>
            <CgArrowTopRight fontSize={18} />
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            <HiBars2 fontSize={25} />
          </button>
        </div>
      </div>

      {/* Mobile Menu (Dropdown) */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden shadow-lg py-4 px-6 absolute top-16 left-0 w-full z-50"
          style={{
            backgroundColor: theme_content?.general?.topbar_bg || "white",
            color: theme_content?.general?.topbar_text || "black",
          }}
        >
          <ul className="flex flex-col space-y-4">
            <li>
              <span
                onClick={() => handleNavigate(`${middleware}`)}
                className="cursor-pointer block hover:opacity-80"
              >
                Home
              </span>
            </li>
            {topnav?.categories?.map((category) => {
              const subCategories = topnav?.sub_categories?.filter(
                (item) => item.category?._id === category?._id
              );

              return (
                <li
                  key={category?._id}
                  className="relative group cursor-pointer"
                >
                  <span
                    onClick={() => {
                      handleTagsFilter(category, "category");
                      navigate(`${middleware}filter-business/${category?.name
                        ?.toLowerCase()
                        .replace(/[^a-z0-9]+/g, "-")
                        .replace(/^-+|-+$/g, "")
                        }`);
                    }}
                    className="hover:text-gray-300"
                  >
                    {category.name}
                  </span>

                  {subCategories.length > 0 && (
                    <div className="absolute top-full left-0 mt-1 w-48 bg-white text-black rounded-md shadow-md z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      <ul>
                        {subCategories.map((sub_category) => (
                          <li
                            key={sub_category?._id}
                            onClick={() => {
                              handleTagsFilter(sub_category, "sub_category");
                              navigate(
                                `${middleware}filter-business/${sub_category?.name
                                  ?.toLowerCase()
                                  .replace(/[^a-z0-9]+/g, "-")
                                  .replace(/^-+|-+$/g, "")
                                }`
                              );
                            }}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          >
                            {sub_category.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              );
            })}
            {blogs?.length > 0 &&
              (!theme_content?.menu_customize ||
                theme_content?.menu_customize?.blog?.visibility) ? (
              <li>
                <span
                  onClick={() => handleNavigate(`${middleware}blogs`)}
                  className="cursor-pointer block hover:opacity-80"
                >
                  Blog
                </span>
              </li>
            ) : (
              <></>
            )}
            {events.length > 0 &&
              (!theme_content?.menu_customize ||
                theme_content?.menu_customize?.events?.visibility) ? (
              <li
                className="cursor-pointer hover:opacity-90 transition-colors duration-200"
                onClick={() => handleNavigate(`${middleware}events`)}
              >
                Events
              </li>
            ) : (
              <></>
            )}
            {Jobs.length > 0 &&
              (!theme_content?.menu_customize ||
                theme_content?.menu_customize?.jobs?.visibility) ? (
              <li
                className="cursor-pointer hover:opacity-90 transition-colors duration-200"
                onClick={() => handleNavigate(`${middleware}jobs`)}
              >
                Jobs
              </li>
            ) : (
              <></>
            )}

            {news.length > 0 &&
              (!theme_content?.menu_customize ||
                theme_content?.menu_customize?.news?.visibility) ? (
              <li
                className="cursor-pointer hover:opacity-90 transition-colors duration-200"
                onClick={() => handleNavigate(`${middleware}news-feeds`)}
              >
                News
              </li>
            ) : (
              <></>
            )}

            {!theme_content?.menu_customize ||
              theme_content?.menu_customize?.pricing?.visibility ? (
              <li
                className="cursor-pointer hover:opacity-90 transition-colors duration-200"
                onClick={() => handleNavigate(`${middleware}plans`)}
              >
                Pricing
              </li>
            ) : null}

            {theme_content?.pages?.map((page, index) => (
              <li
                key={index}
                className="cursor-pointer block hover:opacity-80"
                onClick={() => {
                  const cleanedName = page.name
                    .toLowerCase()
                    .trim()
                    .replace(/[^a-z0-9\s]/g, "")
                    .replace(/\s+/g, "-")
                    .replace(/-+/g, "-");
                  navigate(`${middleware}pages/${encodeURIComponent(cleanedName)}`);
                  setIsOpen(false);
                  setIsMobileMenuOpen(false);
                }}
              >
                {page.name}
              </li>
            ))}
          </ul>

          {/* Contact & Auth for Mobile */}
          <div className="mt-4 flex flex-col space-y-4">
            <div className="flex items-center space-x-2">
              <FaPhoneAlt />
              <a href={`tel:${themeContentObject?.phone}`}>
                {themeContentObject?.phone || "+1 234 567 890"}
              </a>
            </div>

            {user?.email ? (
              <>
                <span
                  className="text-sm py-2 px-4 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleNavigate(`${middleware}profile`)}
                >
                  PROFILE
                </span>
                <span
                  className="text-sm py-2 px-4 cursor-pointer hover:bg-gray-100"
                  onClick={logout}
                >
                  Logout
                </span>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <IoPersonCircleOutline fontSize={18} />
                <span>
                  <span
                    onClick={() => handleNavigate(`${middleware}login`)}
                    className="cursor-pointer"
                  >
                    Login
                  </span>{" "}
                  /{" "}
                  <span
                    onClick={() => handleNavigate(`${middleware}register`)}
                    className="cursor-pointer"
                  >
                    Register
                  </span>
                </span>
              </div>
            )}

            <div
              onClick={() => handleNavigate(`/add-new-business`)}
              className="flex items-center cursor-pointer px-[25px] py-[13px] space-x-2 border rounded-xl"
            >
              <span>Add New Business</span>
              <CgArrowTopRight fontSize={25} />
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
