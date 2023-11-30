import "./ExamClassEdit.scss";
import React, { useEffect, useState } from "react";
import useNotify from "../../../hooks/useNotify";
import dayjs from "dayjs";
import { updateExamClassService } from "../../../services/examClassServices";
import { useLocation } from "react-router-dom";
import useExamClasses from "../../../hooks/useExamClass";
import { Skeleton } from "antd";
import UpdateExamClassInfoForm from "../components/UpdateExamClassInfoForm/UpdateExamClassInfoForm";
const ExamClassEdit = () => {
	const { getExamClassDetail, examClassInfo, infoLoading } = useExamClasses();
	const [loading, setLoading] = useState(false);
	const notify = useNotify();
	const location = useLocation();
	const id = location.pathname.split("/")[2];
	useEffect(() => {
		getExamClassDetail({}, id);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	const onFinish = (value) => {
		setLoading(true);
		updateExamClassService(
			id,
			{
				...value,
				examineTime: dayjs(value.examineTime).format(
					"HH:mm DD/MM/YYYY"
				),
			},
			(res) => {
				setLoading(false);
				notify.success("Cập nhật lớp thi thành công!");
			},
			(error) => {
				setLoading(false);
				notify.error("Lỗi cập nhật lớp thi!");
			}
		);
	};
	return (
		<div className="exam-class-edit">
			<Skeleton active loading={infoLoading}>
				<UpdateExamClassInfoForm
					infoHeader="Cập nhật lớp thi"
					onFinish={onFinish}
					btnText="Thêm"
					initialValues={{
						remember: false,
						subjectId: examClassInfo
							? examClassInfo.subjectId
							: null,
						semesterId: examClassInfo
							? examClassInfo.semesterId
							: null,
						roomName: examClassInfo ? examClassInfo.roomName : null,
						examineTime: examClassInfo.examineTime
							? dayjs(
									examClassInfo.examineTime,
									"YYYY-MM-DD HH:mm:ss"
							  )
							: "",
						code: examClassInfo ? examClassInfo.code : null,
					}}
					loading={loading}
				/>
			</Skeleton>
		</div>
	);
};
export default ExamClassEdit;
