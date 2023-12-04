import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { appPath } from "../config/appPath";
import {
	getProfileUserService,
	loginAuthenticService,
} from "../services/accountServices";
import useNotify from "./useNotify";
import { logOut } from "../api/apiCaller";
import { setUserId } from "../redux/slices/userSlice";
import { useDispatch } from "react-redux";
import { getInfoUserService } from "../services/userService";

const useAccount = () => {
	const [authenticResult, setAuthenticResult] = useState("");
	const [userInfo, setUserInfo] = useState({});
	const [profileUser, setProfileUser] = useState({});
	const [loading, setLoading] = useState(false);
	const [infoLoading, setInfoLoading] = useState(true);
	const navigate = useNavigate();
	const notify = useNotify();
	const dispatch = useDispatch();
	const authenticAction = (payload = {}) => {
		setLoading(true);
		loginAuthenticService(
			payload,
			(res) => {
				setAuthenticResult(res.data.message);
				notify.success("Đăng nhập thành công!");
				navigate(appPath.default);
				setLoading(false);
			},
			(error) => {
				setAuthenticResult("error");
				setLoading(false);
			}
		);
	};
	const getProfileUser = (payload = {}) => {
		getProfileUserService(
			payload,
			(res) => {
				setProfileUser(res.data);
				dispatch(setUserId(res.data.id));
			},
			(error) => {
				logOut();
			}
		);
	};
	const getUserInfoAPI = (userId, payload = {}) => {
		setInfoLoading(true);
		getInfoUserService(
			userId,
			payload,
			(res) => {
				setUserInfo(res.data);
				setInfoLoading(false);
			},
			(error) => {
				setInfoLoading(false);
			}
		);
	};
	return {
		authenticResult,
		authenticAction,
		loading,
		setLoading,
		profileUser,
		getProfileUser,
		userInfo,
		getUserInfoAPI,
		infoLoading,
	};
};

export default useAccount;
