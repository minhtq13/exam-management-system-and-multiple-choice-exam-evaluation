import { useEffect, useState } from "react";
import useSubjects from "../../../hooks/useSubjects";
import { Select, Tabs } from "antd";
import "./TestCreate.scss";
import AutoTest from "./AutoTest/AutoTest";
import useQuestions from "../../../hooks/useQuestion";
import ManualTest from "./ManualTest/ManualTest";

const TestCreate = () => {
  const { getAllSubjects, allSubjects, tableLoading } = useSubjects();
  const { allQuestions, loading, getAllQuestions } = useQuestions();
  const [tabKey, setTabKey] = useState("auto");
  const [chapterOptions, setChapterOptions] = useState([]);
  const [subjectCode, setSubjectCode] = useState(null);
  const [chapterOrders, setChapterOrders] = useState([]);
  const [preSub, setPreSub] = useState(null);
  useEffect(() => {
    getAllSubjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const getOptions = (array) => {
    let options = array
      ? array.map((item) => {
          return { value: item.order, label: item.title };
        })
      : [];
    return options ? options : [];
  };
  const subjectOptions = allSubjects.map((item) => {
    let obj = {};
    obj["value"] = item.code;
    obj["label"] = item.description;
    return obj;
  });
  const subjectOnChange = (value) => {
    if (tabKey === "manual" && value !== preSub) {
      getAllQuestions({}, value);
    }
    if (value !== preSub) {
      setChapterOrders([]);
      setPreSub(value);
    }
    setChapterOptions(
      getOptions(allSubjects.find((item) => item.code === value)?.chapters)
    );
    setSubjectCode(value);
  };
  const chapterOnchange = (values) => {
    setChapterOrders(values);
  };
  const tabOnchange = (value) => {
    setTabKey(value);
    if (value === "manual") {
      getAllQuestions({}, subjectCode);
    }
  };
  const items = [
    {
      key: "auto",
      label: "Auto Test",
      children: (
        <AutoTest subjectCode={subjectCode} chapterOrders={chapterOrders} />
      ),
    },
    {
      key: "manual",
      label: "Manual Test",
      children: (
        <ManualTest
          subjectCode={subjectCode}
          loading={loading}
          questionList={
            chapterOrders.length > 0
              ? allQuestions.filter((item) =>
                  chapterOrders.includes(item.chapter.order)
                )
              : allQuestions
          }
        />
      ),
    },
  ];
  return (
    <div className="test-create">
      <div className="test-create-header">Test Create</div>
      <div className="test-subject-chapters">
        <div className="test-subject">
          <span>Học phần:</span>
          <Select
            showSearch
            placeholder="Select a subject"
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.label ?? "").includes(input)
            }
            optionLabelProp="label"
            options={subjectOptions}
            onChange={subjectOnChange}
            loading={tableLoading}
          />
        </div>
        <div className="test-chapters">
          <span>Chương:</span>
          <Select
            mode="multiple"
            allowClear
            placeholder="Select a chapter"
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.label ?? "").includes(input)
            }
            optionLabelProp="label"
            options={chapterOptions}
            onChange={chapterOnchange}
            value={chapterOrders}
            loading={tableLoading}
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
