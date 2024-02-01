import moment from "moment";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import useAccount from "../../hooks/useAccount";
import useNotify from "../../hooks/useNotify";
import { updateUser } from "../../services/userService";
import { formatDateParam } from "../../utils/tools";
import UpdateUserInfoForm from "./UpdateUserInfoForm";
import { ROLE_ADMIN, ROLE_ID_ADMIN, ROLE_ID_TEACHER, ROLE_STUDENT, ROLE_TEACHER } from "../../utils/constant";
import { setRefreshUserInfo } from "../../redux/slices/refreshSlice";

const ProfileUser = () => {
	const { userId } = useSelector((state) => state.userReducer);
	const notify = useNotify();
	const { getUserInfoAPI, userInfo, profileUser } = useAccount();
	const dispatch = useDispatch()
	useEffect(() => {
		if (userId) {
			getUserInfoAPI(userId, {});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [userId]);
	const onFinish = (value) => {
		if (userId) {
			updateUser(
				userId,
				{
					...value,
					birthDate: formatDateParam(value.birthDate),
					lstRoleId: [value.role === ROLE_ADMIN ? ROLE_ID_ADMIN : value.role === ROLE_TEACHER ? ROLE_ID_TEACHER : ROLE_STUDENT],
					departmentId: -1,
				},
				(res) => {
					notify.success("Cập nhật người dùng thành công!");
					getUserInfoAPI(userId, {});
					dispatch(setRefreshUserInfo(Date.now()))
				},
				(error) => {
					notify.error("Lỗi Cập nhật người dùng!");
				}
			);
		}
	};
	return (
		<div className="profile-user">
			<UpdateUserInfoForm
				infoHeader="Thông tin người dùng"
				onFinish={onFinish}
				btnText="Cập nhật"
				initialValues={{
					firstName: userInfo.firstName,
					lastName: userInfo.lastName,
					email: userInfo.email,
					birthDate: moment(userInfo.birthDate, "DD/MM/YYYY"),
					userName: profileUser.userName,
					phoneNumber: userInfo.phoneNumber,
					code: userInfo.code,
					userType: userInfo.userType,
					genderType: userInfo.gender,
				}}
				isPasswordDisplay={true}
				isUserNameDisplay={true}
			/>
		</div>
	);
};

export default ProfileUser;
