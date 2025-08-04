import axios from 'axios';
import Home from './Home/page';


// export const generateMetadata = async () => {
//   const response = await axios.get(`${process.env.API_URL}/v1/agency/filter?domain=betadirectory.smartdirectory.ai`, {
//   });
//   const title =
//     response?.data?.theme_id?.theme_data?.general?.home_m_title || "Smart Directory AI";
//   const description =
//     response?.data?.theme_id?.theme_data?.general?.home_m_description ||
//     "AI-powered business directory with events, services and more.";
//   const favicon =
//     response?.data?.theme_id?.theme_data?.general?.Meta_logo || "/favicon.ico";

//   return { title, description, favicon };
// };

export default function Page() {
  return <Home />;
}
