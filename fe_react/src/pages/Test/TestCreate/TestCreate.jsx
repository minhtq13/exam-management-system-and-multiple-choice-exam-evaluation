import { useEffect, useState } from "react";
import { Select, Tabs, Input } from "antd";
import "./TestCreate.scss";
import AutoTest from "./AutoTest/AutoTest";
import useQuestions from "../../../hooks/useQuestion";
import ManualTest from "./ManualTest/ManualTest";
import useCombo from "../../../hooks/useCombo";
import debounce from "lodash.debounce";

const TestCreate = () => {
  const initialParam = {
    subjectId: null,
    subjectCode: null,
    chapterCode: null,
    chapterIds: [],
    level: "ALL",
    search: null
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
    if (tabKey === "auto" && subjectId) {
      getAllQuestions({ ...param, level: "ALL", search: null });
    } else if (tabKey === "manual") {
      getAllQuestions(param);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [param, tabKey, subjectId]);
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

  const onSearch = (value, _e, info) => {
    setParam({ ...param, search: value })
  };
  const onChange = debounce((_e) => {
    setParam({ ...param, search: _e.target.value })
  }, 3000)

  const calQuesLevel = (data) => {
    const result = {
      0: 0,
      1: 0,
      2: 0,
    };
    data.forEach((item) => {
      result[item.level]++;
    });
    return result;
  }
  const levelCalResult = calQuesLevel(allQuestions);
  const items = [
    {
      key: "auto",
      label: <h3>Tự động</h3>,
      children: (
        <AutoTest
          chapterIds={chapterIds}
          formKey={formKey}
          subjectId={subjectId}
          sumQues={allQuestions.length ?? null}
          levelCal={levelCalResult}
          subjectOptions={subjectOptions}
        />
      ),
    },
    {
      key: "manual",
      label: <h3>Thủ công</h3>,
      children: (
        <ManualTest
          chapterIds={chapterIds}
          questionList={allQuestions ?? []}
          subjectId={subjectId}
          subjectOptions={subjectOptions}
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
            disabled={!subjectId}
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
        <div className="list-search">
          <span className="list-search-filter-label">Tìm kiếm:</span>
          <Input.Search placeholder="Nhập nội dung câu hỏi" enterButton onSearch={onSearch} allowClear onChange={onChange} disabled={tabKey === "auto"} />
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
