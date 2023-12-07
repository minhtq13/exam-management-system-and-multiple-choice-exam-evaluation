import { getRequest } from "../api/apiCaller";
import { apiPath } from "../config/apiPath";

// Chấm điểm từ AI
export const getModelAIService = async (examClassCode, params, successCallback, errorCallback) => {
  await getRequest(`${apiPath.automaticScoring}/exam-class/${examClassCode}`, params, successCallback, errorCallback);
};
