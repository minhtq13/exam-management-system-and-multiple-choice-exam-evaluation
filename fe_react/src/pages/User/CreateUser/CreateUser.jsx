import React, { useState } from "react";
import UserForm from "./UserForm/UserForm";
import useNotify from "../../../hooks/useNotify";
import { createUser } from "../../../services/userService";
import { capitalizeFirstLetter, formatDateParam } from "../../../utils/tools";
import "./CreateUser.scss";
const CreateUser = () => {
	const [loading, setLoading] = useState(false);
	const [formKey, setFormKey] = useState(0);
	const notify = useNotify();
	const onFinish = (value) => {
		setLoading(true);
		createUser(
			{
				...value,
				birthDate: formatDateParam(value.birthDate),
				lstRoleId: [value.userType === 0 ? 3 : 2],
				departmentId: -1,
				metaData: {
					courseNum: +value.metaData,
				}
			},
			(res) => {
				setLoading(false);
				setFormKey((prev) => setFormKey(prev + 1));
				notify.success("Thêm mới người dùng thành công!");
			},
			(error) => {
				setLoading(false);
				notify.error(capitalizeFirstLetter(error.response.data.message));
			}
		);
	};
	return (
		<div className="student-add">
			<UserForm
				infoHeader="Thêm người dùng"
				onFinish={onFinish}
				btnText="Thêm"
				initialValues={{ remember: false }}
				loading={loading}
				isPasswordDisplay={true}
				isUserNameDisplay={true}
				formKey={formKey}
			/>
		</div>
	);
};
export default CreateUser;
