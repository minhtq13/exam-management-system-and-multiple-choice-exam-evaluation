import { DatePicker, Input, Spin, Select } from "antd";
import "./ManualTest.scss";
import { useEffect, useState } from "react";
import TestView from "./TestView/TestView";
import useCombo from "../../../../hooks/useCombo";

const ManualTest = ({ questionList, chapterIds, subjectId, subjectOptions }) => {
  const [startTime, setStartTime] = useState(null);
  const [name, setName] = useState("");
  const [duration, setDuration] = useState(null);
  const [totalPoint, setTotalPoint] = useState(null);
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
              Thời gian thi(phút):{" "}
            </span>
            <Input
              type="number"
              placeholder="Nhập thời gian thi"
              onChange={(_e) => setDuration(_e.target.value)}
            />
          </div>
        </div>
        <div className="manual-test-right">
          <div className="manual-item manual-totalPoint">
            <span className="manual-item-label">Tổng điểm: </span>
            <Input
              type="number"
              placeholder="Nhập tổng điểm bài thi"
              onChange={(_e) => setTotalPoint(_e.target.value)}
              value={10}
              disabled={true}
            />
          </div>
          <div className="manual-item manual-totalQues">
            <span className="manual-item-label">Số câu hỏi: </span>
            <Input
              type="number"
              placeholder="Nhập số câu hỏi"
              onChange={(_e) =>
                setQuestionQuantity(_e.target.value)
              }
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
      <div className="test-re-view">
        <Spin tip="Đang tải..." spinning={false}>
          <TestView
            questionList={questionList}
            startTime={startTime}
            duration={duration}
            totalPoint={totalPoint}
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
