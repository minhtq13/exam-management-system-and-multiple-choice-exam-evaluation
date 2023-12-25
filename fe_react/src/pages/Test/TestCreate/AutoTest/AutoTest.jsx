import { useEffect, useState } from "react";
import { Form, Button, Input, DatePicker, Modal, Col, Row, Select } from "antd";
import "./AutoTest.scss";
import dayjs from "dayjs";
import { testRandomService } from "../../../../services/testServices";
import { useNavigate } from "react-router-dom";
import useNotify from "../../../../hooks/useNotify";
import { appPath } from "../../../../config/appPath";
import useCombo from "../../../../hooks/useCombo";

const AutoTest = ({ chapterIds, formKey, subjectId }) => {
	const [loading, setLoading] = useState(false);
	const [openModal, setOpenModal] = useState(false);
	const [testId, setTestId] = useState(null);
	const [totalQuestion, setTotalQuestion] = useState(0);
	const [easyNumber, setEasyNumber] = useState(0);
	const [mediumNumber, setMediumNumber] = useState(0);
	const [hardNumber, setHardNumber] = useState(0);
	const [disable, setDisable] = useState(true);
	const [form] = Form.useForm();
	const { allSemester, semesterLoading, getAllSemesters } = useCombo();
	const notify = useNotify();
	const minDate = new Date();
	const disabledDate = current => {
		return current && current < minDate;
	};
	const nextDay = new Date(minDate); 
	nextDay.setDate(minDate.getDate() + 1);
	const [selectedDate, setSelectedDate] = useState(nextDay);
  const handleDateChange = date => {
    setSelectedDate(date);
  };
	useEffect(() => {
		getAllSemesters({ search: "" });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	const options =
		allSemester && allSemester.length > 0
			? allSemester.map((item) => {
				return { value: item.id, label: item.name };
			})
			: [];
	const navigate = useNavigate();
	const onFinish = (value) => {
		if (subjectId !== null && chapterIds.length > 0) {
			setLoading(true);
			testRandomService(
				{
					subjectId: subjectId,
					chapterIds: chapterIds,
					name: value.name,
					startTime: dayjs(value.startTime).format(
						"DD/MM/YYYY HH:mm"
					),
					duration: Number(value.duration),
					questionQuantity: Number(value.questionQuantity),
					totalPoint: Number(value.totalPoint),
					semesterId: Number(value.semesterId),
					generateConfig: {
						numEasyQuestion: Number(
							value.generateConfig.numEasyQuestion
						),
						numMediumQuestion: Number(
							value.generateConfig.numMediumQuestion
						),
						numHardQuestion: Number(
							value.generateConfig.numHardQuestion
						),
						numTotalQuestion: Number(totalQuestion),
					},
				},
				(res) => {
					setLoading(false);
					setOpenModal(true);
					setTestId(res.data);
				},
				(error) => {
					setLoading(false);
					notify.error("Lỗi tạo đề thi!");
				}
			);
		}
	};
	const checkConfigTotal = (rule, value) => {
		const total =
			Number(easyNumber) + Number(mediumNumber) + Number(hardNumber);
		return total !== Number(totalQuestion)
			? Promise.reject(
				"Tổng số câu dễ, trung bình, khó phải bằng tổng số câu hỏi."
			)
			: Promise.resolve();
	};

	const questionNumOnchange = (e) => {
		setTotalQuestion(e.target.value);
		if (e.target.value.trim().length > 0) {
			setDisable(false);
		} else {
			setDisable(true);
		}
	};
	console.log(disable);
	return (
		<div className="test-create-view">
			<Form
				onFinish={onFinish}
				initialValues={{ totalPoint: "10" }}
				name="test-create"
				key={formKey}
				form={form}
			>
				<Form.Item
					name="name"
					label="Tên kỳ thi:"
					rules={[
						{
							required: true,
							message: "Chưa điền tên kỳ thi",
						},
					]}
				>
					<Input placeholder="Nhập tên kỳ thi" />
				</Form.Item>
				<Form.Item
					name="questionQuantity"
					label="Số câu hỏi:"
					rules={[
						{
							required: true,
							message: "Chưa điền số lượng câu hỏi",
						},
					]}
				>
					<Input
						type="number"
						placeholder="Nhập số lượng câu hỏi"
						onChange={questionNumOnchange}
					/>
				</Form.Item>
				<Form.Item
					name="totalPoint"
					label="Tổng điểm:"
					rules={[
						{
							required: true,
							message: "Chưa điền tổng điểm bài thi",
						},
					]}
				>
					<Input disabled type="number" placeholder="Nhập tổng điểm bài thi" />
				</Form.Item>
				<Form.Item
					name="startTime"
					label="Thời gian bắt đầu:"
					rules={[
						{
							required: true,
							message: "Chưa chọn ngày",
						},
					]}
				>
					<DatePicker
						format={"YYYY-MM-DD HH:mm"}
						showTime={{ format: "HH:mm" }}
						disabledDate={disabledDate}
						value={selectedDate}
						onChange={handleDateChange}
					></DatePicker>
				</Form.Item>
				<Form.Item
					name="duration"
					label="Thời gian thi (phút):"
					rules={[
						{
							required: true,
							message: "Chưa điền thời gian thi",
						},
					]}
				>
					<Input type="number" placeholder="Nhập thời gian thi" />
				</Form.Item>
				<Form.Item
					className="semester-test"
					name="semesterId"
					label="Học kỳ"
					rules={[
						{
							required: true,
							message: "Chưa chọn kỳ thi",
						},
					]}
				>
					<Select
						loading={semesterLoading}
						placeholder="Chọn kỳ thi"
						options={options}
						style={{ height: 45 }}
					/>
				</Form.Item>
				<Form.Item
					label="Phân loại"
					name="config"
					rules={[
						{
							validator: checkConfigTotal,
						},
						{
							required: true,
							message: "Chưa điền số câu",
						},
					]}
				>
					<Row gutter={5}>
						<Col span={15}>
							<Form.Item
								name={["generateConfig", "numEasyQuestion"]}
							>
								<Input
									placeholder="Dễ"
									type="number"
									disabled={disable}
									onChange={(e) =>
										setEasyNumber(e.target.value)
									}
								/>
							</Form.Item>
						</Col>
						<Col span={15}>
							<Form.Item
								name={["generateConfig", "numMediumQuestion"]}
							>
								<Input
									placeholder="Trung bình"
									type="number"
									onChange={(e) =>
										setMediumNumber(e.target.value)
									}
									disabled={disable}
								/>
							</Form.Item>
						</Col>
						<Col span={15}>
							<Form.Item
								name={["generateConfig", "numHardQuestion"]}
							>
								<Input
									placeholder="Khó"
									type="number"
									onChange={(e) =>
										setHardNumber(e.target.value)
									}
									disabled={disable}
								/>
							</Form.Item>
						</Col>
					</Row>
				</Form.Item>

				<Form.Item className="btn-create">
					<Button
						type="primary"
						htmlType="submit"
						block
						loading={loading}
						style={{ width: 150, height: 50 }}
					>
						Tạo đề
					</Button>
				</Form.Item>
			</Form>
			<Modal
				className="test-set-create-modal"
				open={openModal}
				title="Tạo đề thi thành công!"
				onOk={() => navigate(`${appPath.testSetCreate}/${testId}`)}
				onCancel={() => setOpenModal(false)}
			>
				<p>Bạn có muốn tạo tập đề thi không?</p>
			</Modal>
		</div>
	);
};
export default AutoTest;
