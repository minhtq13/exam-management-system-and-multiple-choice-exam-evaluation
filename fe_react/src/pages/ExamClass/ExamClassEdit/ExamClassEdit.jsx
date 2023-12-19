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
	const [selectedTestId, setSelectedTestId] = useState(null);
	const [lstStudentId, setLstStudentId] = useState([]);
	const [lstSupervisorId, setLstSupervisorId] = useState([]);
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
				testId: examClassInfo.testId ?? selectedTestId,
				examineTime: dayjs(value.examineTime).format(
					"HH:mm DD/MM/YYYY"
				),
				lstStudentId: examClassInfo.lstStudentId
					? examClassInfo.lstStudentId.split(",").map(Number)
					: lstStudentId,
				lstSupervisorId: examClassInfo.lstSupervisorId
					? examClassInfo.lstSupervisorId.split(",").map(Number)
					: lstSupervisorId,
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
					btnText="Cập nhật"
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
						testId: examClassInfo ? examClassInfo.id : null,
					}}
					testDisplay={`${examClassInfo.testName} - ${examClassInfo.duration}(phút)`}
					lstStudentId={
						examClassInfo && examClassInfo.lstStudentId
							? examClassInfo.lstStudentId.split(",").map(Number)
							: []
					}
					lstSupervisorId={
						examClassInfo && examClassInfo.lstSupervisorId
							? examClassInfo.lstSupervisorId
									.split(",")
									.map(Number)
							: []
					}
					loading={loading}
					onSelectTestId={(id) => setSelectedTestId(id)}
					onSelectStudents={(ids) => setLstStudentId(ids)}
					onSelectTeachers={(ids) => setLstSupervisorId(ids)}
				/>
			</Skeleton>
		</div>
	);
};
export default ExamClassEdit;
