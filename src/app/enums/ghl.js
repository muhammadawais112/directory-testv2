const BASE_URL = 'https://rest.gohighlevel.com/v1'
const V2_BASE_URL = 'https://api.msgsndr.com'

const APIs = {
  oauth: `${V2_BASE_URL}/oauth/token`,
  v2: {
    location: (locationId) => `${V2_BASE_URL}/locations/${locationId}`,
    custom_fields: (locationId) => `${V2_BASE_URL}/locations/${locationId}/customFields`,
    workflows: (locationId) => `${V2_BASE_URL}/workflows/?locationId=${locationId}`,
  },
  v1: {
    location: `${BASE_URL}/locations`,
    custom_fields: `${BASE_URL}/custom-fields/`,
    workflows: `${BASE_URL}/workflows/`,
  },
}

export { APIs }
