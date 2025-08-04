"use client"
import { createContext, useContext, useState, useMemo, useEffect } from "react";

import PropTypes from "prop-types";
import localforage from "localforage";
import { useAppServices } from "../hook/services";
import Loader from "../components/loader";
import RemoveAccessModel from "./RemoveAccessModel";
import Maintainance from "../Maintainance/Maintainance";

const AgencyContext = createContext();

AgencyContext.displayName = "AgencyContext";
function AgencyProvider({ children }) {
  const Service = useAppServices();
  const [agency, setAgency] = useState({});
  const [consumer, setConsumer] = useState({});
  const [loader, setLoader] = useState(true);
  const [model, setModel] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const Update = (updates) => {
    const data = { ...agency, ...updates };
    setAgency(data);
  };

  const clear = () => setAgency({});

  const value = useMemo(
    () => [agency, Update, clear, consumer, setConsumer],
    [agency, Update, clear, consumer, setConsumer]
  );

  const getAgency = async (localAgency) => {
    const token = await localforage.getItem("token");
    // const domain = "demo.smartdirectory.ai";
    // const domain = "hawaiithrive.com";
    // const domain = "directory.levelupmarketplace.com";
    // const domain = "preview.easyaidirectory.com";
    // const domain = "directory.hawaiithrive.com";
    // const domain = "norwichhomeandgarden.co.uk";
    // const domain = "directory.hawaiithrive.com";
    // const domain = "ai.nashlocal.org";
    // const domain = "directory.route66.business";
    // const domain = "gocowley.com";
    const domain = "betadirectory.smartdirectory.ai";
    // const domain = window.location.hostname.replace(/^www\./, "");

    const pathname = window.location.pathname.split("/")[2];
    let query = `domain=${domain}`;
    if (pathname == "app") {
      const agency_id = window.location.pathname.split("/")[3];
      console.log(agency_id, "testing widget ");
      query = `_id=${agency_id}`;
    }
    const { response } = await Service.agency.filter({
      query: query,
      token,
    });
    console.log("response", response)
    if (!response || !response.data) {
      setNotFound(true);
      return setLoader(false);
    }
    if (!response.data?.access) {
      setModel(true);
    }
    setAgency({ ...response.data });
    GetEventData(response?.data?.ghl?.location_id);
    const url =
      response?.data?.theme_id?.theme_data?.general?.Meta_logo ||
      "https://snapshotstore.fra1.digitaloceanspaces.com/Untitled%20design%20%287%29-83731";
    const title =
      response?.data?.theme_id?.theme_data?.general?.home_m_title ||
      "Directory";
    changeFavicon(url, title);
    localforage.setItem("agency", { ...response.data });
    return setLoader(false);
  };
  const changeFavicon = (url, newTitle) => {
    // Find the existing favicon link element, or create a new one if it doesn't exist
    let link = document.querySelector("link[rel*='icon']");

    // If the link doesn't exist, create a new one
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      link.type = "image/x-icon";
      document.head.appendChild(link);
    }

    // Update the favicon URL
    link.href = url;

    // Update the document title
    document.title = newTitle;
  };
  // const updateAgency = async () => {
  //   const localAgency = await localforage.getItem("agency");
  //   if (!localAgency) return setLoader(false);
  //   setAgency({ ...localAgency });
  //   setLoader(false);
  //   return getAgency(localAgency);
  // };

  const GetEventData = async (id) => {
    const { response } = await Service.FetchEventData.Get({
      query: `location_id=${id}`,
    });
    if (response?.success) {
      console.log("Data fetched successfully");
    }
  };

  const onLoad = () => {
    getAgency();
  };

  useEffect(onLoad, []);

  if (notFound) {
    return (
      <Maintainance message="Agency not found or currently under maintenance." />
    );
  }

  return loader ? (
    <Loader />
  ) : (
    <AgencyContext.Provider value={value}>
      {model && (
        <RemoveAccessModel
          open={model}
          onClose={() => setModel(false)}
          Update={Update}
          agency={agency}
        />
      )}
      {children}
    </AgencyContext.Provider>
  );
}

function useAgencyInfo() {
  return useContext(AgencyContext) || [];
}

AgencyProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { AgencyProvider, useAgencyInfo };
