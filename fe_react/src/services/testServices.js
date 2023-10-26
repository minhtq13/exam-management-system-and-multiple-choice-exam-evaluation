import { postRequest, getRequest, deleteRequest } from "../api/apiCaller";
import { apiPath } from "../config/apiPath";
export const testRandomService = async (params, successCallback, errorCallback) => {
  await postRequest(`${apiPath.testRandomCreate}`, params, successCallback, errorCallback);
};
export const testService = async (params, successCallback, errorCallback) => {
  await postRequest(`${apiPath.testCreate}`, params, successCallback, errorCallback);
};
export const testSetCreateService = async (
  [testId, testSetQuantity],
  params,
  successCallback,
  errorCallback
) => {
  await postRequest(
    `${apiPath.testSetCreate}/${testId}/create?testSetQuantity=${testSetQuantity}`,
    params,
    successCallback,
    errorCallback
  );
};
export const testSetDetailService = async (
  [testId, testSetQuantity],
  params,
  successCallback,
  errorCallback
) => {
  await getRequest(
    `${apiPath.testSetDetail}/${testId}/${testSetQuantity}`,
    params,
    successCallback,
    errorCallback
  );
};
export const getTestsService = async (params, successCallback, errorCallback) => {
  await getRequest(`${apiPath.allTest}`, params, successCallback, errorCallback);
};
export const deleteTestService = async (testId, params, successCallback, errorCallback) => {
  await deleteRequest(`${apiPath.deleteTest}/${testId}`, params, successCallback, errorCallback);
};
