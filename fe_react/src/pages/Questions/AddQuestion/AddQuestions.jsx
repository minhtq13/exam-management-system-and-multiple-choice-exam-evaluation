import { useEffect, useState } from "react";
import { Form, Button, Checkbox, Select } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import ImageResize from "quill-image-resize-module-react";
import "./AddQuestions.scss";
import { addQuestionService } from "../../../services/questionServices";
import useNotify from "../../../hooks/useNotify";
import useCombo from "../../../hooks/useCombo";

Quill.register("modules/imageResize", ImageResize);
const AddQuestions = () => {
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const [preChapter, setPreChapter] = useState(null);
  const [value, setValue] = useState(null);
  const [errorStates, setErrorStates] = useState([]);
  const {
    chapterLoading,
    subLoading,
    allChapters,
    allSubjects,
    getAllChapters,
    getAllSubjects,
  } = useCombo();
  const [subjectId, setSubjectId] = useState(null);
  const [chapterId, setChapterId] = useState(null);
  const modules = {
    toolbar: [
      ["bold", "italic", "underline"], // toggled buttons
      ["blockquote", "code-block"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ script: "sub" }, { script: "super" }], // superscript/subscript
      [{ align: [] }],
      ["image"],
      [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
    ],

    clipboard: {
      matchVisual: false,
    },
    imageResize: {
      parchment: Quill.import("parchment"),
      modules: ["Resize", "DisplaySize"],
    },
  };
  const formats = [
    "list",
    "size",
    "bold",
    "italic",
    "underline",
    "blockquote",
    "indent",
    "link",
    "image",
    "code-block",
    "align",
    "script",
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
  const subjectOptions = allSubjects.map((item) => {
    return { value: item.id, label: item.name };
  });
  const chapterOptions = allChapters.map((item) => {
    return { value: item.id, label: item.name };
  });
  const subjectOnChange = (value) => {
    setSubjectId(value);
    setChapterId(null);
    setFormKey((prevKey) => prevKey + 1);
  };
  const chapterOnchange = (values) => {
    if (preChapter !== values) {
      setPreChapter(values);
      setFormKey((prevKey) => prevKey + 1);
    }
    setChapterId(values);
  };
  const notify = useNotify();
  const onFinish = (values) => {
    const isValid =
      values.lstQuestion &&
      values.lstQuestion.every((question, questionIndex) => {
        const isQuestionValid = question.lstAnswer.some(
          (answer) => answer.isCorrect
        );
        const updatedErrorStates = [...errorStates];
        updatedErrorStates[questionIndex] = !isQuestionValid;
        setErrorStates(updatedErrorStates);
        return isQuestionValid;
      });
    if (isValid) {
      setLoading(true);
      values.lstQuestion &&
        values.lstQuestion.length > 0 &&
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
            setFormKey((prevKey) => prevKey + 1);
          },
          (error) => {
            setLoading(false);
            notify.error("Lỗi thêm mới câu hỏi!");
          }
        );
    }
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
          <span style={{ fontWeight: 600 }}>Học phần: </span>
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
          <span style={{ fontWeight: 600 }}>Chương: </span>
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
      <Form onFinish={onFinish} name="question-form" key={formKey}>
        <Form.List name="lstQuestion">
          {(parentFields, parentListOperations) => (
            <>
              {parentFields.map((parentField, parentIndex) => (
                <div
                  key={parentIndex}
                  className="question-list"
                  name={[
                    parentField.name,
                    `fragQuetion${parentField.key}`,
                  ]}
                >
                  <div className="question-text">
                    <Form.Item
                      className="topic-Text"
                      {...parentField}
                      label={`Câu ${parentIndex + 1}:`}
                      name={[parentField.name, `content`]}
                      rules={[
                        {
                          required: true,
                          message:
                            "Chưa nhập câu hỏi!",
                        },
                      ]}
                    >
                      <ReactQuill
                        className="question-content-text"
                        theme="snow"
                        modules={modules}
                        formats={formats}
                        bounds="#root"
                        placeholder="Nhập câu hỏi..."
                      />
                    </Form.Item>
                    <Form.Item
                      {...parentField}
                      label={"Mức độ"}
                      name={[parentField.name, `level`]}
                      rules={[
                        {
                          required: true,
                          message:
                            "Chưa chọn mức độ câu hỏi!",
                        },
                      ]}
                      initialValue={"EASY"}
                    >
                      <Select
                        options={levelOption}
                        style={{ width: 120 }}
                      ></Select>
                    </Form.Item>
                    <div className="btn-remove">
                      <Button
                        type="dashed"
                        onClick={() =>
                          parentListOperations.remove(
                            parentIndex
                          )
                        }
                        icon={<DeleteOutlined />}
                      ></Button>
                    </div>
                  </div>
                  <Form.List
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
                        {childFields.map((childField, childIndex) => {
                            return (
                              <div
                                key={`${childIndex}-${parentIndex}`}
                                name={[childField.name,`frAnswers${childField.key}`,]}
                                className="answer-list"
                              >
                                <div className="answer-list-text-checkbox">
                                  <div className="answer-checkbox">
                                    <Form.Item
                                      {...childField}
                                      name={[
                                        childField.name,
                                        `isCorrect`,
                                      ]}
                                      valuePropName="checked"
                                    >
                                      <Checkbox
                                        checked={checked}
                                        onChange={onChange}
                                      />
                                    </Form.Item>
                                    <Form.Item
                                      {...childField}
                                      name={[childField.name,`content`,]}
                                      rules={[
                                        {
                                          required: true,
                                          message:
                                            "Chưa điền câu trả lời",
                                        },
                                      ]}
                                      className="answers-item"
                                    >
                                      <ReactQuill
                                        theme="snow"
                                        modules={modules}
                                        formats={formats}
                                        value={value}
                                        onChange={(value) => {setValue(value);}}
                                        bounds="#root"
                                        placeholder="Nhập câu trả lời..."
                                      />
                                    </Form.Item>
                                  </div>
                                  <div className="remove-answer">
                                    <Button
                                      type="dashed"
                                      onClick={() => childListOperations.remove(childIndex)}
                                      icon={<DeleteOutlined />}
                                    />
                                  </div>
                                </div>
                              </div>
                            );
                          }
                        )}
                        {childFields.length < 4 && (
                          <Form.Item className="add-answer-btn">
                            <Button
                              onClick={() => childListOperations.add()}
                              icon={<PlusOutlined />}
                            >
                              Thêm tùy chọn
                            </Button>
                          </Form.Item>
                        )}
                      </div>
                    )}
                  </Form.List>
                  <span
                    style={{
                      color: "red",
                      display: errorStates[parentIndex]
                        ? "block"
                        : "none",
                    }}
                  >
                    Chưa chọn đáp án đúng cho câu hỏi!
                  </span>
                </div>
              ))}
              <Form.Item className="add-question-btn">
                <Button
                  onClick={() => parentListOperations.add()}
                  icon={<PlusOutlined />}
                  disabled={chapterId === null}
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
          >
            Lưu
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddQuestions;
