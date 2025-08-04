import axios from 'axios';
import Home from './Home/page';


export const generateMetadata = async () => {
  const response = await axios.get(`https://betaapi.smartdirectory.ai/api/v1/agency/filter?domain=betadirectory.smartdirectory.ai`, {
  });
  const title =
    response?.data?.theme_id?.theme_data?.general?.home_m_title;
  const description =
    response?.data?.theme_id?.theme_data?.general?.home_m_description ;

  return { title, description };
};

export default function Page() {
  return <Home />;
}
