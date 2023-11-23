import "./SubjectView.scss";
import { Tabs, Skeleton } from "antd";
import SubjectContent from "./SubjectContent/SubjectContent";
import useSubjects from "../../../hooks/useSubjects";
import { useEffect} from "react";
import { useLocation } from "react-router-dom";

const SubjectView = () => {
  const { getSubjectByCode, subjectInfo, infoLoading } =
    useSubjects();
  const location = useLocation();
  const code = location.pathname.split("/")[2];
  useEffect(() => {
    getSubjectByCode({}, code);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const items = [
    {
      key: "1",
      label: `Chapter`,
      children: (
        <SubjectContent editItems={subjectInfo.lstChapter ? subjectInfo.lstChapter.sort((a, b) => a.order - b.order) : []} contentLoading={infoLoading} code={code}/>
      ),
    },
    {
      key: "2",
      label: `Exam`,
      children: `Exam`,
    },
  ];
  console.log(infoLoading);
  return (
    <div className="subject-view">
      <div className="subject-view-header"> Thông tin học phần</div>
      <div className="subject-view-info">
        <div className="subject-main-info">
          <div className="subject-info-title subject-column">
            <span className="subject-info-item-title">Code:</span>
            <span className="subject-info-item-title">Title:</span>
            <span className="subject-info-item-title">Description:</span>
            <span className="subject-info-item-title">Credit:</span>
          </div>
          <div className="subject-column">
            <Skeleton active loading={infoLoading}>
              <span>{subjectInfo ? subjectInfo.code : ""}</span>
              <span>{subjectInfo ? subjectInfo.title : ""}</span>
              <span>{subjectInfo ? subjectInfo.description : ""}</span>
              <span>{subjectInfo ? subjectInfo.credit : ""}</span>
            </Skeleton>
          </div>
        </div>
        <Tabs defaultActiveKey="1" items={items} className="subject-exam-content"></Tabs>
      </div>
    </div>
  );
};
export default SubjectView;
