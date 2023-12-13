import { getRequest, postRequest } from "../api/apiCaller";
import { apiPath } from "../config/apiPath";

// Chấm điểm từ AI
export const getModelAIService = async (examClassCode, params, successCallback, errorCallback) => {
  await getRequest(`${apiPath.automaticScoring}/exam-class/${examClassCode}`, params, successCallback, errorCallback);
};
export const resetTableResultService = async (tempFileCode, params, successCallback, errorCallback) => {
  await postRequest(`${apiPath.resetTableResult}/save?tempFileCode=${tempFileCode}&option=DELETE`, params, successCallback, errorCallback);
};
export const saveTableResultService = async (tempFileCode, params, successCallback, errorCallback) => {
  await postRequest(`${apiPath.saveTableResult}/save?tempFileCode=${tempFileCode}&option=SAVE`, params, successCallback, errorCallback);
};
