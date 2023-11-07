import { getRequest, postRequest } from "../api/apiCaller";
import { apiPath } from "../config/apiPath";
export const loginAuthenticService = async (parameters, successCallback, errorCallback) => {
  await postRequest(`${apiPath.login}`, parameters, successCallback, errorCallback);
};

export const getProfileUserService = async (parameters, successCallback, errorCallback) => {
  await getRequest(`${apiPath.profile}`, parameters, successCallback, errorCallback);
};

// Refresh token
export const refreshTokenRequest = async (params, successCallback, errorCallback) => {
  await postRequest(apiPath.refreshToken, params, successCallback, errorCallback);
};
