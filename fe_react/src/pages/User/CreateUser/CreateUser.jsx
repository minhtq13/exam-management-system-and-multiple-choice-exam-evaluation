import React, { useState } from "react";
import UserInfo from "../../../components/UserInfo/UserInfo";
import useNotify from "../../../hooks/useNotify";
import { createUser } from "../../../services/userService";
import { formatDate } from "../../../utils/tools";
import "./CreateUser.scss";
const CreateUser = () => {
	const [loading, setLoading] = useState(false);
	const notify = useNotify();
	const onFinish = (value) => {
		setLoading(true);
		createUser(
			{ ...value, birthday: formatDate(value.birthday) },
			(res) => {
				setLoading(false);
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
		<div className="student-add">
			<UserInfo
				infoHeader="Thêm người dùng"
				onFinish={onFinish}
				datePickerOnchange={datePickerOnchange}
				genderOnchange={genderOnchange}
				btnText="Thêm"
				initialValues={{ remember: false }}
				loading={loading}
				isPasswordDisplay={true}
				isUserNameDisplay={true}
			/>
		</div>
	);
};
export default CreateUser;


