import axios from "axios";
import { ReqMethods, ResponseStatus } from "../enums";
import env from "../config";
const BASE_URL = `${env.API_URL}/v1`;

function useServiceHandler() {
  return (fn) =>
    async (
      method,
      path,
      { query, payload, token, apiKey, toaster, message, error } = {}
    ) => {
      try {
        const res = await fn(method, path, { query, payload, token, apiKey });
        // toaster &&
        //   setNotification(dispatch, {
        //     open: true,
        //     message: message || res.data.message,
        //     title: 'Success',
        //     severity: 'success',
        //   })

        return { response: res.data };
      } catch (err) {
        // expire error : jwt expired
        if (
          err.response &&
          err.response.status === ResponseStatus.UNAUTHORIZED
        ) {
          // setNotification(dispatch, {
          //   open: true,
          //   message: error || 'session expired',
          //   title: 'Error',
          //   severity: 'error',
          // })
          // setTimeout(Logout, 4000)
          return { error: err.response?.data || err };
        }

        const customError = err.response?.data?.error
          ? `${err.response?.data?.message} \n${err.response?.data?.error}`
          : err.response?.data?.message;

        // toaster &&
        //   setNotification(dispatch, {
        //     open: true,
        //     message: error || customError || err.message,
        //     severity: 'error',
        //     title: 'Error',
        //   })
        return { error: err.response ? err.response.data : err };
      }
    };
}

function useCallService() {
  // const authToken = useAuth()
  const serviceHandler = useServiceHandler();

  const CallService = (
    method,
    path,
    { query, payload, token = true, apiKey = null }
  ) => {
    const pathname = query ? `${path}?${query}` : path;
    const config = {};

    // if (token) config.headers = { 'x-auth-token': `Bearer ${authToken || token}` }
    if (apiKey) config.headers = { apiKey };

    const details = {};

    if (payload) details.payload = payload;
    details.config = config;

    return axios[method](pathname, ...Object.values(details));
  };

  return serviceHandler(CallService);
}

