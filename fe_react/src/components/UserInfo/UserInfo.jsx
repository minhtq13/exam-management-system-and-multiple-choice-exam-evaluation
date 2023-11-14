import { DatePicker, Form, Input, Select, Button } from "antd";
import "./UserInfo.scss";
import React from "react";
const UserInfo = ({
	onFinish,
	initialValues,
	infoHeader,
	btnText,
	datePickerOnchange,
	genderOnchange,
	loading,
	isPasswordDisplay,
	isUserNameDisplay,
}) => {
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
	const errorMessange = "Chưa điền đầy đủ thông tin";
	return (
		<div className="user-info">
			<p className="info-header">{infoHeader}</p>
			<Form
				name="info-user-form"
				className="info-user-form"
				initialValues={initialValues}
				onFinish={onFinish}
			>
				<div className="info-user-header">Thông tin người dùng</div>
				<Form.Item
					name="firstName"
					label="First name"
					colon={true}
					rules={[
						// {
						// 	pattern: /^[\p{L}\s]*$/u,
						// 	message:
						// 		"Vui lòng điền đúng định dạng. Ví dụ: Nguyễn Văn A",
						// },
						{
							required: true,
							message: errorMessange,
						},
					]}
				>
					<Input placeholder="First name" />
				</Form.Item>
				<Form.Item
					name="lastName"
					label="Last name"
					colon={true}
					rules={[
						{
							required: true,
							message: errorMessange,
						},
					]}
				>
					<Input placeholder="Last name" />
				</Form.Item>
				<Form.Item
					name="userType"
					colon={true}
					label="Vai trò"
					rules={[
						{
							required: true,
							message: "Chưa chọn vai trò",
						},
					]}
				>
					<Select
						placeholder="Chọn vai trò"
						options={roleOption}
						// onChange={genderOnchange}
						style={{ height: 45 }}
					></Select>
				</Form.Item>
				<Form.Item
					name="code"
					label="Mã số SV/GV"
					colon={true}
					rules={[
						{
							required: true,
							message: errorMessange,
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
								message: errorMessange,
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
							message: "Chưa chọn giới tính",
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
							message: errorMessange,
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
							message: "Chưa chọn ngày sinh",
						},
					]}
				>
					<DatePicker
						onChange={datePickerOnchange}
						format={dateFormat}
					></DatePicker>
				</Form.Item>
				{isPasswordDisplay && (
					<Form.Item
						name="password"
						rules={[
							{
								required: true,
								message: errorMessange,
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
							message: errorMessange,
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
export default UserInfo;