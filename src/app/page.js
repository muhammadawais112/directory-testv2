import Home from './Home/page';
import axios from 'axios';

export const generateMetadata = async () => {
  const response = await axios.get(`https://betaapi.smartdirectory.ai/api/v1/agency/filter?domain=betadirectory.smartdirectory.ai`, {
  });
  console.log("response Meta",response?.data,response?.data?.theme_id?.theme_data?.general?.home_m_title)
  const title =
    response?.data?.data?.theme_id?.theme_data?.general?.home_m_title;
  const description =
    response?.data?.data?.theme_id?.theme_data?.general?.home_m_description ;
     const favicon =
      response?.data?.data?.theme_id?.theme_data?.general?.Meta_logo ;
 console.log(" response?.data?.theme_id?.theme_data?.general?.home_m_title",response?.data?.data?.theme_id?.theme_data?.general?.home_m_title)
  return { title, description ,

         icons: {
        icon: favicon,
      },
  };
};

export default function Page() {
  return <Home />;
}
