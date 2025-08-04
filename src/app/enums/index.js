import * as user from "./user";
import * as ghl from './ghl'

const Environment = {
  DEVELOPMENT: "development",
  STAGING: "staging",
  PRODUCTION: "production",
  BETA: "beta"
};

const ReqMethods = {
  GET: "get",
  POST: "post",
  PUT: "put",
  DELETE: "delete",
};

const ResponseStatus = {
  SUCCESS: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500,
};

const ConnectionTypes = {
  AGENCY: "agency",
  SUPERADMIN: "super-admin",
  LOCATION: "location",
};

const ApplePass = {
  body: "body",
  logo: "logo",
  cover: "cover",
  logoText: "logoText",
  headerFields: "headerFields",
  primaryFields: "primaryFields",
  secondaryFields: "secondaryFields",
  auxiliaryFields: "auxiliaryFields",
  backFields: "backFields",
  barcodes: "barcodes",
};

const STRIPE_KEY_TYPE = {
  SUPER_ADMIN: "super_admin",
  AGENCY: "agency",
};
const GHL_API_VERSIONS = {
  V1: "v1",
  V2: "v2",
};
export {
  Environment,
  ReqMethods,
  ResponseStatus,
  ConnectionTypes,
  ApplePass,
  STRIPE_KEY_TYPE,
  GHL_API_VERSIONS,
  user,
  ghl,
};