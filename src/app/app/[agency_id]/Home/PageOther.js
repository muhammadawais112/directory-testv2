import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAgencyInfo } from "../../context/agency";
import Loader from "../../components/loader";

function PageOther() {
  const [agency] = useAgencyInfo();
  const theme_content = agency?.theme_id?.theme_data;
  const { pageName } = useParams(); // pageName from URL
  const [iframeUrl, setIframeUrl] = useState("");
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    if (theme_content?.pages && pageName) {
      const currentSlug = decodeURIComponent(pageName.toLowerCase());
      const page = theme_content.pages.find(
        (p) => p.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')    
      .replace(/-+/g, '-')  === currentSlug
      );

      if (page) {
        setIframeUrl(page.url);
      } else {
        setIframeUrl(""); // optional: handle "page not found"
      }
    }
    setLoader(false);
  }, [pageName, theme_content]);

  if (loader) return <Loader />;
  if (!iframeUrl) return <div className="text-center mt-10 text-red-500">Page not found</div>;

  return (
    <main>
      <section style={{height:"150vh"}}>
        <iframe
          src={iframeUrl}
          title={pageName}
          style={{
            overflow: "hidden",
            width: "100%",
            height: "100%",
          }}
        />
      </section>
    </main>
  );
}

export default PageOther;
