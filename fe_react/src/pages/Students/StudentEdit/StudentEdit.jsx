import "./StudentEdit.scss";
import React, { useEffect, useState } from "react";
import StudentInfo from "../../../components/StudentInfo/StudentInfo";
import useNotify from "../../../hooks/useNotify";
import { formatDateParam } from "../../../utils/tools";
import moment from "moment/moment";
import { updateUser } from "../../../services/userService";
import { useLocation } from "react-router-dom";
import useUser from "../../../services/useUser";
import { Skeleton } from "antd";

const StudentEdit = () => {
  const [loading, setLoading] = useState(false);
  const { userInfo, getDetailUser, infoLoading } = useUser();
  const notify = useNotify();
  const location = useLocation();
  const id = location.pathname.split("/")[2];
  useEffect(() => {
    getDetailUser({}, id);
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
        identificationNumber: value.identificationNumber
      },
      (res) => {
        setLoading(false);
        notify.success("Cập nhật thông tin sinh viên thành công!");
      },
      (error) => {
        setLoading(false);
        notify.error("Lỗi cập nhật thông tin sinh viên!");
      }
    );
  };

  const datePickerOnchange = (date, dateString) => {
    console.log(date, dateString);
  };
  const genderOnchange = (dateString) => {
    console.log(dateString);
  };
  return (
    <div className="student-add">
      <Skeleton active loading={infoLoading}>
        <StudentInfo
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
            code: userInfo ? userInfo.code : "",
            phoneNumber: userInfo ? userInfo.phoneNumber : "",
            birthDate: userInfo ? moment(userInfo.birthDate) : undefined,
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
