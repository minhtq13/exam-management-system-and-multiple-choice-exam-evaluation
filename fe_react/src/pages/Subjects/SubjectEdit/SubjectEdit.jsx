import React, { useEffect, useState } from "react";
import SubjectInfo from "../../../components/SubjectInfo/SubjectInfo";
import useNotify from "../../../hooks/useNotify";
import { updateSubjectsService } from "../../../services/subjectsService";
import { useLocation } from "react-router-dom";
import useSubjects from "../../../hooks/useSubjects";
const SubjectEdit = () => {
  const [loading, setLoading] = useState(false);
  const { getSubjectByCode, subjectInfo, infoLoading } = useSubjects();
  const notify = useNotify();
  const location = useLocation();
  const code = location.pathname.split("/")[2];
  useEffect(() => {
    getSubjectByCode({}, code);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const onFinish = (value) => {
    setLoading(true);
    updateSubjectsService(
      location.pathname.split("/")[2],
      {
        code: value.code,
        credit: value.credit,
        description: value.description,
        title: value.title,
        chapters: value.chapters.map((item) => {
          return { order: item.order, title: item.title };
        }),
      },
      (res) => {
        setLoading(false);
        getSubjectByCode({}, location.pathname.split("/")[2]);
        notify.success("Cập nhật thông tin học phần thành công!");
      },
      (error) => {
        setLoading(false);
        notify.error("Lỗi cập nhật thông tin học phần!");
      }
    );
    console.log(value, "formvalue");
  };
  return (
    <SubjectInfo
      infoHeader="Sửa thông tin học phần"
      editItems={
        subjectInfo.chapters
          ? subjectInfo.chapters.sort((a, b) => a.order - b.order)
          : []
      }
      btnText="Cập nhật"
      chaptersVisible={true}
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
      code={code}
    />
  );
};
export default SubjectEdit;
