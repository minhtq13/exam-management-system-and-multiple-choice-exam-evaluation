import {
	deleteRequest,
	getRequest,
	postRequest,
	putRequest,
} from "../api/apiCaller";
import { apiPath } from "../config/apiPath";
export const getInfoUserService = async (
	userId,
	params,
	successCallback,
	errorCallback
) => {
	await getRequest(
		`${apiPath.infoUser}/${userId}`,
		params,
		successCallback,
		errorCallback
	);
};
export const getUserByToken = async (
	params,
	successCallback,
	errorCallback
) => {
	await getRequest(apiPath.getUser, params, successCallback, errorCallback);
};

export const createUser = async (params, successCallback, errorCallback) => {
	await postRequest(
		apiPath.createUser,
		params,
		successCallback,
		errorCallback
	);
};

export const updateUser = async (
	userId,
	params,
	successCallback,
	errorCallback
) => {
	await putRequest(
		`${apiPath.updateUser}/${userId}`,
		params,
		successCallback,
		errorCallback,
		5000
	);
};

export const getDetailInfo = async (
	userId,
	params,
	successCallback,
	errorCallback
) => {
	await getRequest(
		`${apiPath.updateUser}/${userId}`,
		params,
		successCallback,
		errorCallback
	);
};

export const deleteUserService = async (
	userId,
	userType,
	successCallback,
	errorCallback
) => {
	const params = { userType };
	const queryString = Object.entries(params)
		.map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
		.join("&");

	const apiUrl = `${apiPath.deleteUser}/${userId}?${queryString}`;

	await deleteRequest(apiUrl, null, successCallback, errorCallback);
};
