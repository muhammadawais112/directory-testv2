"use client"
import { FaInstagram, FaLinkedinIn, FaTwitter, FaYoutube } from "react-icons/fa"
import { FaFacebookF } from "react-icons/fa"
import { useUserInfo } from "../context/user"
import { useParams, useRouter } from 'next/navigation';
import Link from "next/link"
import { useAgencyInfo } from "../context/agency";



const Footer = () => {
  const [agency] = useAgencyInfo()
  const [user] = useUserInfo()
  const theme_content = agency?.theme_id?.theme_data

  const themeContentObject = theme_content?.content
  const navigate = useRouter()

  const socialLinks = theme_content?.general
  let middleware = `/`

  const { agency_id } = useParams()

  if (agency_id) {
    middleware = `/app/${agency_id}/`
  }

  return (
    <footer
      style={{
        backgroundColor: socialLinks?.footer_background || "#232020",
        color: socialLinks?.footer_text || "white",
      }}
      className="pt-8 sm:pt-12 md:pt-16 lg:pt-[60px]"
    >
      <div className="max-w-[1170px] w-full px-4 sm:px-6 lg:px-8 mx-auto">
        {/* Main footer content */}
        <div className="flex flex-col space-y-8 lg:space-y-0 lg:flex-row lg:justify-between lg:items-start">
          {/* Logo section */}
          <div className="flex justify-center lg:justify-start">
            <img
              src={
                theme_content?.general?.footer_logo ||
                "https://snapshotstore.fra1.digitaloceanspaces.com/Untitled%20design%20%287%29-83731" ||
                "/placeholder.svg"
              }
              alt="Directory"
              className="h-8 sm:h-10 lg:h-11 w-auto max-w-[120px] sm:max-w-[150px] object-cover"
            />
          </div>

          {/* Contact information */}
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 lg:gap-12 items-center sm:items-start lg:w-auto">
            <div className="text-center sm:text-left">
              <p className="text-base sm:text-lg font-bold mb-1 sm:mb-2">Phone</p>
              <Link href={`tel:${themeContentObject?.phone}`} className="text-sm sm:text-[15px] font-semibold mb-3 sm:mb-4">
                {themeContentObject?.phone || "(555) 123-4567"}
              </Link>
              {themeContentObject?.address && themeContentObject.address.length > 0 && (
                <>
                  <p className="text-base sm:text-lg font-bold mb-1 sm:mb-2">Address</p>
                  <p className="text-sm sm:text-[15px] font-semibold">{themeContentObject.address}</p>
                </>
              )}
            </div>

            <div className="text-center sm:text-left">
              <p className="text-base sm:text-lg font-bold mb-1 sm:mb-2">Email</p>
              <p className="text-sm sm:text-[15px] font-semibold break-all sm:break-normal">
                {themeContentObject?.email || "email@smartdirectory.ai"}
              </p>
            </div>
          </div>

          {/* Social media section */}
          {socialLinks && (
            <div className="text-center lg:text-left">
              <p className={`text-sm sm:text-[15px] font-semibold pb-3 text-${socialLinks?.Sub_text}`}>
                Follow Us on Social Media
              </p>
              <div className="flex justify-center lg:justify-start space-x-2 mt-1">
                {socialLinks?.facebook && (
                  <Link
                    href={socialLinks?.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-[36px] h-[36px] sm:w-[40px] sm:h-[40px] cursor-pointer rounded-full hover:bg-[#24252B] flex justify-center items-center transition-colors duration-200"
                  >
                    <FaFacebookF fontSize={12} className="sm:text-[14px]" />
                  </Link>
                )}

                {socialLinks?.twitter && (
                  <Link
                    href={socialLinks?.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-[36px] h-[36px] sm:w-[40px] sm:h-[40px] rounded-full cursor-pointer hover:bg-[#24252B] flex justify-center items-center transition-colors duration-200"
                  >
                    <FaTwitter fontSize={12} className="sm:text-[14px]" />
                  </Link>
                )}

                {socialLinks?.youtube && (
                  <Link
                    href={socialLinks?.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-[36px] h-[36px] sm:w-[40px] sm:h-[40px] rounded-full cursor-pointer hover:bg-[#24252B] flex justify-center items-center transition-colors duration-200"
                  >
                    <FaYoutube fontSize={12} className="sm:text-[14px]" />
                  </Link>
                )}

                {socialLinks?.instagram && (
                  <Link
                    href={socialLinks?.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-[36px] h-[36px] sm:w-[40px] sm:h-[40px] rounded-full cursor-pointer hover:bg-[#24252B] flex justify-center items-center transition-colors duration-200"
                  >
                    <FaInstagram fontSize={12} className="sm:text-[14px]" />
                  </Link>
                )}

                {socialLinks?.linkedin && (
                  <Link
                    href={socialLinks?.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-[36px] h-[36px] sm:w-[40px] sm:h-[40px] rounded-full cursor-pointer hover:bg-[#24252B] flex justify-center items-center transition-colors duration-200"
                  >
                    <FaLinkedinIn fontSize={12} className="sm:text-[14px]" />
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer bottom section */}
        <div className="border-t border-gray-700 py-4 sm:py-5 mt-8 sm:mt-12 lg:mt-[60px] flex flex-col sm:flex-row justify-between items-center sm:items-start text-xs sm:text-sm">
          <div className="mb-3 sm:mb-0 text-center sm:text-left">
            {themeContentObject?.copyright || "© directory - All rights reserved"}
          </div>

          <div
            className={`flex flex-wrap justify-center sm:justify-end items-center gap-x-1 sm:gap-x-0
                ${theme_content?.footerPages?.length > 1 ? "sm:divide-x sm:divide-gray-500" : ""}`}
          >
            {theme_content?.footerPages?.map((page, index) => (
              <p
                key={index}
                className="px-2 py-1 sm:py-0 cursor-pointer hover:text-gray-300 transition-colors duration-200 text-center"
                onClick={() => {
                  const cleanedName = page.name
                    .toLowerCase()
                    .trim()
                    .replace(/[^a-z0-9\s]/g, "")
                    .replace(/\s+/g, "-")
                    .replace(/-+/g, "-");
                  navigate.push(`${middleware}page/${encodeURIComponent(cleanedName)}`)
                }
                }
              >
                {page.name}
              </p>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
