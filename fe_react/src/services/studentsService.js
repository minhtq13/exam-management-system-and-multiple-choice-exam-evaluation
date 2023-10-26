import { getRequest, postRequest, putRequest, deleteRequest } from "../api/apiCaller";
import { apiPath } from "../config/apiPath";
export const getAllStudentsService = async (params, successCallback, errorCallback) => {
  await getRequest(`${apiPath.allStudents}`, params, successCallback, errorCallback);
};
export const updateStudentsService = async (studentId, params, successCallback, errorCallback) => {
  await putRequest(`${apiPath.updateStudent}/${studentId}`, params, successCallback, errorCallback);
};
export const addStudentsService = async (params, successCallback, errorCallback) => {
  await postRequest(`${apiPath.addStudent}`, params, successCallback, errorCallback);
};
export const deleteStudentsService = async (studentId, params, successCallback, errorCallback) => {
  await deleteRequest(
    `${apiPath.deleteStudent}/${studentId}`,
    params,
    successCallback,
    errorCallback
  );
};
