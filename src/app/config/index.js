import { Environment } from "../enums";

const env = {
  API_URL: "https://betaapi.smartdirectory.ai/api",
  GOOGLE_MAP_API_KEY: "AIzaSyDvZeBveYG3wSJr1bmdE5kJ-0C92WG2GC4",
  GOOGLE_Review_API_KEY: "AIzaSyAukY1xJPBomn3nY-dDj_EE1UuYxHixsaY&libraries",
  SUPER_ADMIN: "6298acc76bcf0340b4ec6b6b",
  SERVER_IP: "127.0.0.1",
  ACCOUNT_LEVEL_URL: "http://localhost:3004",
  GDriveURL: "http://localhost:4000",
  GHL: {
    CLIENT_ID: "66224f9fde24a6c1353de932-lv6kzvdz",
    CLIENT_SECRET: "d7781597-a375-416f-973a-22589ee2bb6e",
    SCOPE:
      "companies.readonly users.readonly locations.readonly saas/company.write saas/location.read saas/location.write saas/company.read oauth.readonly oauth.write locations.write workflows.readonly locations/customFields.readonly contacts.readonly campaigns.readonly conversations.readonly conversations.write conversations/message.readonly conversations/message.write conversations/reports.readonly contacts.write objects/schema.readonly objects/schema.write objects/record.readonly objects/record.write courses.write courses.readonly forms.readonly forms.write invoices.readonly invoices.write invoices/schedule.readonly invoices/schedule.write invoices/template.write invoices/template.readonly links.readonly lc-email.readonly links.write locations/customValues.write locations/customFields.write locations/tags.readonly locations/tasks.readonly locations/tasks.write locations/tags.write locations/templates.readonly medias.readonly medias.write funnels/redirect.readonly funnels/page.readonly funnels/funnel.readonly funnels/pagecount.readonly funnels/redirect.write opportunities.readonly opportunities.write payments/orders.readonly payments/orders.write payments/integration.readonly payments/custom-provider.readonly payments/subscriptions.readonly payments/transactions.readonly payments/integration.write payments/custom-provider.write products.readonly products.write products/collection.readonly products/collection.write products/prices.write products/prices.readonly snapshots.readonly snapshots.write socialplanner/oauth.readonly socialplanner/oauth.write socialplanner/post.readonly socialplanner/post.write socialplanner/account.readonly socialplanner/account.write socialplanner/csv.readonly socialplanner/csv.write socialplanner/category.readonly socialplanner/tag.readonly store/shipping.readonly store/shipping.write store/setting.readonly store/setting.write surveys.readonly users.write businesses.readonly businesses.write calendars.readonly calendars.write calendars/events.readonly calendars/events.write calendars/groups.readonly calendars/groups.write calendars/resources.readonly calendars/resources.write",
    LOCATION_CLIENT_ID: "66d1dbfb8790ae0b77906385-m0kukn6s",
    LOCATION_CLIENT_SECRET: "027975fd-aacf-4c7c-be2e-d8f06e5b876e",
    LOCATION_SCOPE:
      "workflows.readonly locations/customFields.readonly contacts.readonly",
    ACCOUNT_CLIENT_ID: "66d5bc237e876b37a495fc11-m0nwrtek",
    ACCOUNT_CLIENT_SECRET: "04144df7-fa42-4f30-8438-58b524fa09f4",
    ACCOUNT_SCOPE:
      "businesses.readonly businesses.write calendars.write calendars.readonly calendars/groups.readonly calendars/groups.write calendars/resources.readonly calendars/resources.write calendars/events.readonly calendars/events.write campaigns.readonly contacts.readonly contacts.write conversations.readonly conversations.write conversations/message.readonly conversations/message.write forms.readonly invoices.readonly invoices.write invoices/schedule.readonly invoices/schedule.write invoices/template.readonly invoices/template.write links.readonly links.write locations.readonly locations.write locations/customValues.readonly locations/customValues.write locations/customFields.readonly locations/customFields.write locations/tags.readonly locations/tags.write locations/templates.readonly locations/tasks.readonly medias.readonly medias.write funnels/redirect.readonly funnels/redirect.write funnels/page.readonly funnels/funnel.readonly funnels/pagecount.readonly opportunities.readonly opportunities.write payments/integration.readonly payments/integration.write payments/orders.readonly payments/orders.write payments/transactions.readonly payments/subscriptions.readonly products.readonly products.write products/prices.readonly products/prices.write oauth.readonly oauth.write saas/location.write saas/location.read saas/company.write snapshots.readonly socialplanner/account.readonly socialplanner/account.write socialplanner/csv.readonly socialplanner/csv.write socialplanner/category.readonly socialplanner/oauth.readonly socialplanner/oauth.write socialplanner/post.readonly socialplanner/post.write socialplanner/tag.readonly surveys.readonly users.readonly users.write workflows.readonly courses.write",
    REDIRECT: {
      AGENCY: "https://devagency.maybetech.com/integrations/auth/agency",
      LOCATION: "http://localhost:3004/integrations/auth/location",
      ACCOUNT: "http://localhost:3004/integrations/auth/account",
    },
  },
  STRIPE: {
    PUBLIC_KEY:
      "pk_test_51KqzMeJpY5RIkHqhQTEaWGbWOPKfH9HKwCkMyQtcLAEZh2CsNcSynu4KcsSyZkAMavpcx438MDQHs05uk81dHQ8W00A89oVzEk",
    CLIENT_ID: "ca_Mrj5xmu7CRAeF3mF55TV6vKvgSCJCUQJ",
  },
};

