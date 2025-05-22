export const Host  = import.meta.env.VITE_SERVER_URL;

export const AUTH_ROUTES = "api/auth";
export const SIGNUP_ROUTE = `${AUTH_ROUTES}/signup`;
export const LOGIN_ROUTE = `${AUTH_ROUTES}/login`;  // Corrected constant name
export const GET_USER_INFO = `${AUTH_ROUTES}/user-info`
export const UPDATE_PROFILE_ROUTE = `${AUTH_ROUTES}/update-profile`
// 1st
export const ADD_PROFILE_IMAGE_ROUTE = `${AUTH_ROUTES}/add-profile-image`
export const LOGOUT_ROUTE = `${AUTH_ROUTES}/logOut`


export const CONTACTS_ROUTE = "api/contacts"
export const SEARCH_CONTACTS_ROUTES = `${CONTACTS_ROUTE}/search`
export const GET_DM_CONTACTS_ROUTE   = `${CONTACTS_ROUTE}/get-contacts-for-dm`

export const MESSAGES_ROUTES = "/api/messages"
export const GET_ALL_MESSAGES_ROUTE = `${MESSAGES_ROUTES}/get-messages`;
export const UPLOAD_FILE_ROUTE = `${MESSAGES_ROUTES}/upload-file`