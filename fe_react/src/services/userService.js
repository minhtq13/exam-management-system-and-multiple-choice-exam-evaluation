import { getRequest, postRequest } from "../api/apiCaller";
import { apiPath } from "../config/apiPath";
export const getInfoUser = async (params, successCallback, errorCallback) => {
  await getRequest(`${apiPath.getInfoUser}`, params, successCallback, errorCallback);
};
export const getUserByToken = async (params, successCallback, errorCallback) => {
  await getRequest(apiPath.getUser, params, successCallback, errorCallback);
};

export const createUser = async (params, successCallback, errorCallback) => {
  await postRequest(apiPath.createUser, params, successCallback, errorCallback);
};
