import axios from "axios";
import { getRequest, logOut, postRequest } from "../api/apiCaller";
import { apiPath } from "../config/apiPath";
import { saveInfoToLocalStorage } from "../utils/storage";
export const loginAuthenticService = async (parameters, successCallback, errorCallback) => {
  await postRequest(`${apiPath.login}`, parameters, successCallback, errorCallback);
};

export const getProfileUserService = async (parameters, successCallback, errorCallback) => {
  await getRequest(`${apiPath.profile}`, parameters, successCallback, errorCallback);
};

export const refreshTokenService = async (refreshToken) => {
  const headers = {
    'refreshToken': refreshToken,
  };
  const requestData = {
    //...
  };
  axios.post(apiPath.refreshToken, requestData, { headers })
    .then(response => {
      console.log(response.data);
      const { accessToken, refreshToken } = response.data;
      console.log("accessToken", accessToken);
      console.log("refreshToken", refreshToken);
      saveInfoToLocalStorage(accessToken, refreshToken);
    })
    .catch(error => {
      console.error('Error:', error);
      logOut();
    });
};
