import { DatePicker, Input, Spin, Select } from "antd";
import "./ManualTest.scss";
import { useEffect, useState } from "react";
import TestView from "./TestView/TestView";
import useCombo from "../../../../hooks/useCombo";
import debounce from "lodash.debounce";
import { levelOptions } from "../../../../utils/constant";

const ManualTest = ({ questionList, chapterIds, subjectId, subjectOptions, onSelectLevel, onChangeSearch }) => {
  const [startTime, setStartTime] = useState(null);
  const [name, setName] = useState("");
  const [duration, setDuration] = useState(null);
  const [questionQuantity, setQuestionQuantity] = useState(null);
  const [easyNumber, setEasyNumber] = useState(null);
  const [mediumNumber, setMediumNumber] = useState(null);
  const [hardNumber, setHardNumber] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [semesterId, setSemesterId] = useState(null);
  const { allSemester, semesterLoading, getAllSemesters } = useCombo();
  useEffect(() => {
    getAllSemesters({ search: "" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const options =
    allSemester && allSemester.length > 0
      ? allSemester.map((item) => {
        return { value: item.id, label: item.name };
      })
      : [];
  const levelOnchange = (value) => {
    onSelectLevel(value);
  };

  const onSearch = (value, _e, info) => {
    onChangeSearch(value)
  };
  const onChange = debounce((_e) => {
    onChangeSearch(_e.target.value)
  }, 3000)
  return (
    <div className="manual-test">
      <div className="manual-select">
        <div className="manual-test-left">
          <div className="manual-item">
            <span className="manual-item-label">Tên kỳ thi:</span>
            <Input
              placeholder="Nhập tên kỳ thi"
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="manual-item">
            <span className="manual-item-label">Học kỳ:</span>
            <Select
              loading={semesterLoading}
              placeholder="Chọn kỳ thi"
              options={options}
              onChange={(value) => setSemesterId(value)}
            />
          </div>
          <div className="manual-item manual-date">
            <span className="manual-item-label">
              Thời gian bắt đầu:
            </span>
            <DatePicker
              format={"YYYY-MM-DD HH:mm"}
              showTime={{ format: "HH:mm" }}
              onChange={(value) => setStartTime(value)}
            ></DatePicker>
          </div>
          <div className="manual-item manual-duration">
            <span className="manual-item-label">
              Thời gian thi (phút):{" "}
            </span>
            <Input
              type="number"
              placeholder="Nhập thời gian thi"
              onChange={(_e) => setDuration(_e.target.value)}
            />
          </div>
        </div>
        <div className="manual-test-right">
          <div className="manual-item manual-totalQues">
            <span className="manual-item-label">Số câu hỏi: </span>
            <Input
              type="number"
              placeholder="Nhập số câu hỏi"
              onChange={(_e) => setQuestionQuantity(_e.target.value)}
            />
          </div>
          <div className="manual-item manual-config">
            <span className="manual-item-label">Phân loại:</span>
            <div className="manual-config-details">
              <Input
                type="number"
                placeholder="Số câu dễ"
                onChange={(_e) =>
                  setEasyNumber(_e.target.value)
                }
              />
              <Input
                type="number"
                placeholder="Số câu trung bình"
                onChange={(_e) =>
                  setMediumNumber(_e.target.value)
                }
              />
              <Input
                type="number"
                placeholder="Số câu khó"
                onChange={(_e) =>
                  setHardNumber(_e.target.value)
                }
              />
              {Number(questionQuantity) !==
                Number(easyNumber) +
                Number(mediumNumber) +
                Number(hardNumber) &&
                easyNumber &&
                mediumNumber &&
                hardNumber && (
                  <div className="error-message">
                    Tổng số câu dễ, trung bình, khó phải
                    bằng tổng số câu hỏi.
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
      <div className="level-search">
        <div className="list-search">
          <span className="list-search-filter-label">Tìm kiếm:</span>
          <Input.Search placeholder="Nhập nội dung câu hỏi" enterButton onSearch={onSearch} allowClear onChange={onChange} />
        </div>
        <div className="test-level">
          <span className="select-label">Mức độ:</span>
          <Select
            defaultValue={"ALL"}
            optionLabelProp="label"
            options={levelOptions}
            onChange={levelOnchange}
          />
        </div>
      </div>
      <div className="test-re-view">
        <Spin tip="Đang tải..." spinning={false}>
          <TestView
            questionList={questionList}
            startTime={startTime}
            duration={duration}
            totalPoint={10}
            name={name}
            subjectId={subjectId}
            semesterId={semesterId}
            generateConfig={{
              numTotalQuestion: questionQuantity,
              numEasyQuestion: easyNumber,
              numMediumQuestion: mediumNumber,
              numHardQuestion: hardNumber,
            }}
            subjectOptions={subjectOptions}
            semesterOptions={options}
          />
        </Spin>
      </div>
    </div>
  );
};
export default ManualTest;
