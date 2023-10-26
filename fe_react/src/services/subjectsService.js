import { getRequest, postRequest, putRequest, deleteRequest } from "../api/apiCaller";
import { apiPath } from "../config/apiPath";
export const getAllSubjectsService = async (params, successCallback, errorCallback) => {
  await getRequest(`${apiPath.allSubjects}`, params, successCallback, errorCallback);
};
export const getSubjectByCodeService = async (code, params, successCallback, errorCallback) => {
  await getRequest(`${apiPath.getSubjectByCode}/${code}`, params, successCallback, errorCallback);
};
export const updateSubjectsService = async (subjectId, params, successCallback, errorCallback) => {
  await putRequest(
    `${apiPath.updateSubject}/${subjectId}/chapters`,
    params,
    successCallback,
    errorCallback
  );
};
export const addSubjectsService = async (params, successCallback, errorCallback) => {
  await postRequest(`${apiPath.addSubject}`, params, successCallback, errorCallback);
};
export const deleteSubjectsService = async (subjectId, params, successCallback, errorCallback) => {
  await deleteRequest(
    `${apiPath.deleteSubject}/${subjectId}`,
    params,
    successCallback,
    errorCallback
  );
};
export const deleteChaptersService = async (code, params, successCallback, errorCallback) => {
  await deleteRequest(`${apiPath.disableChapter}/${code}`, params, successCallback, errorCallback);
};
export const addChapterService = async (code, param, successCallback, errorCallback) => {
  await postRequest(
    `${apiPath.addChapters}/${code}/chapters/add`,
    param,
    successCallback,
    errorCallback
  );
};
export const getChaptersService = async (code, param, successCallback, errorCallback) => {
  await getRequest(
    `${apiPath.addChapters}/${code}/chapter/list`,
    param,
    successCallback,
    errorCallback
  );
};
