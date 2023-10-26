import { DatePicker, Form, Input, Select, Button } from "antd";
import "./TeacherInfo.scss";
import React from "react";
const TeacherInfo = ({
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
	const dateFormat = "YYYY-MM-DD";
	const errorMessange = "Chưa điền đầy đủ thông tin";
	return (
		<div className="teacher-info">
			<p className="info-header">{infoHeader}</p>
			<Form
				name="info-teacher-form"
				className="info-teacher-form"
				initialValues={initialValues}
				onFinish={onFinish}
			>
				<div className="info-teacher-header">Thông tin giảng viên</div>
				<Form.Item
					name="fullName"
					label="Họ tên"
					colon={true}
					rules={[
						{
							pattern: /^[\p{L}\s]*$/u,
							message:
								"Vui lòng điền đúng định dạng. Ví dụ: Nguyễn Văn A",
						},
						{
							required: true,
							message: errorMessange,
						},
					]}
				>
					<Input placeholder="Nhập họ tên" />
				</Form.Item>
				<Form.Item
					name="code"
					label="Mã cán bộ"
					colon={true}
					rules={[
						{
							required: true,
							message: errorMessange,
						},
					]}
				>
					<Input placeholder="Nhập mã cán bộ" />
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
						]}
					>
						<Input placeholder="Nhập tên người dùng" />
					</Form.Item>
				)}
				<Form.Item
					name="gender"
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
					name="birthday"
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
export default TeacherInfo;