if (process.env.REACT_APP_ENV === Environment.DEVELOPMENT) {
  env.API_URL = "https://devapi.smartdirectory.ai/api";
  env.SERVER_IP = "138.68.178.152";
  env.ACCOUNT_LEVEL_URL = "https://app.directorystagingsite.com";
  env.GHL.REDIRECT.AGENCY =
    "https://link.maybedev.ovh/integrations/auth/agency";
  env.GHL.REDIRECT.LOCATION =
    "https://link.maybedev.ovh/integrations/auth/location";
  env.GHL.REDIRECT.ACCOUNT =
    "https://link.maybedev.ovh/integrations/auth/account";
  env.GDriveURL = "http://gdrive.trustbrand.ai";
}

if (process.env.REACT_APP_ENV === Environment.BETA) {
  env.API_URL = "https://betaapi.smartdirectory.ai/api";
  env.SERVER_IP = "178.128.166.141";
  env.ACCOUNT_LEVEL_URL = "https://app.directorystagingsite.com";
  env.ACCOUNT_LEVEL_URL = "https://app.maybebeta.ovh";
  env.GHL.REDIRECT.AGENCY =
    "https://link.maybebeta.ovh/integrations/auth/agency";
  env.GHL.REDIRECT.LOCATION =
    "https://link.maybebeta.ovh/integrations/auth/location";
  env.GHL.REDIRECT.ACCOUNT =
    "https://link.maybebeta.ovh/integrations/auth/account";
  env.GDriveURL = "http://gdrive.trustbrand.ai";
}

if (process.env.REACT_APP_ENV === Environment.STAGING) {
  env.API_URL = "https://api.directorystagingsite.com/api";
  env.SERVER_IP = "209.38.167.244";
  env.ACCOUNT_LEVEL_URL = "https://app.directorystagingsite.com";
  env.ACCOUNT_LEVEL_URL = "https://app.maybestaging.ovh";
  env.GHL.REDIRECT.AGENCY =
    "https://link.maybestaging.ovh/integrations/auth/agency";
  env.GHL.REDIRECT.LOCATION =
    "https://link.maybestaging.ovh/integrations/auth/location";
  env.GHL.REDIRECT.ACCOUNT =
    "https://link.maybestaging.ovh/integrations/auth/account";
  env.GDriveURL = "http://gdrive.trustbrand.ai";
}

if (process.env.REACT_APP_ENV === Environment.PRODUCTION) {
  env.API_URL = "https://api.directorystagingsite.com/api";
  env.SERVER_IP = "165.22.127.209";
  env.ACCOUNT_LEVEL_URL = "https://app.directorystagingsite.com";
  env.GHL.REDIRECT.AGENCY =
    "https://link.trustbrand.ai/integrations/auth/agency";
  env.GHL.REDIRECT.LOCATION =
    "https://link.trustbrand.ai/integrations/auth/location";
  env.GHL.REDIRECT.ACCOUNT =
    "https://link.trustbrand.ai/integrations/auth/account";
  env.GDriveURL = "http://gdrive.trustbrand.ai";
}

export default env;
