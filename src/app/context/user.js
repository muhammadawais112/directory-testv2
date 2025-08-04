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
import { useAppServices } from "../hook/services";
import Loader from "../components/loader";
import toast from "react-hot-toast";
import { useAgencyInfo } from "./agency";

// Material Dashboard 2 React main context
const UserContext = createContext();

// Setting custom name for the context which is visible on react dev tools
UserContext.displayName = "UserContext";

// Material Dashboard 2 React context provider
function UserProvider({ children }) {
  const Service = useAppServices();
  const [user, setUser] = useState({});
  const [planData, setPlanData] = useState({});
  const [loader, setLoader] = useState(true);
  const [agency] = useAgencyInfo();
  const [freePlanAvailable, setFreePlanAvailable] = useState(true);

  const Update = (updates) => setUser({ ...user, ...updates });

  const clear = () => {
    setUser({});
    localforage.removeItem("user");
  };

  const value = useMemo(
    () => [user, Update, clear, planData],
    [user, Update, clear]
  );

  const getUser = async (localUser) => {
    if (!localUser?.id) {
      setLoader(false);
      return;
    }

    const { response } = await Service.accounts.single_account({
      query: `id=${localUser?.id}`,
    });
    if (!response) return setLoader(false);
    setUser({ ...response.data });
    localforage.setItem("user", { ...response.data });
    return setLoader(false);
  };
  const getPlansFeatures = async () => {
    const { response } = await Service.saas.planfeatures({
      query: `plan_id=${user.plan_id}`,
    });
    if (response) {
      setPlanData(response.data);
    }
  };
  const updateUser = async () => {
    const localUser = await localforage.getItem("user");
    // console.log(localUser,'localUser')
    // if(!localUser) return setLoader(false)
    // setUser({...localUser})
    // setLoader(false)

    if (!localUser?.id) {
      setFreePlanAvailable(false);
      setLoader(false); // No user, stop loading
      return;
    }

    return getUser(localUser);
  };

  const onLoad = () => {
    updateUser();
    if (user.plan_id) {
      getPlansFeatures();
    }
  };

  useEffect(() => {
    if (user.plan_id) {
      getPlansFeatures();
    }
  }, [user.plan_id]);

  useEffect(onLoad, []);

  const onLoadAndAutoSubscribe = async () => {
    const { response } = await Service.saas.products({
      query: `agency_id=${agency?._id}`,
    });

    if (response) {
      const sortedData = response.data.sort((a, b) =>
        a.is_free_saas ? -1 : 1
      );
      const freePlan = sortedData.find((plan) => plan?.is_free_saas);

      if (!freePlan) {
        setFreePlanAvailable(false);
      }

      if (!user?.plan_id && freePlan?._id) {
        await FreePlan(freePlan?._id);
      }
    } else {
      setFreePlanAvailable(false);
    }
  };

  const FreePlan = async (id) => {
    const payload = {
      plan_id: id,
      _id: user?.id,
    };
    try {
      const { response } = await Service.accounts.update({ payload });
      if (response) {
        await updateUser();
      } else {
        console.log(
          "Failed to update the password. Please check your previous password."
        );
      }
    } catch (err) {
      console.log("An error occurred while updating the password.");
      await updateUser();
    }
  };

  useEffect(() => {
    if (user?.id && agency?._id) {
      onLoadAndAutoSubscribe();
    }
  }, [user?.id, agency?._id]);

  if (loader) {
    return <Loader />;
  }

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

// Material Dashboard 2 React custom hook for using context
function useUserInfo() {
  return useContext(UserContext) || [];
}

// Typechecking props for the MaterialUIControllerProvider
UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { UserProvider, useUserInfo };
