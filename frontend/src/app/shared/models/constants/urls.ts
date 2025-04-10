const BASE_URL = 'http://localhost:3000';


export const FOODS_URL = `${BASE_URL}/api/foods`;
export const FOODS_TAGS_URL = `${FOODS_URL}/tags`;
export const FOODS_TAG_URL = `${FOODS_URL}/tag/`;
export const FOODS_SEARCH_URL = `${FOODS_URL}/search/`;
export const FOODS_ID_URL = `${FOODS_URL}/`;

export const USER_URL = `${BASE_URL}/api/users`;
export const USER_LOGIN_URL = `${USER_URL}/login`;
export const USER_REGISTER_URL = `${USER_URL}/register`;

export const ORDER_URL = `${BASE_URL}/api/orders`;
export const ORDER_CREATE_URL = `${ORDER_URL}/create`;
export const ORDER_NEW_FOR_CURRENT_URL = `${ORDER_URL}/newOrderForCurrentUser`;
export const ORDER_PAY_URL = `${ORDER_URL}/pay`;
export const ORDER_TRACK_URL = `${ORDER_URL}/track/`;