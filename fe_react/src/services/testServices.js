import { deleteRequest, getRequest, postRequest } from "../api/apiCaller";
import { apiPath } from "../config/apiPath";
export const testRandomService = async (
	params,
	successCallback,
	errorCallback
) => {
	await postRequest(
		`${apiPath.testRandomCreate}`,
		params,
		successCallback,
		errorCallback
	);
};
export const testService = async (params, successCallback, errorCallback) => {
	await postRequest(
		`${apiPath.testCreate}`,
		params,
		successCallback,
		errorCallback
	);
};
export const testSetCreateService = async (
	params,
	successCallback,
	errorCallback
) => {
	await postRequest(
		`${apiPath.testSetCreate}`,
		params,
		successCallback,
		errorCallback
	);
};
export const testSetDetailService = async (
	params,
	successCallback,
	errorCallback
) => {
	await postRequest(
		`${apiPath.testSetDetail}`,
		params,
		successCallback,
		errorCallback
	);
};
export const getTestsService = async (
	subjectId,
	semesterId,
	page,
	size,
	successCallback,
	errorCallback
) => {
	const param = { page, size };
	if (subjectId) {
		param.subjectId = subjectId;
	}
	if (semesterId) {
		param.semesterId = semesterId;
	}
	const queryString = Object.entries(param)
		.map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
		.join("&");

	const apiUrl = `${apiPath.allTest}?${queryString}`;

	await getRequest(apiUrl, null, successCallback, errorCallback);
};
export const deleteTestService = async (
	testId,
	params,
	successCallback,
	errorCallback
) => {
	await deleteRequest(
		`${apiPath.deleteTest}/${testId}`,
		params,
		successCallback,
		errorCallback
	);
};
