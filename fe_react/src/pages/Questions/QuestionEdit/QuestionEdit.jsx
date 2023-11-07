/* eslint-disable no-unused-vars */
import { Button, Checkbox, Form, Input, Select } from "antd";
import "./QuestionEdit.scss";
import { useEffect, useState } from "react";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import useSubjects from "../../../hooks/useSubjects";
import { useLocation } from "react-router-dom";
import { updateQuesionsService } from "../../../services/questionServices";
import useNotify from "../../../hooks/useNotify";
import axios from "axios";

const QuestionEdit = () => {
  const { questionItem } = useSelector((state) => state.appReducer);
  const [checked, setChecked] = useState(false);
  const [chapterOptions, setChapterOptions] = useState([]);
  const [chapterId, setChapterId] = useState(questionItem.chapter.id);
  const { getAllSubjects, allSubjects, tableLoading } = useSubjects();
  useEffect(() => {
    getAllSubjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const location = useLocation();
  const notify = useNotify();
  const questionId = location.pathname.split("/")[2];
  const getOptions = (array) => {
    let options = array
      ? array.map((item) => {
          let obj = {};
          obj["value"] = item.id;
          obj["label"] = item.title;
          return obj;
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
    setChapterOptions(
      getOptions(allSubjects.find((item) => item.code === value)?.chapters)
    );
  };
  const chapterOnchange = (value) => {
    setChapterId(value);
  };
  const levelOption = [
    {
      value: "EASY",
      label: "Easy",
    },
    {
      value: "MEDIUM",
      label: "Medium",
    },
    {
      value: "HARD",
      label: "Hard",
    },
  ];
  console.log(questionItem);
  const onChange = (checkValues) => {
    setChecked(checkValues.target.checked);
  };
  const onFinish = (values) => {
    const param = {
      chapterId: chapterId,
      level: values.level,
      topicText: values.topicText,
      answers: values.answers.map((item) => {
        let isCorrectBol = item.isCorrect;
        return {
          content: item.content,
          isCorrected: isCorrectBol === true ? "TRUE" : "FALSE",
        };
      }),
    };
    console.log(param);
    // updateQuesionsService(
    //   questionId,
    //   {
    //     jsonRequest: JSON.stringify(param),
    //   },
    //   (res) => {
    //     notify.success("Cập nhật câu hỏi thành công!");
    //   },
    //   (error) => {
    //     notify.error("Lỗi cập nhật câu hỏi!");
    //   }
    // );
    axios.put(
      `http://localhost:8088/e-learning/api/question/update/${questionId}`,
      {
        jsonRequest: JSON.stringify(param),
      },
      { headers: { "Content-Type": "multipart/form-data" } }
    );
  };
  return (
    <div className="question-edit">
      <div className="question-edit-title">Question Edit</div>
      <div className="question-subject-chapter">
        <div className="question-subject">
          <span>Học phần: </span>
          <Select
            showSearch
            placeholder="Select a subject"
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.label ?? "").includes(input)
            }
            defaultValue={questionItem.subjectCode}
            optionLabelProp="label"
            options={
              tableLoading
                ? [
                    {
                      value: questionItem.subjectCode,
                      label: questionItem.subjectTitle,
                    },
                  ]
                : subjectOptions
            }
            onChange={subjectOnChange}
            //loading={tableLoading}
            //defaultValue={questionItem.subjectCode}
          />
        </div>
        <div className="question-subject question-chapter">
          <span>Chương: </span>
          <Select
            showSearch
            placeholder="Select a chapter"
            defaultValue={questionItem.chapter.id}
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.label ?? "").includes(input)
            }
            optionLabelProp="label"
            options={
              tableLoading
                ? [
                    {
                      value: questionItem.chapter.id,
                      label: questionItem.chapter.title,
                    },
                  ]
                : chapterOptions
            }
            onChange={chapterOnchange}
            //loading={tableLoading}
            //defaultValue={questionItem.chapter.id}
          />
        </div>
      </div>
      <Form
        name="question-edit"
        className="question-form"
        onFinish={onFinish}
        initialValues={{
          topicText: questionItem.topicText,
          answers: questionItem.answers.map((item) => {
            return {
              content: item.content,
              isCorrect: item.isCorrected === "true" ? true : false,
            };
          }),
          level: questionItem.level,
        }}
      >
        <div className="topicText-level">
          <Form.Item
            className="topic-text"
            label="Câu hỏi: "
            name="topicText"
            rules={[
              {
                required: true,
                message: "Please enter the question or remove this question!",
              },
            ]}
          >
            <Input placeholder="Enter the question..." />
          </Form.Item>
          <Form.Item
            label={"Level"}
            name={"level"}
            rules={[
              {
                required: true,
                message: "Please select level!",
              },
            ]}
          >
            <Select
              placeholder="Select level"
              options={levelOption}
              style={{ height: 45 }}
            ></Select>
          </Form.Item>
        </div>
        <Form.List name={"answers"}>
          {(childFields, childListOperations) => (
            <div className="answers">
              {childFields.map((childField, childIndex) => (
                <div
                  key={`frAnswers${childIndex}`}
                  name={[childField.name, `frAnswers${childIndex}`]}
                  className="answer-list"
                >
                  <div className="answer-list-text-checkbox">
                    <Form.Item
                      {...childField}
                      name={[childField.name, `isCorrect`]}
                      key={`isCorrect${childIndex}`}
                      valuePropName="checked"
                    >
                      <Checkbox checked={checked} onChange={onChange} />
                    </Form.Item>
                    <Form.Item
                      {...childField}
                      name={[childField.name, `content`]}
                      key={`content${childIndex}`}
                      rules={[
                        {
                          required: true,
                          message:
                            "Please remove the answer or remove this answer!",
                        },
                      ]}
                      className="answers-item"
                    >
                      <Input placeholder="Enter the answer..." />
                    </Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => childListOperations.remove(childIndex)}
                      icon={<DeleteOutlined />}
                    />
                  </div>
                </div>
              ))}
              <Form.Item className="add-answer-btn">
                <Button
                  onClick={() => childListOperations.add()}
                  icon={<PlusOutlined />}
                >
                  Thêm tùy chọn
                </Button>
              </Form.Item>
            </div>
          )}
        </Form.List>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            style={{ width: 100, height: 40 }}
            onClick={onFinish}
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
export default QuestionEdit;
