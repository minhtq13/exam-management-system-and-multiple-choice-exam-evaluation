import { useEffect, useState } from "react";
import { Select, Tabs } from "antd";
import "./TestCreate.scss";
import AutoTest from "./AutoTest/AutoTest";
import useQuestions from "../../../hooks/useQuestion";
import ManualTest from "./ManualTest/ManualTest";
import useCombo from "../../../hooks/useCombo";

const TestCreate = () => {
  const initialParam = {
    subjectId: null,
    subjectCode: null,
    chapterCode: null,
    chapterIds: [],
    level: "ALL",
  };
  const [param, setParam] = useState(initialParam);
  const {
    chapterLoading,
    subLoading,
    allChapters,
    allSubjects,
    getAllChapters,
    getAllSubjects,
  } = useCombo();
  const [subjectId, setSubjectId] = useState(null);
  const [chapterIds, setChapterIds] = useState([]);
  const { allQuestions, getAllQuestions } = useQuestions();
  const [tabKey, setTabKey] = useState("auto");
  const [formKey, setFormKey] = useState(0);
  const levelOptions = [
    {
      value: "ALL",
      label: "Tất cả",
    },
    {
      value: "EASY",
      label: "Dễ",
    },
    {
      value: "MEDIUM",
      label: "Trung bình",
    },
    {
      value: "HARD",
      label: "Khó",
    },
  ];
  useEffect(() => {
    getAllSubjects({ subjectCode: null, subjectTitle: null });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (subjectId) {
      getAllChapters({
        subjectId: subjectId,
        chapterCode: null,
        chapterId: null,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subjectId]);
  useEffect(() => {
    if (tabKey === "manual") {
      getAllQuestions(param);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [param, tabKey]);
  const subjectOptions = allSubjects.map((item) => {
    return { value: item.id, label: item.name };
  });
  const chapterOptions = allChapters.map((item) => {
    return { value: item.id, label: item.name };
  });
  const subjectOnChange = (value) => {
    setSubjectId(value);
    setParam({ ...param, subjectId: value, chapterIds: [] });
    setChapterIds([]);
    setFormKey((prev) => prev + 1);
  };
  const chapterOnchange = (values) => {
    setParam({ ...param, chapterIds: values });
    setChapterIds(values);
  };
  const tabOnchange = (value) => {
    setTabKey(value);
  };
  const levelOnchange = (value) => {
    setParam({ ...param, level: value });
  };
  const items = [
    {
      key: "auto",
      label: "Tự động",
      children: (
        <AutoTest
          chapterIds={chapterIds}
          formKey={formKey}
          subjectId={subjectId}
        />
      ),
    },
    {
      key: "manual",
      label: "Thủ công",
      children: (
        <ManualTest
          //loading={loading}
          chapterIds={chapterIds}
          questionList={allQuestions}
          subjectId={subjectId}
        />
      ),
    },
  ];
  return (
    <div className="test-create">
      <div className="test-create-header">Thêm đề thi</div>
      <div className="test-subject-chapters">
        <div className="test-subject">
          <span className="select-label">Học phần:</span>
          <Select
            showSearch
            placeholder="Chọn môn học"
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.label ?? "").includes(input)
            }
            optionLabelProp="label"
            options={subjectOptions}
            onChange={subjectOnChange}
            loading={subLoading}
            allowClear
          />
        </div>
        <div className="test-chapters">
          <span className="select-label">Chương:</span>
          <Select
            mode="multiple"
            allowClear
            placeholder="Chọn chương"
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.label ?? "").includes(input)
            }
            optionLabelProp="label"
            options={chapterOptions}
            onChange={chapterOnchange}
            value={chapterIds}
            loading={chapterLoading}
          />
        </div>
        <div className="test-level">
          <span className="select-label">Mức độ:</span>
          <Select
            defaultValue={"ALL"}
            optionLabelProp="label"
            options={levelOptions}
            onChange={levelOnchange}
            disabled={tabKey === "auto"}
          />
        </div>
      </div>
      <Tabs
        onChange={tabOnchange}
        defaultActiveKey="1"
        items={items}
        className="test-content"
      ></Tabs>
    </div>
  );
};
export default TestCreate;
