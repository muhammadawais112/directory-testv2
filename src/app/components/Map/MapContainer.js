"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { usePathname } from "next/navigation";
import { useAgencyInfo } from "../../context/agency";
import { useUserInfo } from "../../context/user";

const MapContainer = ({ addresses, height = "400px", businessType, city, state, country, planData }) => {
  const [locations, setLocations] = useState([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [agency] = useAgencyInfo();
  const [user] = useUserInfo();
  const pathname = usePathname();

  const isHomePage = pathname === "/";
  const isAppAgency = pathname === `/app/${agency?._id}`;
  const GoogleMapFeature = planData?.features?.find(
    (feature) => feature.name === "Google Map Configuration"
  );

  const API_KEY = agency?.google_api_key;

  useEffect(() => {
    if (!API_KEY) return;

    const fetchCoordinates = async () => {
      const addressParts = [];

      if (addresses) {
        if (Array.isArray(addresses)) {
          addressParts.push(...addresses);
        } else {
          addressParts.push(addresses);
        }
      }

      if (city) addressParts.push(city);
      if (state) addressParts.push(state);
      if (country) {
        addressParts.push(country);
      } else {
        addressParts.push("United States");
      }

      const fullAddress = addressParts.filter(Boolean).join(", ");
      console.log("Full address to geocode:", fullAddress);

      try {
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(fullAddress)}&key=${API_KEY}`;
        const response = await axios.get(url);
        const results = response.data.results;

        if (results?.length) {
          const { lat, lng } = results[0].geometry.location;
          setLocations([
            {
              name: fullAddress,
              position: { lat, lng },
            },
          ]);
        } else {
          console.warn("No geocoding results.");
          setLocations([]);
        }
      } catch (err) {
        console.error("Geocoding error:", err);
        setLocations([]);
      }
    };

    fetchCoordinates();
  }, [addresses, city, state, country, API_KEY]);

  useEffect(() => {
    if (!API_KEY) return;

    const loadScript = () => {
      if (window.google?.maps) {
        setMapLoaded(true);
        return;
      }

      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => setMapLoaded(true);
      document.body.appendChild(script);
    };

    loadScript();
  }, [API_KEY]);

  useEffect(() => {
    if (!mapLoaded || !locations.length || !API_KEY) return;

    const isDetailPage = pathname.startsWith("/detail-page");

    if (!(isHomePage || isAppAgency || businessType === "premium" || GoogleMapFeature?.value || isDetailPage)) {
      return;
    }

    const map = new window.google.maps.Map(document.getElementById("map"), {
      center: {
        lat: locations[0].position.lat,
        lng: locations[0].position.lng,
      },
      zoom: 15,
    });

    locations.forEach((loc) => {
      new window.google.maps.Marker({
        position: loc.position,
        map,
        title: loc.name,
      });
    });
  }, [
    mapLoaded,
    locations,
    API_KEY,
    pathname,
    isAppAgency,
    isHomePage,
    businessType,
    GoogleMapFeature,
  ]);

  const shouldShowMap =
    API_KEY &&
    (isHomePage ||
      isAppAgency ||
      businessType === "premium" ||
      GoogleMapFeature?.value);

  return shouldShowMap ? (
    <div
      id="map"
      style={{
        width: "100%",
        height,
      }}
    />
  ) : null;
};

export default MapContainer;
