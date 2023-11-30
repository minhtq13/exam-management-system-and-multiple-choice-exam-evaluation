import moment from 'moment';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import useAccount from '../../hooks/useAccount';
import useNotify from '../../hooks/useNotify';
import { updateUser } from '../../services/userService';
import { formatDateParam } from '../../utils/tools';
import UpdateUserInfoForm from './UpdateUserInfoForm';

const ProfileUser = () => {
	
	const { userId } = useSelector((state) => state.userReducer);
	const notify = useNotify();
	const {getUserInfoAPI, userInfo} = useAccount();
	useEffect(() => {
		if (userId) {
			getUserInfoAPI(userId, {});
		}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);
	const onFinish = (value) => {
		if (userId) {
			updateUser(userId,
				{...value, birthDate: formatDateParam(value.birthDate), lstRoleId: [value.role === 0 ? 3 : 2] , departmentId: -1},
				(res) => {
					notify.success("Cập nhật người dùng thành công!");
					getUserInfoAPI(userId, {});
				},
				(error) => {
					notify.error("Lỗi Cập nhật người dùng!");
				}
			);
		}
	};

	const datePickerOnchange = (date, dateString) => {
		console.log(date, dateString);
	};
	const genderOnchange = (value) => {
		console.log(value);
	}
	return (
		<div className="profile-user">
			<UpdateUserInfoForm
				infoHeader="Thông tin người dùng"
				onFinish={onFinish}
				datePickerOnchange={datePickerOnchange}
				genderOnchange={genderOnchange}
				btnText="Cập nhật"
				initialValues={{
					firstName: userInfo.firstName,
					lastName: userInfo.lastName,
					email: userInfo.email,
					birthDate: moment(userInfo.birthDate, 'DD/MM/YYYY'),
					// userName: profileUser.userName,
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
}

export default ProfileUser