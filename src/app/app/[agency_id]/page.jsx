import Home from '@/app/Home/page';

export const generateMetadata = async ({ params }) => {
  const agency_id = params?.agency_id;

  try {
    const response = await axios.get(
      `https://betaapi.smartdirectory.ai/api/v1/agency/filter?query_id=${agency_id}`
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
  } catch (error) {
    console.error('Metadata fetch failed:', error?.message);
  
  }
};

export default function AgencyHomePage({ params }) {
  return <Home />;
}
