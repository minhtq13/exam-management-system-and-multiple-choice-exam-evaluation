import { postRequest, getRequest, deleteRequest, putRequest } from "../api/apiCaller";
import { apiPath } from "../config/apiPath";
export const addQuestionService = async (params, successCallback, errorCallback) => {
  await postRequest(`${apiPath.addQuestion}`, params, successCallback, errorCallback);
};
export const getQuestionByCodeService = async (code, params, successCallback, errorCallback) => {
  await getRequest(
    `${apiPath.getQuestionbyCode}?code=${code}`,
    params,
    successCallback,
    errorCallback
  );
};
export const deleteQuesionsService = async (questionId, params, successCallback, errorCallback) => {
  await deleteRequest(
    `${apiPath.deleteQuestion}/${questionId}`,
    params,
    successCallback,
    errorCallback
  );
};
export const updateQuesionsService = async (questionId, params, successCallback, errorCallback) => {
  await putRequest(
    `${apiPath.updateQuestion}/${questionId}`,
    params,
    successCallback,
    errorCallback
  );
};
