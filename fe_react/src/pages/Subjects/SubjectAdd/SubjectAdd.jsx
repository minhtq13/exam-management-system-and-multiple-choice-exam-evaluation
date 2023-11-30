import React, { useState } from "react";
import useNotify from "../../../hooks/useNotify";
import { addSubjectsService } from "../../../services/subjectsService";
import UpdateSubjectInfoForm from "../components/UpdateSubjectInfoForm/UpdateSubjectInfoForm";
const SubjectAdd = () => {
  const [loading, setLoading] = useState(false);
  const notify = useNotify();
  const onFinish = (values) => {
    setLoading(true);
    addSubjectsService(
      values,
      (res) => {
        setLoading(false);
        notify.success("Thêm học phần thành công!");
      },
      (error) => {
        setLoading(false);
        notify.error("Lỗi thêm học phần!");
      }
    );
  };
  return (
    <UpdateSubjectInfoForm
      chaptersVisible={false}
      infoHeader="Thêm học phần"
      btnText="Thêm"
      initialValues={{ remember: false }}
      onFinish={onFinish}
      loading={loading}
    />
  );
};
export default SubjectAdd;
