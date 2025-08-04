import Home from '@/app/Home/page';
import axios from 'axios';

export const generateMetadata = async ({ params }) => {
  const agency_id = params?.agency_id;

  try {
    const response = await axios.get(
      `https://betaapi.smartdirectory.ai/api/v1/agency/filter?query=_id=${agency_id}`
    );
    const title =
      response?.data?.theme_id?.theme_data?.general?.home_m_title;
    const description =
      response?.data?.theme_id?.theme_data?.general?.home_m_description

    return {
      title,
      description,
    };
  } catch (error) {
    console.error('Metadata fetch failed:', error?.message);
  
  }
};

export default function AgencyHomePage({ params }) {
  return <Home />;
}
