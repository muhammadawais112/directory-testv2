import React, { useEffect, useState } from "react";
import axios from "axios";
import env from "config";
import { AgencyProvider, useAgencyInfo } from "context/agency";

const MapContainer = ({ addresses }) => {
  const [locations, setLocations] = useState([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [agency] = useAgencyInfo();

  const API_KEY = agency?.google_api_key;

  useEffect(() => {
    const fetchCoordinates = async () => {
      const addressList = Array.isArray(addresses) ? addresses : [addresses];
      try {
        const geocoded = await Promise.all(
          addressList.map(async (address) => {
            const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
              address
            )}&key=${API_KEY}`;
            const response = await axios.get(url);
            const results = response.data.results;

            if (results && results.length) {
              const { lat, lng } = results[0].geometry.location;
              return {
                name: address,
                position: { lat, lng },
              };
            }
            return null;
          })
        );
        const validLocations = geocoded.filter(Boolean);
        setLocations(validLocations);
      } catch (err) {
        console.error("Error during geocoding:", err);
      }
    };

    fetchCoordinates();
  }, [addresses]);

  useEffect(() => {
    // If Google Maps is already loaded, skip loading again
    if (window.google && window.google.maps) {
      setMapLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => setMapLoaded(true);
    document.body.appendChild(script);
  }, [API_KEY]);

  useEffect(() => {
    if (!mapLoaded || !locations.length) return;

    const map = new window.google.maps.Map(document.getElementById("map"), {
      center: {
        lat: locations[0].position.lat,
        lng: locations[0].position.lng,
      },
      zoom: 10,
    });

    // Place markers
    locations.forEach((loc) => {
      new window.google.maps.Marker({
        position: loc.position,
        map,
        title: loc.name,
      });
    });
  }, [mapLoaded, locations]);

  return (
    API_KEY && (
      <div
        id="map"
        style={{
          width: "100%",
          height: "400px",
          border: "1px solid #ccc",
          marginTop: "1rem",
        }}
      />
    )
  );
};

export default MapContainer;
