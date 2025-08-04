import Home from '@/app/Home/page';

export const generateMetadata = async ({ params }) => {
  const agency_id = params?.agency_id;

  try {
    const response = await axios.get(
      `https://betaapi.smartdirectory.ai/api/v1/agency/filter?query_id=${agency_id}`
    );
    const title =
      response?.data?.data?.theme_id?.theme_data?.general?.home_m_title;
    const description =
      response?.data?.data.theme_id?.theme_data?.general?.home_m_description
    const favicon =
      response?.data?.data?.theme_id?.theme_data?.general?.Meta_logo ;

    return {
      title,
      description,
      icons: {
        icon: favicon,
      },
    };
  } catch (error) {
    console.error('Metadata fetch failed:', error?.message);
  
  }
};

export default function AgencyHomePage({ params }) {
  return <Home />;
}
