/**
=========================================================
* Material Dashboard 2 React - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

/**
  This file is used for controlling the global states of the components,
  you can customize the states for the different components here.
*/
"use client"
import { createContext, useContext, useState, useMemo, useEffect } from "react";

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";
import localforage from "localforage";
import { useAgencyInfo } from "./agency";
import { useAppServices } from "../hook/services";
import Loader from "../components/loader";

// Material Dashboard 2 React main context
const TopnavContext = createContext();

// Setting custom name for the context which is visible on react dev tools
TopnavContext.displayName = "TopnavContext";

// Material Dashboard 2 React context provider
function TopnavProvider({ children }) {
  const Service = useAppServices();
  const [agency] = useAgencyInfo();
  const [topnav, setTopnav] = useState({
    categories: [],
    sub_categories: [],
    tags: [],
  });
  // const [planData, setPlanData] = useState({});
  const [loader, setLoader] = useState(true);
  const [selctedItems, setselctedItems] = useState([]);
  const [selctedItemsType, setselctedItemsType] = useState("home");
  const [selected_category, setselected_category] = useState({});

  const clear = () => {
    setTopnav({});
    localforage.removeItem("Topnav");
  };

  const value = useMemo(
    () => [
      topnav,
      selctedItems,
      setselctedItems,
      selctedItemsType,
      setselctedItemsType,
      selected_category,
      setselected_category,
    ],
    [
      topnav,
      selctedItems,
      setselctedItems,
      selctedItemsType,
      setselctedItemsType,
      selected_category,
      setselected_category,
    ]
  );

  const getTopnav = async (localTopnav) => {
    const { response } =
      await Service.topnav_categories.get_with_sub_categories_and_tags({
        query: `agency_id=${agency?._id}`,
      });
    if (!response) return setLoader(false);
    setTopnav({ ...response.data });
    localforage.setItem("Topnav", { ...response.data });
    return setLoader(false);
  };
  // const getPlansFeatures = async () => {
  //   const { response } = await Service.saas.planfeatures({
  //     query: `plan_id=${Topnav.plan_id}`,
  //   });
  //   if (response) {
  //     setPlanData(response.data);
  //   }
  // };
  const updateTopnav = async () => {
    const localTopnav = await localforage.getItem("Topnav");
    // console.log(localTopnav,'localTopnav')
    // if(!localTopnav) return setLoader(false)
    // setTopnav({...localTopnav})
    // setLoader(false)
    return getTopnav(localTopnav);
  };

  const onLoad = () => {
    updateTopnav();
    // if (Topnav.plan_id) {
    //   getPlansFeatures();
    // }
  };

  useEffect(onLoad, []);

  return loader ? (
    <Loader />
  ) : (
    <TopnavContext.Provider value={value}>{children}</TopnavContext.Provider>
  );
}

// Material Dashboard 2 React custom hook for using context
function useTopnavInfo() {
  return useContext(TopnavContext) || [];
}

// Typechecking props for the MaterialUIControllerProvider
TopnavProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { TopnavProvider, useTopnavInfo };
