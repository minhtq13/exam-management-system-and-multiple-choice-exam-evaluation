import { useState } from "react";
import { Form, Button, Input, DatePicker, Modal, Col, Row } from "antd";
import "./AutoTest.scss";
import dayjs from "dayjs";
import { testRandomService } from "../../../../services/testServices";
import { useNavigate } from "react-router-dom";
import useNotify from "../../../../hooks/useNotify";
import { appPath } from "../../../../config/appPath";

const AutoTest = ({ chapterIds, formKey, subjectId }) => {
	const [loading, setLoading] = useState(false);
	const [openModal, setOpenModal] = useState(false);
	const [testId, setTestId] = useState(null);
	const [totalQuestion, setTotalQuestion] = useState(0);
	const [easyNumber, setEasyNumber] = useState(0);
	const [mediumNumber, setMediumNumber] = useState(0);
	const [hardNumber, setHardNumber] = useState(0);
	const [form] = Form.useForm();
	const notify = useNotify();
	const navigate = useNavigate();
	const onFinish = (value) => {
		setLoading(true);
		testRandomService(
			{
				subjectId: subjectId,
				chapterIds: chapterIds,
				name: value.name,
				startTime: dayjs(value.startTime).format("DD/MM/YYYY HH:mm"),
				endTime: dayjs(value.endTime).format("DD/MM/YYYY HH:mm"),
				duration: Number(value.duration),
				questionQuantity: Number(value.questionQuantity),
				totalPoint: Number(value.totalPoint),
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
	};
	return (
		<div className="test-create-view">
			<Form
				onFinish={onFinish}
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
					<Input type="number" placeholder="Nhập tổng điểm bài thi" />
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
					></DatePicker>
				</Form.Item>
				<Form.Item
					name="endTime"
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
					></DatePicker>
				</Form.Item>
				<Form.Item
					name="duration"
					label="Thời gian thi(phút):"
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
					name="semesterId"
					label="Kỳ thi"
					rules={[
						{
							required: true,
							message: "Chưa điền kỳ thi",
						},
					]}
				>
					<Input type="number" placeholder="Nhập kỳ thi" />
				</Form.Item>
				<Form.Item
					label="Số câu"
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
