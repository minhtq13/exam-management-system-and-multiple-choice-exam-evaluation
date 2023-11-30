import { DatePicker, Form, Input, Select, Button } from "antd";
import "./UpdateExamClassInfoForm.scss";
import React, { useEffect } from "react";
import useCombo from "../../../../hooks/useCombo";
const UpdateExamClassInfoForm = ({
	onFinish,
	initialValues,
	infoHeader,
	btnText,
	loading,
}) => {
	const {
		allSemester,
		semesterLoading,
		getAllSemesters,
		subLoading,
		allSubjects,
		getAllSubjects,
	} = useCombo();
	const errorMessange = "Chưa điền đầy đủ thông tin";
	useEffect(() => {
		getAllSemesters({ search: "" });
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	useEffect(() => {
		getAllSubjects({ subjectCode: null, subjectTitle: null });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	const options =
		allSemester && allSemester.length > 0
			? allSemester.map((item) => {
					return { value: item.id, label: item.name };
			  })
			: [];
	const subjectOptions =
		allSubjects && allSubjects.length > 0
			? allSubjects.map((item) => {
					return { value: item.id, label: item.name };
			  })
			: [];
	return (
		<div className="exam-class-info">
			<p className="info-header">{infoHeader}</p>
			<Form
				name="info-exam-class-form"
				className="info-exam-class-form"
				initialValues={initialValues}
				onFinish={onFinish}
			>
				<div className="info-exam-class-header">Thông tin lớp thi</div>
				<Form.Item
					name="code"
					label="Mã lớp thi"
					colon={true}
					rules={[
						{
							required: true,
							message: errorMessange,
						},
					]}
				>
					<Input placeholder="Nhập mã lớp thi" />
				</Form.Item>
				<Form.Item
					name="roomName"
					label="Phòng thi"
					colon={true}
					rules={[
						{
							required: true,
							message: errorMessange,
						},
					]}
				>
					<Input placeholder="Vui lòng nhập phòng thi" />
				</Form.Item>
				<Form.Item
					name="semesterId"
					label="Kỳ thi"
					rules={[{ required: true, message: "Chưa chọn kỳ thi" }]}
				>
					<Select
						loading={semesterLoading}
						placeholder="Chọn kỳ thi"
						options={options}
						style={{ height: 45 }}
					/>
				</Form.Item>
				<Form.Item
					name="subjectId"
					colon={true}
					label="Môn thi"
					rules={[
						{
							required: true,
							message: "Chưa chọn môn thi",
						},
					]}
				>
					<Select
						placeholder="Chọn môn thi"
						loading={subLoading}
						options={subjectOptions}
						style={{ height: 45 }}
					></Select>
				</Form.Item>
				<Form.Item
					name="examineTime"
					colon={true}
					label="Thời gian thi"
					rules={[
						{
							required: true,
							message: "Chưa chọn thời gian thi",
						},
					]}
				>
					<DatePicker
						format={"YYYY-MM-DD HH:mm"}
						showTime={{ format: "HH:mm" }}
					></DatePicker>
				</Form.Item>
				<Form.Item className="btn-info">
					<Button
						type="primary"
						htmlType="submit"
						block
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
export default UpdateExamClassInfoForm;
