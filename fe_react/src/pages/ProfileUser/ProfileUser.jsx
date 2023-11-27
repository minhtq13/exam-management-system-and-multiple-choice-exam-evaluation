import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import useNotify from '../../hooks/useNotify';
import { updateUser } from '../../services/userService';
import { formatDateParam } from '../../utils/tools';
import UserInfo from './component/UserInfo/UserInfo';
import useAccount from '../../hooks/useAccount';

const ProfileUser = () => {
  const [loading, setLoading] = useState(false);
	
	const { userId } = useSelector((state) => state.userReducer);
	const notify = useNotify();
	const {getUserInfoAPI, userInfo, profileUser} = useAccount();
	useEffect(() => {
		if (userId) {
			getUserInfoAPI(userId, {});
		}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);
	const onFinish = (value) => {
		console.log(value.birthDate);
		setLoading(true)
		if (userId) {
			updateUser(userId,
				{...value, birthDate: formatDateParam(value.birthDate), lstRoleId: [value.role === 0 ? 3 : 2] , departmentId: -1},
				(res) => {
					setLoading(false);
					notify.success("Cập nhật người dùng thành công!");
				},
				(error) => {
					setLoading(false);
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
	console.log(userInfo)

	return (
		<div className="profile-user">
			<UserInfo
				infoHeader="Thông tin người dùng"
				onFinish={onFinish}
				datePickerOnchange={datePickerOnchange}
				genderOnchange={genderOnchange}
				btnText="Cập nhật"
				initialValues={{
					firstName: userInfo.firstName,
					lastName: userInfo.lastName,
					email: userInfo.email,
					// birthDate: userInfo.birthDate,
					userName: profileUser.userName,
					phoneNumber: userInfo.phoneNumber,
					code: userInfo.code,	
					userType: userInfo.userType,
					genderType: profileUser.genderType,
				}}
				loading={loading}
				isPasswordDisplay={true}
				isUserNameDisplay={true}
			/>
		</div>
	);
}

export default ProfileUser