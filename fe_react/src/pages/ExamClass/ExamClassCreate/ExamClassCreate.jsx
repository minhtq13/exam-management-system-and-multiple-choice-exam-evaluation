import dayjs from "dayjs";
import React, { useState } from "react";
import useNotify from "../../../hooks/useNotify";
import { addExamClassService } from "../../../services/examClassServices";
import UpdateExamClassInfoForm from "../component/UpdateExamClassInfoForm/UpdateExamClassInfoForm";
import "./ExamClassCreate.scss";
const ExamClassAdd = () => {
	const [loading, setLoading] = useState(false);
	const notify = useNotify();
	const onFinish = (value) => {
		setLoading(true);
		console.log(value);
		addExamClassService(
			{
				...value,
				examineTime: dayjs(value.examineTime).format(
					"HH:mm DD/MM/YYYY"
				),
			},
			(res) => {
				setLoading(false);
				notify.success("Thêm mới lớp thi thành công!");
			},
			(error) => {
				setLoading(false);
				notify.error("Lỗi thêm mới lớp thi!");
			}
		);
	};
	return (
		<div className="exam-class-add">
			<UpdateExamClassInfoForm
				infoHeader="Thêm lớp thi"
				onFinish={onFinish}
				btnText="Thêm"
				initialValues={{ remember: false }}
				loading={loading}
			/>
		</div>
	);
};
export default ExamClassAdd;
