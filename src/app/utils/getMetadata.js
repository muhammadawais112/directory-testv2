
export function getMetadata(agency) {
  return {
    title:
      agency?.theme_id?.theme_data?.general?.home_m_title ||
      "Smart Directory",
    description:
      agency?.theme_id?.theme_data?.general?.home_m_description ||
      "AI-powered business directory with events, services and more.",
    favicon:
      agency?.theme_id?.theme_data?.general?.Meta_logo ||
      "/favicon.ico",
  };
}
