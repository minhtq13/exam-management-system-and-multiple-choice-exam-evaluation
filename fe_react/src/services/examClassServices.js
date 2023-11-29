import {
	getRequest,
	postRequest,
	putRequest,
	deleteRequest,
} from "../api/apiCaller";
import { apiPath } from "../config/apiPath";
export const getPagingClassesService = async (
	code,
	subjectId,
	semesterId,
	page,
	size,
	sort,
	successCallback,
	errorCallback
) => {
	const params = {
    page,
    size,
    sort,
  };

  if (code) {
    params.code = code;
  }

  if (subjectId) {
    params.subjectId = subjectId;
  }

	if(semesterId) {
		params.semesterId = semesterId;
	}

  const queryString = Object.entries(params)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join("&");

  const apiUrl = `${apiPath.pageExamClasses}?${queryString}`;

  await getRequest(apiUrl, null, successCallback, errorCallback);
};
export const examClassDetails = async (
	classId,
	params,
	successCallback,
	errorCallback
) => {
	await putRequest(
		`${apiPath.examClassDetail}/${classId}`,
		params,
		successCallback,
		errorCallback
	);
};
export const addExamClassService = async (
	params,
	successCallback,
	errorCallback
) => {
	await postRequest(
		`${apiPath.examClassCreate}`,
		params,
		successCallback,
		errorCallback
	);
};
export const deleteExamClassService = async (
	classId,
	params,
	successCallback,
	errorCallback
) => {
	await deleteRequest(
		`${apiPath.disableExamClass}/${classId}`,
		params,
		successCallback,
		errorCallback
	);
};
export const getExamClassDetailService = async (
	classId,
	params,
	successCallback,
	errorCallback
) => {
	await getRequest(
		`${apiPath.examClassDetail}/${classId}`,
		params,
		successCallback,
		errorCallback
	);
};
export const updateExamClassService = async (
	classId,
	params,
	successCallback,
	errorCallback
) => {
	await putRequest(
		`${apiPath.updateExamClass}/${classId}`,
		params,
		successCallback,
		errorCallback
	);
};
