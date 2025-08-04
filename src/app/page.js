import Home from './Home/page';
import axios from 'axios';

export const generateMetadata = async () => {
  const response = await axios.get(
    `https://betaapi.smartdirectory.ai/api/v1/agency/filter?domain=betadirectory.smartdirectory.ai`
  );

  const themeData = response?.data?.data?.theme_id?.theme_data?.general;

  const title = themeData?.home_m_title;
  const description = themeData?.home_m_description;
  const favicon = themeData?.Meta_logo || "/default-icon.png";
  const ogImage = favicon;
  const domain = response?.data?.data?.domain;

  return {
    title,
    description,
    icons: {
      icon: favicon,
    },
    openGraph: {
      title,
      description,
      url: domain,
      type: "website",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
  };
};
export default function Page() {
  return <Home />;
}
