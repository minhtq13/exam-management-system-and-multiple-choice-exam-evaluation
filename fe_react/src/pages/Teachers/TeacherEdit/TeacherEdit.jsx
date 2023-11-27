import { Skeleton } from "antd";
import moment from "moment/moment";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import TeacherInfo from "../../../components/TeacherInfo/TeacherInfo";
import useNotify from "../../../hooks/useNotify";
import { updateTeachersService } from "../../../services/teachersServices";
import useUser from "../../../services/useUser";
import { formatDateParam } from "../../../utils/tools";
import "./TeacherEdit.scss";

const TeacherEdit = () => {
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
    const nameStr = value.fullName.split(" ");
    updateTeachersService(
      userInfo ? userInfo.id : null,
      {
        phoneNumber: value.phoneNumber,
        genderType: value.genderType,
        email: value.email,
        birthDate: formatDateParam(value.birthDate),
        firstName: nameStr.slice(0, -1).join(" "),
        lastName: nameStr[nameStr.length - 1],
        departmentId: -1,
        userType: 1,
        code: value.code,
      },
      (res) => {
        setLoading(false);
        notify.success("Cập nhật thông tin giảng viên thành công!");
      },
      (error) => {
        setLoading(false);
        notify.error("Lỗi cập nhật thông tin giảng viên!");
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
            fullName: userInfo
              ? `${userInfo.firstName}${userInfo.lastName}`
              : "",
            email: userInfo ? userInfo.email : "",
            phoneNumber: userInfo ? userInfo.phoneNumber : "",
            birthDate: userInfo ? moment(userInfo.birthDate) : undefined,
            //gender: userInfo ? userInfo.gender[0] : null,
            code: userInfo ? userInfo.code : null,
          }}
          loading={loading}
          isPasswordDisplay={false}
          isUserNameDisplay={false}
        />
      </Skeleton>
    </div>
  );
};
export default TeacherEdit;