function useAppServices() {
  const { GET, POST, PUT, DELETE } = ReqMethods;
  const CallService = useCallService();

  /**
    Option for service is the object that could has the following properties
    query, payload, token, apiKey
  */

  const APIs = {
    auth: {
      login: (options) => CallService(POST, `${BASE_URL}/auth/login`, options),
      consumer_login: (options) =>
        CallService(POST, `${BASE_URL}/auth/consumer_login`, options),
      consumer_register: (options) =>
        CallService(POST, `${BASE_URL}/auth/consumer_register`, options),
      CreateTeam: (options) =>
        CallService(POST, `${BASE_URL}/auth/team`, options),
      GetTeam: (options) => CallService(GET, `${BASE_URL}/auth/team`, options),
    },
    user: {
      get: (options) => CallService(GET, `${BASE_URL}/user`, options),
      filter: (options) => CallService(GET, `${BASE_URL}/user/filter`, options),
      GetTeam: (options) => CallService(GET, `${BASE_URL}/user/teams`, options),
    },
    subscriptions: {
      account: (options) =>
        CallService(POST, `${BASE_URL}/subscriptions/account`, options),
    },
    user_card_details: {
      get: (options) =>
        CallService(GET, `${BASE_URL}/user_card_details`, options),
      create: (options) =>
        CallService(POST, `${BASE_URL}/user_card_details`, options),
    },
    brand: {
      get: (options) => CallService(GET, `${BASE_URL}/brand`, options),
      update: (options) => CallService(PUT, `${BASE_URL}/brand`, options),
      superadmin: (options) =>
        CallService(PUT, `${BASE_URL}/brand/superadmin`, options),
      filter: (options) =>
        CallService(GET, `${BASE_URL}/brand/filter`, options),
    },
    agency: {
      get: (options) => CallService(GET, `${BASE_URL}/agency`, options),
      filter: (options) =>
        CallService(GET, `${BASE_URL}/agency/filter`, options),
      runWorkflow: (options) =>
        CallService(POST, `${BASE_URL}/agency/workflow`, options),
      update: (options) => CallService(PUT, `${BASE_URL}/agency`, options),
      getProducts: (options) =>
        CallService(PUT, `${BASE_URL}/agency/getproducts`, options),
    },
    accounts: {
      get: (options) => CallService(GET, `${BASE_URL}/accounts`, options),
      forgot_password: (options) =>
        CallService(POST, `${BASE_URL}/accounts/forgot_password`, options),
      applyForEvent: (options) =>
        CallService(POST, `${BASE_URL}/accounts/applyForEvent`, options),
      updateApplicationForEvent: (options) =>
        CallService(PUT, `${BASE_URL}/accounts/applyForEvent`, options),
      getApplyForEvent: (options) =>
        CallService(GET, `${BASE_URL}/accounts/applyForEvent`, options),
      deleteApplyForEvent: (options) =>
        CallService(DELETE, `${BASE_URL}/accounts/applyForEvent`, options),
      businessTags: (options) =>
        CallService(GET, `${BASE_URL}/accounts/businesstags`, options),
      GetData: (options) =>
        CallService(GET, `${BASE_URL}/accounts/getData`, options),
      newbusiness: (options) =>
        CallService(POST, `${BASE_URL}/accounts/new_business`, options),
      csvupload: (options) =>
        CallService(POST, `${BASE_URL}/accounts/csvupload`, options),
      update: (options) => CallService(PUT, `${BASE_URL}/accounts`, options),
      create: (options) => CallService(POST, `${BASE_URL}/accounts`, options),
      delete: (options) => CallService(DELETE, `${BASE_URL}/accounts`, options),
      filter: (options) =>
        CallService(GET, `${BASE_URL}/accounts/filter`, options),
      single_account: (options) =>
        CallService(GET, `${BASE_URL}/accounts/location`, options),
      getSingleBusiness: (options) =>
        CallService(GET, `${BASE_URL}/accounts/getSingleBusiness`, options),
      planData: (options) =>
        CallService(GET, `${BASE_URL}/accounts/plan-data`, options),
      search: (options) =>
        CallService(GET, `${BASE_URL}/accounts/search`, options),
      getbyid: (options) =>
        CallService(GET, `${BASE_URL}/accounts/getbyid`, options),
      SaveGoogleImages: (options) => CallService(PUT, `${BASE_URL}/accounts/SaveGoogleImages`, options),
    },
    business_tags: {
      get: (options) => CallService(GET, `${BASE_URL}/business_tags/GetTag`, options),
    },
    saas: {
      get: (options) => CallService(GET, `${BASE_URL}/saas`, options),
      filter: (options) => CallService(GET, `${BASE_URL}/saas/filter`, options),
      planfeatures: (options) =>
        CallService(GET, `${BASE_URL}/saas/planfeatures`, options),
      products: (options) =>
        CallService(GET, `${BASE_URL}/saas/products`, options),
    },
    topnav_categories: {
      Get: (options) =>
        CallService(GET, `${BASE_URL}/topnav_categories`, options),
      filter: (options) =>
        CallService(GET, `${BASE_URL}/topnav_categories/filter`, options),
      get_with_sub_categories_and_tags: (options) =>
        CallService(
          GET,
          `${BASE_URL}/topnav_categories/get_with_sub_categories_and_tags`,
          options
        ),
      Create: (options) =>
        CallService(POST, `${BASE_URL}/topnav_categories`, options),
      Delete: (options) =>
        CallService(DELETE, `${BASE_URL}/topnav_categories`, options),
      Update: (options) =>
        CallService(PUT, `${BASE_URL}/topnav_categories`, options),
    },
    jobs: {
      Get: (options) => CallService(GET, `${BASE_URL}/jobs`, options),
      GetSingleJob: (options) => CallService(GET, `${BASE_URL}/jobs/GetSingleJob`, options),
      Create: (options) => CallService(POST, `${BASE_URL}/jobs`, options),
      Delete: (options) => CallService(DELETE, `${BASE_URL}/jobs`, options),
      Update: (options) => CallService(PUT, `${BASE_URL}/jobs`, options),
    },
    events: {
      Get: (options) => CallService(GET, `${BASE_URL}/events`, options),
      GetSingleEvent: (options) => CallService(GET, `${BASE_URL}/events/GetSingleEvent`, options),
      Create: (options) => CallService(POST, `${BASE_URL}/events`, options),
      Delete: (options) => CallService(DELETE, `${BASE_URL}/events`, options),
      Update: (options) => CallService(PUT, `${BASE_URL}/events`, options),
    },
    blogs: {
      Get: (options) => CallService(GET, `${BASE_URL}/blogs`, options),
      GetSingleBlog: (options) => CallService(GET, `${BASE_URL}/blogs/GetSingleBlog`, options),
      Create: (options) => CallService(POST, `${BASE_URL}/blogs`, options),
      Delete: (options) => CallService(DELETE, `${BASE_URL}/blogs`, options),
      Update: (options) => CallService(PUT, `${BASE_URL}/blogs`, options),
    },
    newsFeed: {
      Get: (options) => CallService(GET, `${BASE_URL}/news_Feed`, options),
      GetSingleNews: (options) => CallService(GET, `${BASE_URL}/news_Feed/GetSingleNews`, options),
      Create: (options) => CallService(POST, `${BASE_URL}/news_Feed`, options),
      Delete: (options) =>
        CallService(DELETE, `${BASE_URL}/news_Feed`, options),
      Update: (options) => CallService(PUT, `${BASE_URL}/news_Feed`, options),
    },
    user_plans: {
      Get: (options) => CallService(GET, `${BASE_URL}/userplans`, options),
      AssignPlan: (options) => CallService(PUT, `${BASE_URL}/userplans/AssignPlan`, options),
    },
    FetchEventData: {
      Get: (options) => CallService(GET, `${BASE_URL}/fetch_event_data`, options),
    },
    utils: {
      upload_image: (options) =>
        CallService(POST, `${BASE_URL}/utils/upload/image`, options),
    },
    stripe: {
      // product: (options) => CallService(GET, `${BASE_URL}/services/stripe/products`, options),
      // getCustomer: (options) => CallService(GET, `${BASE_URL}/services/stripe/customers`, options),
      integrateAcocunt: (options) =>
        CallService(
          GET,
          `${BASE_URL}/snapshot/agency/stripe/integrate`,
          options
        ),
      // addSubscription: (options) =>
      //   CallService(POST, `${BASE_URL}/services/stripe/subscription/add`, options),
    },
    services: {
      ghl: {
        call_service: (options) =>
          CallService(POST, `${BASE_URL}/services/ghl/`, options),
      },
    },
    toneoptions: {
      create: (options) =>
        CallService(POST, `${BASE_URL}/toneoptions/create`, options),
      Get: (options) => CallService(GET, `${BASE_URL}/toneoptions`, options),
      update: (options) => CallService(PUT, `${BASE_URL}/toneoptions`, options),
      Delete: (options) =>
        CallService(DELETE, `${BASE_URL}/toneoptions`, options),
    },
    business_types: {
      get: (options) => CallService(GET, `${BASE_URL}/business_types`, options),
      update: (options) =>
        CallService(PUT, `${BASE_URL}/business_types`, options),
      create: (options) =>
        CallService(POST, `${BASE_URL}/business_types`, options),
      delete: (options) =>
        CallService(DELETE, `${BASE_URL}/business_types`, options),
      filter: (options) =>
        CallService(GET, `${BASE_URL}/business_types/filter`, options),
      get_all_types: (options) =>
        CallService(GET, `${BASE_URL}/business_types/get_all_types`, options),
    },
    reviews: {
      create: (options) => CallService(POST, `${BASE_URL}/reviews`, options),
      Get: (options) => CallService(GET, `${BASE_URL}/reviews`, options),
      GetFromGoogle: (options) =>
        CallService(GET, `${BASE_URL}/reviews/google`, options),
      GetGoogleImages: (options) =>
        CallService(GET, `${BASE_URL}/reviews/GetGoogleImages`, options),
      update: (options) => CallService(PUT, `${BASE_URL}/reviews`, options),
      Delete: (options) => CallService(DELETE, `${BASE_URL}/reviews`, options),
    },
    JobApplication: {
      create: (options) =>
        CallService(POST, `${BASE_URL}/job_Application`, options),
      Get: (options) =>
        CallService(GET, `${BASE_URL}/job_Application`, options),
      update: (options) =>
        CallService(PUT, `${BASE_URL}/job_Application`, options),
      Delete: (options) =>
        CallService(DELETE, `${BASE_URL}/job_Application`, options),
    },
    followBusiness: {
      create: (options) => CallService(POST, `${BASE_URL}/follow`, options),
      Get: (options) => CallService(GET, `${BASE_URL}/follow`, options),
      update: (options) => CallService(PUT, `${BASE_URL}/follow`, options),
      Delete: (options) => CallService(DELETE, `${BASE_URL}/follow`, options),
    },
    likeBusiness: {
      create: (options) =>
        CallService(POST, `${BASE_URL}/likeBusiness`, options),
      Get: (options) => CallService(GET, `${BASE_URL}/likeBusiness`, options),
      update: (options) =>
        CallService(PUT, `${BASE_URL}/likeBusiness`, options),
      Delete: (options) =>
        CallService(DELETE, `${BASE_URL}/likeBusiness`, options),
    },
    claim_business: {
      create: (options) =>
        CallService(POST, `${BASE_URL}/claim_business`, options),
      Get: (options) => CallService(GET, `${BASE_URL}/claim_business`, options),
      GetOwnedBusiness: (options) =>
        CallService(GET, `${BASE_URL}/claim_business/owned_business`, options),
      get_premium_owned_business: (options) =>
        CallService(
          GET,
          `${BASE_URL}/claim_business/premium_owned_business`,
          options
        ),
      update: (options) =>
        CallService(PUT, `${BASE_URL}/claim_business`, options),
      Delete: (options) =>
        CallService(DELETE, `${BASE_URL}/claim_business`, options),
    },
    login_claim_business: {
      create: (options) =>
        CallService(POST, `${BASE_URL}/login_claim_business`, options),
      Get: (options) =>
        CallService(GET, `${BASE_URL}/login_claim_business`, options),
      update: (options) =>
        CallService(PUT, `${BASE_URL}/login_claim_business`, options),
      Delete: (options) =>
        CallService(DELETE, `${BASE_URL}/login_claim_business`, options),
    },
  };

  return APIs;
}
const useUploadImage = () => {
  const AppService = useAppServices();
  return ({ toaster, file, desiredPath }) => {
    const form = new FormData();
    form.append("image", file, file.name);
    return AppService.utils.upload_image({
      toaster,
      payload: form,
      query: `desiredPath=${desiredPath}`,
    });
  };
};

