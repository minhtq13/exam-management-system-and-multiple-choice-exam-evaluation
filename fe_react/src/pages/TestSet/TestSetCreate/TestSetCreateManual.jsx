import { Button, Checkbox, Input, Select, Spin, Tag } from "antd";
import debounce from "lodash.debounce";
import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import useNotify from "../../../hooks/useNotify";
import useQuestions from "../../../hooks/useQuestion";
import { testSetCreateService } from "../../../services/testServices";
import { levelOptions } from "../../../utils/constant";
import {useNavigate} from "react-router-dom";

const TestSetCreateManual = ({ testId }) => {
  const navigate = useNavigate();
  const initialParam = {
    subjectId: null,
    subjectCode: null,
    chapterCode: null,
    chapterIds: [],
    search: null,
    level: "ALL",
    testId: testId
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
  const onSearch = (value, _e, info) => {
    setParam({ ...param, search: value })
  };
  const onChange = debounce((_e) => {
    setParam({ ...param, search: _e.target.value })
  }, 3000)
  const { getAllQuestions, quesLoading, allQuestions } = useQuestions();
  const [param, setParam] = useState(initialParam);
  const [lstPreview, setLstPreview] = useState([]);
  const [checkIds, setCheckIds] = useState([]);
  const [code, setCode] = useState(null);
  const [loading, setLoading] = useState(false);
  const notify = useNotify();
  useEffect(() => {
    getAllQuestions(param);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [param]);
  const levelOnchange = (option) => {
    setParam({ ...param, level: option })
  }
  const selectChange = (checkValues) => {
    setCheckIds([...checkIds, checkValues]);
    setLstPreview(allQuestions.filter(item => checkValues.includes(item.id)));
  };
  const questionRender = (item, index, isPreview) => {
    return (
      <div className="question-items" key={index}>
        <div className="topic-level">
          <div className="question-topic">
            {isPreview && <div className="question-number">{`Câu ${index + 1
              }: `}</div>}
            <ReactQuill
              key={index}
              value={item.content}
              readOnly={true}
              theme="snow"
              modules={{ toolbar: false }}
            />
          </div>
          <Tag
            color={tagRender(item.level)}>
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
                <span>{`${String.fromCharCode(
                  65 + ansNo
                )}. `}</span>
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
    )
  }
  const questionOptions = allQuestions.map((item, index) => {
    return {
      label: questionRender(item, index),
      value: item.id,
    };
  });
  const onCreate = () => {
    setLoading(true);
    testSetCreateService(
      {
        testSetCode: code,
        testId: Number(testId),
        questions: lstPreview.map((ques, quesIndex) => {
          return {
            questionId: ques.id,
            questionNo: quesIndex + 1,
            answers: ques.lstAnswer.map((ans, ansIndex) => {
              return {
                answerId: ans.id,
                answerNo: ansIndex + 1
              }
            })
          }
        })
      },
      (res) => {
        setLoading(false);
        notify.success(`Bạn đã tạo thành công mã đề thi ${code}`);
        navigate(`/test-list`)
      },
      (error) => {
        setLoading(false);
        notify.error(`Lỗi tạo mã đề thi ${code}`)
      }
    )
  }
  return (
    <div className="test-set-create-manual">
      <div className="manual-content">
        <div className="manual-fill">
          <div className="search-level">
            <div className="list-search">
              <span className="list-search-filter-label">Tìm kiếm:</span>
              <Input.Search placeholder="Nhập nội dung câu hỏi" enterButton onSearch={onSearch} allowClear onChange={onChange} />
            </div>
            <div className="test-level">
              <span className="list-search-filter-label">Mức độ:</span>
              <Select
                defaultValue={"ALL"}
                optionLabelProp="label"
                options={levelOptions}
                onChange={levelOnchange}
              />
            </div>
          </div>
          <Spin spinning={quesLoading} tip="Đang tải">
            <Checkbox.Group options={questionOptions} onChange={selectChange} />
          </Spin>
        </div>
        <div className="manual-preview">
          <div className="manual-preview-code">
            <span className="manual-preview-code-label" style={{fontSize: 16}}>Mã đề thi:</span>
            <Input type="number" onChange={(e) => setCode(e.target.value)} placeholder="Nhập mã đề thi" />
          </div>
          <div className="manual-preview-content">
            {lstPreview.length > 0 ? lstPreview.map((item, index) => {
              return questionRender(item, index, true);
            }) : <div className="preview-noti">Vui lòng chọn câu hỏi và xem trước đề thi ở đây!</div>}
          </div>
        </div>
      </div>
      <div className="btn-save-manual">
        <Button
          type="primary"
          style={{ minWidth: 100, height: 40 }}
          onClick={onCreate}
          loading={loading}
        >Tạo đề</Button>
      </div>
    </div>
  )
}
export default TestSetCreateManual;
