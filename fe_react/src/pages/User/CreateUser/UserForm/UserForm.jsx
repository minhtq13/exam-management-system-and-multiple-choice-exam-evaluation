import { DatePicker, Form, Input, Select, Button } from "antd";
import "./UserForm.scss";
import React, {useEffect, useState} from "react";
import { getRole } from "../../../../utils/storage";
const UserForm = ({
	onFinish,
	initialValues,
	infoHeader,
	btnText,
	datePickerOnchange,
	genderOnchange,
	loading,
	isPasswordDisplay,
	isUserNameDisplay,
	formKey
}) => {
	const [role, setRole] = useState()
	useEffect(()=> {
	  setRole(getRole())
	}, [role])
	const genderOption = [
		{
			value: "MALE",
			label: "Nam",
		},
		{
			value: "FEMALE",
			label: "Nữ",
		},
	];
	const roleOptionTeacher = [
		{
			value: 1,
			label: "Sinh viên",
		},
	];
	const roleOption = [
		{
			value: 0,
			label: "Giảng viên",
		},
		{
			value: 1,
			label: "Sinh viên",
		},
	];
	const dateFormat = "DD/MM/YYYY";
	const messageRequired = "Trường này là bắt buộc!"
	const [roleSelect, setRoleSelect] = useState(-1)
	const handleOnChange = (value) => {
		setRoleSelect(value)
	}
	return (
		<div className="user-form-component">
			<p className="info-header">{infoHeader}</p>
			<Form
				name="info-user-form"
				className="info-user-form"
				initialValues={initialValues}
				onFinish={onFinish}
				key= {formKey}
			>
				<div className="info-user-header">Thông tin người dùng</div>
				<Form.Item
					name="firstName"
					label="Họ và tên đệm"
					colon={true}
					rules={[
						{
							required: true,
							message: messageRequired,
						},
					]}
				>
					<Input placeholder="Họ và tên đệm" />
				</Form.Item>
				<Form.Item
					name="lastName"
					label="Tên"
					colon={true}
					rules={[
						{
							required: true,
							message: messageRequired,
						},
					]}
				>
					<Input placeholder="Tên" />
				</Form.Item>
				<Form.Item
					name="userType"
					colon={true}
					label="Vai trò"
					rules={[
						{
							required: true,
							message: messageRequired,
						},
					]}
				>
					<Select
						placeholder="Chọn vai trò"
						options={role === "ROLE_TEACHER" ? roleOptionTeacher : roleOption}
						style={{ height: 45 }}
						onChange={handleOnChange}
					></Select>
				</Form.Item>
				{roleSelect === 1 && (
						<Form.Item
							name="metaData"
							label="Khoá"
							colon={true}
							rules={[{required: true, message: messageRequired}]}
						>
							<Input placeholder="Nhập tên người dùng" />
						</Form.Item> )}
				<Form.Item
					name="code"
					label="Mã số SV/GV"
					colon={true}
					rules={[
						{
							required: true,
							message: messageRequired,
						},
					]}
				>
					<Input placeholder="Nhập mã số SV/GV" />
				</Form.Item>
				{isUserNameDisplay && (
					<Form.Item
						name="username"
						label="Tên người dùng"
						colon={true}
						rules={[
							{
								required: true,
								message: messageRequired,
							},
							{
								min: 6,
								message: "Tên người dùng phải có ít nhất 6 ký tự"
							}
						]}
					>
						<Input placeholder="Nhập tên người dùng" />
					</Form.Item>
				)}
				<Form.Item
					name="genderType"
					colon={true}
					label="Giới tính"
					rules={[
						{
							required: true,
							message: messageRequired,
						},
					]}
				>
					<Select
						placeholder="Chọn giới tính"
						options={genderOption}
						onChange={genderOnchange}
						style={{ height: 45 }}
					></Select>
				</Form.Item>
				<Form.Item
					name="email"
					rules={[
						{
							type: "email",
							message:
								"Vui lòng điền đúng định dạng email. Ví dụ: abc@gmail.com",
						},
						{
							required: true,
							message: messageRequired,
						},
					]}
					label="Email"
					colon={true}
				>
					<Input placeholder="Nhập địa chỉ email" />
				</Form.Item>
				<Form.Item
					name="birthDate"
					label="Ngày sinh"
					colon={true}
					rules={[
						{
							required: true,
							message: messageRequired,
						},
					]}
				>
					<DatePicker
						onChange={datePickerOnchange}
						format={dateFormat}
						placeholder="Chọn ngày sinh"
					></DatePicker>
				</Form.Item>
				<Form.Item
          name="identificationNumber"
          label="Số CCCD"
          colon={true}
          className="test"
        >
          <Input placeholder="Nhập CCCD" />
        </Form.Item>
				{isPasswordDisplay && (
					<Form.Item
						name="password"
						rules={[
							{
								required: true,
								message: messageRequired,
							},
						]}
						label="Mật khẩu"
						colon={true}
					>
						<Input.Password placeholder="Nhập mật khẩu" />
					</Form.Item>
				)}
				<Form.Item
					name="phoneNumber"
					label="Số điện thoại"
					colon={true}
					rules={[
						{
							pattern: /^(0|\+84)[1-9]\d{8}$/,
							message:
								"Vui lòng nhập đúng định dạng. Ví dụ: 0369841000",
						},
						{
							required: true,
							message: messageRequired,
						},
					]}
				>
					<Input placeholder="Nhập số điện thoại" />
				</Form.Item>
				<Form.Item className="btn-info">
					<Button
						type="primary"
						htmlType="submit"
						loading={loading}
						style={{ width: 150, height: 50 }}
					>
						{btnText}
					</Button>
				</Form.Item>
			</Form>
		</div>
	);
};
export default UserForm;
