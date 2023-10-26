import {
	getRequest,
	postRequest,
	putRequest,
	deleteRequest,
} from "../api/apiCaller";
import { apiPath } from "../config/apiPath";
export const getAllClassesService = async (
	params,
	successCallback,
	errorCallback
) => {
	await getRequest(
		`${apiPath.allExamClasses}`,
		params,
		successCallback,
		errorCallback
	);
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
