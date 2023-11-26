import { getRequest, postRequest, putRequest } from "../api/apiCaller";
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

export const updateUser = async (userId, params, successCallback, errorCallback) => {
  await putRequest(`${apiPath.updateUser}/${userId}`, params, successCallback, errorCallback);
};

export const getDetailInfo = async (userId, params, successCallback, errorCallback) => {
  await getRequest(`${apiPath.updateUser}/${userId}`, params, successCallback, errorCallback);
};
