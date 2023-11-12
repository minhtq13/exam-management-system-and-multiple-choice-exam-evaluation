import { useEffect, useState } from "react";
import { Form, Input, Button, Checkbox, Select } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import "./AddQuestions.scss";
import { addQuestionService } from "../../../services/questionServices";
import useNotify from "../../../hooks/useNotify";
import useCombo from "../../../hooks/useCombo";

const AddQuestions = () => {
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);
	const {chapterLoading, subLoading, allChapters, allSubjects, getAllChapters, getAllSubjects} = useCombo();
	const [subjectId, setSubjectId] = useState(null);
	const [chapterId, setChapterId] = useState(null);

  useEffect(() => {
    getAllSubjects({subjectCode: null, subjectTitle: null});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
		if(subjectId) {
			getAllChapters({subjectId: subjectId, chapterCode: null, chapterId: null});
		}
	}, [subjectId])
  const subjectOptions = allSubjects.map((item) => {
    return { value: item.id, label: item.name };
  });
	const chapterOptions = allChapters.map((item) => {
		return { value: item.id, label: item.name};
	})
  const subjectOnChange = (value) => {
    setSubjectId(value);
		setChapterId(null);
  };
  const chapterOnchange = (values) => {
		setChapterId(values);
  };
  const notify = useNotify();
  const onFinish = (values) => {
    setLoading(true);
    //console.log(values)
    values.lstQuestion && values.lstQuestion.length > 0 &&
      addQuestionService(
        {
          chapterId: chapterId,
          lstQuestion: values.lstQuestion.map((item) => {
            return {
              ...item,
              imageId: null,
              lstAnswer: item.lstAnswer.map((answer) => {
                let isCorrectBol = answer.isCorrect;
                return {
                  content: answer.content,
                  isCorrect: isCorrectBol ?? false,
                  imageId: null,
                };
              }),
            };
          }),
        },
        (res) => {
          setLoading(false);
          notify.success("Thêm câu hỏi thành công!");
        },
        (error) => {
          setLoading(false);
          notify.error("Lỗi thêm mới câu hỏi!");
        }
      );
  };
  const onChange = (checkValues) => {
    setChecked(checkValues.target.checked);
  };
  const levelOption = [
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
  return (
    <div className="question-add">
      <div className="question-add-header">Thêm câu hỏi</div>
      <div className="question-subject-chapter">
        <div className="question-subject">
          <span>Học phần: </span>
          <Select
          allowClear
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
          />
        </div>
        <div className="question-subject question-chapter">
          <span>Chương: </span>
          <Select
            showSearch
            placeholder="Chọn chương"
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
      </div>
      <Form onFinish={onFinish} name="question-form">
        <Form.List name="lstQuestion">
          {(parentFields, parentListOperations) => (
            <>
              {parentFields.map((parentField, parentIndex) => (
                <div
                  key={`fragQuestions${parentIndex}`}
                  className="question-list"
                  name={[parentField.name, `fragQuetion${parentIndex}`]}
                >
                  <div className="question-text">
                    <Form.Item
                      className="topic-Text"
                      key={`content${parentField.key}`}
                      {...parentField}
                      label={`Câu ${parentIndex + 1}:`}
                      name={[parentField.name, `content`]}
                      rules={[
                        {
                          required: true,
                          message: "Chưa nhập câu hỏi!",
                        },
                      ]}
                    >
                      <Input placeholder="Nhập câu hỏi..." />
                    </Form.Item>
                    <Form.Item
                      key={`level${parentField.key}`}
                      {...parentField}
                      label={"Level"}
                      name={[parentField.name, `level`]}
                      rules={[
                        {
                          required: true,
                          message: "Chưa chọn mức độ câu hỏi!",
                        },
                      ]}
                    >
                      <Select
                        defaultValue={"EASY"}
                        options={levelOption}
                        style={{width: 120}}
                      ></Select>
                    </Form.Item>
                    <div className="btn-remove">
                      <Button
                        type="dashed"
                        onClick={() => parentListOperations.remove(parentIndex)}
                        icon={<DeleteOutlined />}
                      ></Button>
                    </div>
                  </div>
                  <Form.List
                    key={`lstAnswer${parentIndex}`}
                    {...parentField}
                    name={[parentField.name, `lstAnswer`]}
                    initialValue={[
                      {
                        content: "",
                        isCorrect: undefined,
                      },
                      {
                        content: "",
                        isCorrect: undefined,
                      },
                    ]}
                  >
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
                                <Checkbox
                                  checked={checked}
                                  onChange={onChange}
                                />
                              </Form.Item>
                              <Form.Item
                                {...childField}
                                name={[childField.name, `content`]}
                                key={`content${childIndex}`}
                                rules={[
                                  {
                                    required: true,
                                    message: "Chưa điền câu trả lời",
                                  },
                                ]}
                                className="answers-item"
                              >
                                <Input placeholder="Nhập câu trả lời..." />
                              </Form.Item>
                              <Button
                                type="dashed"
                                onClick={() =>
                                  childListOperations.remove(childIndex)
                                }
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
                </div>
              ))}
              <Form.Item className="add-question-btn">
                <Button
                  onClick={() => parentListOperations.add()}
                  icon={<PlusOutlined />}
                >
                  Thêm mới
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
        <Form.Item className="add-btn">
          <Button
            type="primary"
            htmlType="submit"
            style={{ width: 150, height: 50 }}
            loading={loading}
            onClick={onFinish}
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddQuestions;