async function GetuploadImage(image_name, access_token) {
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url:
      "https://services.leadconnectorhq.com/medias/files?type=file&query=" + image_name,
    headers: {
      Authorization: "Bearer " + access_token,
      Version: "2021-07-28",
    },
  };
  console.log(access_token, "access_token");
  const response_data = await axios
    .request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
      return {
        success: true,
        data: response.data.files[0].url,
      };
    })
    .catch((error) => {
      console.log(error);
      return {
        success: false,
        data: error,
      };
    });
  return response_data;
}
async function uploadImageToGhl(image, agency) {
  const apiUrl = `${BASE_URL}/accounts/upload-img-to-ghl`;
  const formData = new FormData();

  console.log(agency, "agency1111");

  formData.append("image", image);
  formData.append("agency_id", agency?._id);

  const response_data = await axios
    .post(apiUrl, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response) => {
      return {
        success: true,
        data: response.data,
      };
    })
    .catch((error) => {
      console.error("Error:", error);
      return {
        success: false,
        data: error,
      };
    });

  if (response_data.success) {
    const { imageName } = response_data.data;
    const imageUrl = await GetuploadImage(imageName, agency.ghl?.access_token);
    console.log(imageUrl, "GetuploadImage");

    return {
      success: true,
      data: imageUrl.data,
    };
  } else {
    return {
      success: false,
      data: {},
    };
  }
}

export { useAppServices, useCallService, useUploadImage, uploadImageToGhl };
