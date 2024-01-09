import dayjs from "dayjs";
import React, { useState } from "react";
import useNotify from "../../../hooks/useNotify";
import { addExamClassService } from "../../../services/examClassServices";
import UpdateExamClassInfoForm from "../components/UpdateExamClassInfoForm/UpdateExamClassInfoForm"
import "./ExamClassCreate.scss";
const ExamClassAdd = () => {
  const [loading, setLoading] = useState(false);
  const [selectedTestId, setSelectedTestId] = useState(null);
  const [lstStudentId, setLstStudentId] = useState([]);
  const [lstSupervisorId, setLstSupervisorId] = useState([]);
  const notify = useNotify();
  const onFinish = (value) => {
    console.log(selectedTestId)
    setLoading(true);
    addExamClassService(
      {
        ...value,
        examineTime: dayjs(value.examineTime).format(
          "HH:mm DD/MM/YYYY"
        ),
        testId: selectedTestId,
        lstStudentId: lstStudentId,
        lstSupervisorId: lstSupervisorId,
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
        onSelectTestId={(id) => setSelectedTestId(id)}
        onSelectStudents={(ids) => setLstStudentId(ids)}
        onSelectTeachers={(ids) => setLstSupervisorId(ids)}
      />
    </div>
  );
};
export default ExamClassAdd;
