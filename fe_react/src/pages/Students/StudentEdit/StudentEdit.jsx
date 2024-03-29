import { Skeleton } from "antd";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useAccount from "../../../hooks/useAccount";
import useNotify from "../../../hooks/useNotify";
import { updateUser } from "../../../services/userService";
import { formatDateParam } from "../../../utils/tools";
import UpdateStudentInfoForm from "../components/UpdateStudentInfoForm";

const StudentEdit = () => {
	const [loading, setLoading] = useState(false);
	const { getUserInfoAPI, userInfo, infoLoading } = useAccount();
	const notify = useNotify();
	const location = useLocation();
	const navigate = useNavigate()
	const id = location.pathname.split("/")[2];
	useEffect(() => {
		getUserInfoAPI(id, {});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	const onFinish = (value) => {
		setLoading(true);
		updateUser(
			userInfo ? userInfo.id : null,
			{
				phoneNumber: value.phoneNumber,
				genderType: value.genderType,
				email: value.email,
				birthDate: formatDateParam(value.birthDate),
				firstName: value.firstName,
				lastName: value.lastName,
				departmentId: -1,
				userType: 1,
				code: value.code,
				metaData: { courseNum: Number(value.courseNum) },
				identityType: "CITIZEN_ID_CARD",
				identificationNumber: value.identificationNumber,
			},
			(res) => {
				setLoading(false);
				notify.success("Cập nhật thông tin sinh viên thành công!");
				getUserInfoAPI(id, {});
				navigate("/student-list")
			},
			(error) => {
				setLoading(false);
				notify.error("Lỗi cập nhật thông tin sinh viên!");
			}
		);
	};


	const getFormatDate = (dateString) => {
		let formattedDate = "";
		if (dateString) {
			const parts = dateString.split("/");
			formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
		}
		return formattedDate;
	};
	return (
		<div className="student-add">
			<Skeleton active loading={infoLoading}>
				<UpdateStudentInfoForm
					infoHeader="Cập nhật thông tin"
					onFinish={onFinish}
					btnText="Cập nhật"
					initialValues={{
						remember: false,
						identificationNumber: userInfo ? userInfo.identificationNum : null,
						firstName: userInfo ? userInfo.firstName : "",
						lastName: userInfo ? userInfo.lastName : "",
						email: userInfo ? userInfo.email : "",
						code: userInfo ? userInfo.code : "",
						phoneNumber: userInfo ? userInfo.phoneNumber : "",
						birthDate: userInfo.birthDate ? dayjs(getFormatDate(userInfo.birthDate),"YYYY-MM-DD") : "",
						genderType: userInfo ? userInfo.gender : undefined,
						courseNum: userInfo ? userInfo.courseNum : null,
					}}
					loading={loading}
					isPasswordDisplay={false}
					isUserNameDisplay={false}
				/>
			</Skeleton>
		</div>
	);
};
export default StudentEdit;
