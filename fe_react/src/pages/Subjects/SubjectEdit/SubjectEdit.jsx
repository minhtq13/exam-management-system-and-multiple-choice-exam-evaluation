import React, { useEffect, useState } from "react";
import useNotify from "../../../hooks/useNotify";
import { updateSubjectsService } from "../../../services/subjectsService";
import { useLocation, useNavigate } from "react-router-dom";
import useSubjects from "../../../hooks/useSubjects";
import UpdateSubjectInfoForm from "../components/UpdateSubjectInfoForm/UpdateSubjectInfoForm";
const SubjectEdit = () => {
	const [loading, setLoading] = useState(false);
	const { getSubjectByCode, subjectInfo, infoLoading } = useSubjects();
	const notify = useNotify();
	const location = useLocation();
	const navigate = useNavigate()
	const id = location.pathname.split("/")[2];
	useEffect(() => {
		getSubjectByCode({}, id);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	const onFinish = (value) => {
		setLoading(true);
		updateSubjectsService(
			id,
			{
				code: value.code,
				credit: value.credit,
				description: value.description,
				title: value.title,
			},
			(res) => {
				setLoading(false);
				getSubjectByCode({}, location.pathname.split("/")[2]);
				notify.success("Cập nhật thông tin học phần thành công!");
				navigate("/subject-list")
			},
			(error) => {
				setLoading(false);
				notify.error("Lỗi cập nhật thông tin học phần!");
			}
		);
	};
	return (
		<UpdateSubjectInfoForm
			infoHeader="Sửa thông tin học phần"
			editItems={
				subjectInfo.lstChapter
					? subjectInfo.lstChapter.sort((a, b) => a.orders - b.orders)
					: []
			}
			btnText="Cập nhật"
			chaptersVisible={false}
			skeletonLoading={infoLoading}
			initialValues={{
				remember: false,
				title: subjectInfo ? subjectInfo.title : null,
				code: subjectInfo ? subjectInfo.code : null,
				description: subjectInfo ? subjectInfo.description : null,
				credit: subjectInfo ? subjectInfo.credit : null,
			}}
			loading={loading}
			onFinish={onFinish}
			id={id}
		/>
	);
};
export default SubjectEdit;
