import { Button, Select, Spin, Tag } from "antd";
import { useEffect, useState } from "react";
import useQuestions from "../../../hooks/useQuestion";
import deletePopUpIcon from "../../../assets/images/svg/delete-popup-icon.svg";
import "./QuestionList.scss";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import ModalPopup from "../../../components/ModalPopup/ModalPopup";
import { deleteQuesionsService } from "../../../services/questionServices";
import useNotify from "../../../hooks/useNotify";
import { useNavigate } from "react-router-dom";
import { appPath } from "../../../config/appPath";
import { setQuestionItem } from "../../../redux/slices/appSlice";
import { useDispatch } from "react-redux";
import useCombo from "../../../hooks/useCombo";

const QuestionList = () => {
  const initialParam = {
    subjectId: null,
    subjectCode: null,
    chapterCode: null,
    chapterId: null,
    level: "ALL",
  };
  const { allQuestions, getAllQuestions } = useQuestions();
	const {chapterLoading, subLoading, allChapters, allSubjects, getAllChapters, getAllSubjects} = useCombo();
  const [param, setParam] = useState(initialParam);
	const [subjectId, setSubjectId] = useState(null);
	const [chapterId, setChapterId] = useState(null);
  const notify = useNotify();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    getAllQuestions(param);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [param]);
	useEffect(() => {
		getAllSubjects({subjectCode: null, subjectTitle: null});
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])
	useEffect(() => {
		if(subjectId) {
			getAllChapters({subjectId: subjectId, chapterCode: null, chapterId: null});
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [subjectId])
  const subjectOptions = allSubjects.map((item) => {
    return { value: item.id, label: item.name };
  });
	const chapterOptions = allChapters.map((item) => {
		return { value: item.id, label: item.name};
	})
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
  const tagRender = (value, color) => {
    if (value === 0) {
      color = "green";
    } else if (value === 1) {
      color = "geekblue"; 
    } else color = "volcano";
    return color;
  };
  const subjectOnChange = (value) => {
    setSubjectId(value);
		setParam({...param,subjectId: value, chapterId: null});
		setChapterId(null);
  };
  const chapterOnchange = (values) => {
    setParam({...param, chapterId: values});
		setChapterId(values);
  };
  const onRemove = (id) => {
    deleteQuesionsService(
      id,
      null,
      (res) => {
        notify.success("Xoá câu hỏi thành công!");
        //getAllQuestions({}, subjectCode);
      },
      (error) => {
        notify.error("Lỗi xoá câu hỏi!");
      }
    );
  };
  const onEdit = (item) => {
    navigate(`${appPath.questionEdit}/${item.id}`);
    dispatch(setQuestionItem(item));
  };
	const renderTag = (item) => {
		if(item.level === 0){
			return "DỄ";
		}else if (item.level === 1) {
			return "TRUNG BÌNH";
		}else {
			return "KHÓ";
		}
	}
	const levelOnchange = (value) => {
		setParam({...param, level: value})
	}
  return (
    <div className="question-list">
      <div className="subject-chapters-top">
        <div className="test-subject">
          <span className="select-label">Học phần:</span>
          <Select
            allowClear
            showSearch
            placeholder="Chọn môn học để hiển thị ngân hàng câu hỏi"
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.label ?? "").includes(input)
            }
            optionLabelProp="label"
            options={subjectOptions}
            onChange={subjectOnChange}
            loading={subLoading}
          />
        </div>
        <div className="test-chapters">
          <span className="select-label">Chương:</span>
          <Select
            showSearch
            allowClear
            placeholder="Chọn chương để hiển thị ngân hàng câu hỏi"
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.label ?? "").includes(input)
            }
            optionLabelProp="label"
            options={chapterOptions}
            onChange={chapterOnchange}
            loading={chapterLoading}
						value={chapterId}
          />
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
      <Spin spinning={false} tip="Loading...">
        {allQuestions.map((item, index) => {
          return (
            <div className="question-items" key={`index-${item.id}`}>
              <div className="topic-remove">
                <div className="topic-level">
                  <div className="question-topic">{`Câu ${index + 1}: ${
                    item.content
                  }`}</div>
                  <Tag color={tagRender(item.level)}>{renderTag(item)}</Tag>
                </div>
                <div className="btn-space">
                  <ModalPopup
                    buttonOpenModal={<Button icon={<DeleteOutlined />} />}
                    title="Xóa câu hỏi"
                    message="Bạn có chắc chắn muốn xóa câu hỏi này không?"
                    confirmMessage={"Thao tác này không thể hoàn tác"}
                    ok={"Ok"}
                    icon={deletePopUpIcon}
                    onAccept={() => onRemove(item.id)}
                  />
                  <Button
                    icon={<EditOutlined />}
                    onClick={() => onEdit(item)}
                  />
                </div>
              </div>
              {item.lstAnswer &&
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
                      {`${String.fromCharCode(65 + ansNo)}. ${ans.content}`}
                    </div>
                  );
                })}
            </div>
          );
        })}
      </Spin>
    </div>
  );
};
export default QuestionList;
