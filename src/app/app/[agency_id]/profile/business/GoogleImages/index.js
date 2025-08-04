"use client";
import { useAgencyInfo } from "@/app/context/agency";
import { useAppServices } from "@/app/hook/services";
import { useState } from "react";
import { useEffect } from "react";
import { toast } from "react-hot-toast";

const GoogleImages = ({ data, handleRefresh }) => {
  const [agency] = useAgencyInfo();
  const [googleImages, setGoogleImages] = useState([]);
  const [enabledImages, setEnabledImages] = useState({});
  const [loading, setLoading] = useState(false);
  const Service = useAppServices();

  // Fetch Google Images
  const GetGoogleImages = async () => {
    const { response } = await Service.reviews.GetGoogleImages({
      query: `place_id=${data?.google_place_id}&Apikey=${agency?.google_api_key}`,
    });
    if (response) {
      const urls = response?.data || [];
      setGoogleImages(urls);
      // initialize toggle state (all enabled by default)
      const initToggleState = {};
      urls.forEach((url) => {
        initToggleState[url] = data?.google_images?.includes(url);
      });
      setEnabledImages(initToggleState);
    }
  };

  useEffect(() => {
    if (data?.google_place_id) GetGoogleImages();
  }, [data?.google_place_id]);

  // Handle toggle change
  const toggleImage = (url) => {
    setEnabledImages((prev) => ({
      ...prev,
      [url]: !prev[url],
    }));
  };

  // Submit enabled images
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const selectedImages = Object.entries(enabledImages)
      .filter(([_, isEnabled]) => isEnabled)
      .map(([url]) => url);

    const payload = {
      _id: data?._id,
      googleimages: selectedImages,
    };

    const { response } = await Service.accounts.SaveGoogleImages({
      payload: payload,
    });
    if (response?.success) {
      handleRefresh?.();
      setLoading(false);
      toast.success("Visible images saved successfully!");
    }else{
        setLoading(false);
        toast.error("Failed to save visible images.");
    }
  };
  return (
    <>
       <form onSubmit={handleSubmit}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "1rem",
              justifyContent: "space-between",
              marginBottom: "50px",
            }}
          >
            <div>
              <h2 style={{ fontWeight: "bold" }}>Google Place Images</h2>
              <p style={{ color: "#555" }}>
                Show Images on your website those you want
              </p>
            </div>
            <button
              type="submit"
              style={{
                marginTop: "1rem",
                marginBottom: "2rem",
                padding: "10px 20px",
                backgroundColor: "black",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
                disabled={loading}
            >
              {loading ? "Saving..." : "Save Visible Images"}
            </button>
          </div>
          <div style={{ display: "flex", gap: "5rem", flexWrap: "wrap" }}>
            {googleImages?.length > 0 ? (
              googleImages.map((imageUrl, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    backgroundColor: "#f9f9f9",
                    padding: "10px",
                    borderRadius: "8px",
                    position: "relative",
                  }}
                >
                  <img
                    src={imageUrl}
                    alt={`Google place image ${index + 1}`}
                    style={{
                      width: "100px",
                      height: "100px",
                      borderRadius: "8px",
                      objectFit: "cover",
                    }}
                  />
                  <input
                    style={{
                      position: "absolute",
                      top: "20px",
                      right: "20px",
                      zIndex: 1000,
                      width: "20px",
                      height: "20px",
                      cursor: "pointer",
                    }}
                    type="checkbox"
                    checked={enabledImages[imageUrl] || false}
                    onChange={() => toggleImage(imageUrl)}
                  />
                  {/* <FormControlLabel
                  control={
                    <Switch
                      checked={enabledImages[imageUrl] || false}
                      onChange={() => toggleImage(imageUrl)}
                      color="primary"
                    />
                  }
                /> */}
                </div>
              ))
            ) : (
              <p className="text-gray-500">No images available.</p>
            )}
          </div>
        </form>
    </>
  );
};

export default GoogleImages;
