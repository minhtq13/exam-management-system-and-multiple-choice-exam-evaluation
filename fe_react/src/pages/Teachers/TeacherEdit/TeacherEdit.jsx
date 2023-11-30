import { Skeleton } from "antd";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import TeacherInfo from "../../../components/TeacherInfo/TeacherInfo";
import useNotify from "../../../hooks/useNotify";
import { formatDateParam } from "../../../utils/tools";
import "./TeacherEdit.scss";
import { updateUser } from "../../../services/userService";
import useAccount from "../../../hooks/useAccount";
import dayjs from "dayjs";

const TeacherEdit = () => {
	const [loading, setLoading] = useState(false);
	const { userInfo, getUserInfoAPI, infoLoading } = useAccount();
	const notify = useNotify();
	const location = useLocation();
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
				identityType: "CITIZEN_ID_CARD",
				identificationNumber: value.identificationNumber,
			},
			(res) => {
				setLoading(false);
				notify.success("Cập nhật thông tin giảng viên thành công!");
				getUserInfoAPI(id, {});
			},
			(error) => {
				setLoading(false);
				notify.error("Lỗi cập nhật thông tin giảng viên!");
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

	const datePickerOnchange = (date, dateString) => {
		console.log(date, dateString);
	};
	const genderOnchange = (dateString) => {
		console.log(dateString);
	};
	return (
		<div className="teacher-add">
			<Skeleton active loading={infoLoading}>
				<TeacherInfo
					infoHeader="Cập nhật thông tin"
					onFinish={onFinish}
					datePickerOnchange={datePickerOnchange}
					genderOnchange={genderOnchange}
					btnText="Cập nhật"
					initialValues={{
						remember: false,
						identificationNumber: userInfo
							? userInfo.identificationNumber
							: null,
						firstName: userInfo ? userInfo.firstName : "",
						lastName: userInfo ? userInfo.lastName : "",
						email: userInfo ? userInfo.email : "",
						phoneNumber: userInfo ? userInfo.phoneNumber : "",
						birthDate: userInfo.birthDate
							? dayjs(
									getFormatDate(userInfo.birthDate),
									"YYYY-MM-DD"
							  )
							: "",
						genderType: userInfo ? userInfo.gender : null,
						code: userInfo ? userInfo.code : null,
					}}
					loading={loading}
				/>
			</Skeleton>
		</div>
	);
};
export default TeacherEdit;
