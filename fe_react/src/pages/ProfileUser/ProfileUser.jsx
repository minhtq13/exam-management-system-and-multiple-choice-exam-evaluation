import React, { useState } from 'react'
import useNotify from '../../hooks/useNotify';
import { createUser } from '../../services/userService';
import { formatDateParam } from '../../utils/tools';
import UserForm from '../../components/UserForm/UserForm';

const ProfileUser = () => {
  const [loading, setLoading] = useState(false);
	const [formKey, setFormKey] = useState(0);
	const notify = useNotify();
	const onFinish = (value) => {
		setLoading(true)
		createUser(
			{ ...value, birthDate: formatDateParam(value.birthDate), lstRoleId: [value.role === 0 ? 3 : 2] , departmentId: -1},
			(res) => {
				setLoading(false);
				setFormKey(prev => setFormKey(prev + 1));
				notify.success("Thêm mới người dùng thành công!");
			},
			(error) => {
				setLoading(false);
				notify.error("Lỗi thêm mới người dùng!");
			}
		);
	};
	const datePickerOnchange = (date, dateString) => {
		console.log(date, dateString);
	};
	const genderOnchange = (value) => {
		console.log(value);
	};
	return (
		<div className="profile-user">
			<UserForm
				infoHeader="Thông tin người dùng"
				onFinish={onFinish}
				datePickerOnchange={datePickerOnchange}
				genderOnchange={genderOnchange}
				btnText="Thêm"
				initialValues={{ remember: false }}
				loading={loading}
				isPasswordDisplay={true}
				isUserNameDisplay={true}
				formKey={formKey}
			/>
		</div>
	);
}

export default ProfileUser