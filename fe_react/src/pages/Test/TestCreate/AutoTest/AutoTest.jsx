import { useState } from "react";
import { Form, Button, Input, DatePicker, TimePicker, Modal } from "antd";
import "./AutoTest.scss";
import dayjs from "dayjs";
import { testRandomService } from "../../../../services/testServices";
import { formatDate } from "../../../../utils/tools";
import { useNavigate } from "react-router-dom";
import useNotify from "../../../../hooks/useNotify";
import { appPath } from "../../../../config/appPath";

const AutoTest = ({ subjectCode, chapterOrders }) => {
	const [loading, setLoading] = useState(false);
	const [openModal, setOpenModal] = useState(false);
	const [testId, setTestId] = useState(null);
	const notify = useNotify();
	const navigate = useNavigate();
	const onFinish = (value) => {
		setLoading(true);
		testRandomService(
			{
				subjectCode: subjectCode,
				chapterOrders: chapterOrders,
				testDay: formatDate(value.testDay),
				testTime: dayjs(value.testTime, "HH:mm").format("HH:mm"),
				duration: Number(value.duration),
				questionQuantity: Number(value.questionQuantity),
				totalPoint: Number(value.totalPoint),
			},
			(res) => {
				setLoading(false);
				console.log(res.data);
				setOpenModal(true);
				setTestId(res.data);
			},
			(error) => {
				setLoading(false);
				notify.error("Lỗi tạo đề thi!");
			}
		);
	};
	return (
		<div className="test-create-view">
			<Form onFinish={onFinish} name="test-create">
				<Form.Item
					name="questionQuantity"
					label="Số câu hỏi:"
					rule={[
						{
							required: true,
							message: "Chưa điền số lượng câu hỏi",
						},
					]}
				>
					<Input type="number" placeholder="Nhập số lượng câu hỏi" />
				</Form.Item>
				<Form.Item
					name="totalPoint"
					label="Tổng điểm:"
					rule={[
						{
							required: true,
							message: "Chưa điền tổng điểm bài thi",
						},
					]}
				>
					<Input type="number" placeholder="Nhập tổng điểm bài thi" />
				</Form.Item>
				<Form.Item
					name="testDay"
					label="Ngày thi:"
					rule={[
						{
							required: true,
							message: "Chưa chọn ngày thi",
						},
					]}
				>
					<DatePicker format={"YYYY-MM-DD"}></DatePicker>
				</Form.Item>
				<Form.Item
					name="testTime"
					label="Giờ thi:"
					rule={[
						{
							required: true,
							message: "Chưa chọn giờ thi",
						},
					]}
				>
					<TimePicker format={"HH:mm"}></TimePicker>
				</Form.Item>
				<Form.Item
					name="duration"
					label="Thời gian thi(phút)"
					rule={[
						{
							required: true,
							message: "Chưa điền thời gian thi",
						},
					]}
				>
					<Input type="number" placeholder="Nhập thời gian thi" />
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
