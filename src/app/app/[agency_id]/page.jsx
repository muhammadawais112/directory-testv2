import Home from '@/app/Home/page';
import axios from 'axios';

// export const generateMetadata = async ({ params }) => {
//   const agency_id = params?.agency_id;

//   try {
//     const response = await axios.get(
//       `${process.env.API_URL}/v1/agency/filter?query=_id=${agency_id}`
//     );
//     const title =
//       response?.data?.theme_id?.theme_data?.general?.home_m_title || 'Smart Directory AI';
//     const description =
//       response?.data?.theme_id?.theme_data?.general?.home_m_description ||
//       'AI-powered business directory with events, services and more.';
//     const favicon =
//       response?.data?.theme_id?.theme_data?.general?.Meta_logo || '/favicon.ico';

//     return {
//       title,
//       description,
//       icons: {
//         icon: favicon,
//       },
//     };
//   } catch (error) {
//     console.error('Metadata fetch failed:', error?.message);
//     return {
//       title: 'Smart Directory AI',
//       description: 'AI-powered business directory with events, services and more.',
//     };
//   }
// };

export default function AgencyHomePage({ params }) {
  return <Home />;
}
