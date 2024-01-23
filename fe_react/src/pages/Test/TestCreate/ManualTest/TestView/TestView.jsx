import React, { useState } from "react";
import "./TestView.scss";
import { Checkbox, Button, Modal, Tag } from "antd";
import { useNavigate } from "react-router-dom";
import { testService } from "../../../../../services/testServices";
import dayjs from "dayjs";
import useNotify from "../../../../../hooks/useNotify";
import { appPath } from "../../../../../config/appPath";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { setDetailTest } from "../../../../../utils/storage";
const TestView = ({
  questionList,
  startTime,
  duration,
  name,
  subjectId,
  semesterId,
  generateConfig,
  subjectOptions,
  semesterOptions
}) => {
  const [quesIds, setQuesIds] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [testId, setTestId] = useState(null);
  const [levelCounts, setLevelCounts] = useState({ 0: 0, 1: 0, 2: 0 });
  // const mergeArray = (...arrays) => {
  //   const uniqueValues = arrays.reduce((acc, currentArray) => {
  //     currentArray.forEach(value => {
  //       acc.add(value);
  //     });
  //     return acc;
  //   }, new Set());

  //   return [...uniqueValues];
  // }

  const getLevelCounts = (ids) => {
    let levelCount = { 0: 0, 1: 0, 2: 0 };
    const filteredArray = questionList.filter(ques => ids.includes(ques.id));
    filteredArray.forEach(item => {
      levelCount[item.level]++;
    });
    return levelCount;
  }
  const onChange = (checkValues) => {
    setQuesIds(checkValues);
    setLevelCounts(getLevelCounts(checkValues));
  };
  const navigate = useNavigate();
  const notify = useNotify();
  const onCreate = () => {
    setLoading(true);
    testService(
      {
        subjectId: subjectId,
        name: name,
        startTime: dayjs(startTime).format("DD/MM/YYYY HH:mm"),
        duration: Number(duration),
        totalPoint: 10,
        questionIds: quesIds,
        semesterId: semesterId,
        generateConfig: generateConfig,
        questionQuantity: Number(generateConfig.numTotalQuestion),
      },
      (res) => {
        setOpenModal(true);
        setLoading(false);
        setTestId(res.data);
      },
      (error) => {
        setLoading(false);
        notify.error("Lỗi tạo đề thi");
      }
    );
  };
  const tagRender = (value, color) => {
    if (value === 0) {
      color = "green";
    } else if (value === 1) {
      color = "geekblue";
    } else color = "volcano";
    return color;
  };
  const renderTag = (item) => {
    if (item.level === 0) {
      return "DỄ";
    } else if (item.level === 1) {
      return "TRUNG BÌNH";
    } else {
      return "KHÓ";
    }
  };
  const options = questionList.map((item, index) => {
    return {
      label: (
        <div className="question-items" key={index}>
          <div className="topic-level">
            <div className="question-topic">
              <div className="question-number">{`Câu ${index + 1
                }: `}</div>
              <ReactQuill
                key={index}
                value={item.content}
                readOnly={true}
                theme="snow"
                modules={{ toolbar: false }}
              />
            </div>
            <Tag color={tagRender(item.level)}>
              {renderTag(item)}
            </Tag>
          </div>
          {item.lstAnswer &&
            item.lstAnswer.length > 0 &&
            item.lstAnswer.map((ans, ansNo) => {
              return (
                <div
                  className={
                    ans.isCorrect
                      ? "answer-items corrected"
                      : "answer-items"
                  }
                  key={`answer${ansNo}`}
                >
                  <span>{`${String.fromCharCode(65 + ansNo)}. `}</span>
                  <ReactQuill
                    key={ansNo}
                    value={ans.content}
                    readOnly={true}
                    theme="snow"
                    modules={{ toolbar: false }}
                  />
                </div>
              );
            })}
        </div>
      ),
      value: item.id,
    };
  });
  return (
    <div className="test-view">
      <div className="test-wrap">
        <div className="guide-text">
          Chọn bộ câu hỏi dưới đây để sử dụng cho kỳ thi:
        </div>
        <div className="number-ques">
          <div className="number-ques-item">{`Dễ: ${levelCounts[0]}`}</div>
          <div className="number-ques-item">{`Trung bình: ${levelCounts[1]}`}</div>
          <div className="number-ques-item">{`Khó: ${levelCounts[2]}`}</div>
          <div className="number-ques-item">{`Tổng: ${quesIds.length}`}</div>
        </div>
        <Checkbox.Group options={options} onChange={onChange} />
      </div>
      <Button
        loading={loading}
        type="primary"
        style={{ width: 100, height: 40 }}
        onClick={onCreate}
      >
        Tạo đề
      </Button>
      <Modal
        className="test-set-create-modal"
        open={openModal}
        title="Tạo đề thi thành công!"
        onOk={() => {
          navigate(`${appPath.testSetCreate}/${testId}`);
          setDetailTest({
            duration: duration,
            questionQuantity: generateConfig.numTotalQuestion,
            subjectName: subjectOptions && subjectOptions.length > 0 ? (subjectOptions.find(item => item.value === subjectId) || {}).label : null,
            semester: semesterOptions ? semesterOptions.find(item => item.value === semesterId).label : null
          })
        }
        }
        onCancel={() => setOpenModal(false)}
      >
        <p>Bạn có muốn tạo tập đề thi không?</p>
      </Modal>
    </div>
  );
};
export default TestView;
