/* eslint-disable no-unused-vars */
import { Button, Checkbox, Form, Select, Skeleton } from "antd";
import "./QuestionEdit.scss";
import { useEffect, useState } from "react";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { updateQuesionsService } from "../../../services/questionServices";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import ImageResize from "quill-image-resize-module-react";
import useNotify from "../../../hooks/useNotify";
import useQuestions from "../../../hooks/useQuestion";
import useCombo from "../../../hooks/useCombo";

Quill.register("modules/imageResize", ImageResize);
const QuestionEdit = () => {
	const navigate = useNavigate();
	const { getQuestionDetail, questionInfo, infoLoading } = useQuestions();
	const [checked, setChecked] = useState(false);
	const [chapterId, setChapterId] = useState(null);
	const [subjectId, setSubjectId] = useState(null);
	const [isFirstMount, setIsFirstMount] = useState(true);
	const {
		chapterLoading,
		subLoading,
		allChapters,
		allSubjects,
		getAllChapters,
		getAllSubjects,
	} = useCombo();
	const location = useLocation();
	const notify = useNotify();
	const questionId = location.pathname.split("/")[2];
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
		getQuestionDetail({}, questionId);
		// eslint-disable-next-line
	}, []);
	useEffect(() => {
		getAllSubjects({ subjectCode: null, subjectTitle: null });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	useEffect(() => {
		if (!infoLoading) {
			getAllChapters({
				subjectId: subjectId ?? questionInfo.subjectId,
				chapterCode: null,
				chapterId: null,
			});
			if (isFirstMount) {
				setChapterId(questionInfo.chapterId);
			}
			setIsFirstMount(false);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [subjectId, infoLoading]);
	const subjectOptions = allSubjects.map((item) => {
		return { value: item.id, label: item.name };
	});
	const chapterOptions = allChapters.map((item) => {
		return { value: item.id, label: item.name };
	});
	const subjectOnChange = (value) => {
		setSubjectId(value);
		setChapterId(null);
	};
	const chapterOnchange = (value) => {
		setChapterId(value);
	};
	const sentLevel = (level) => {
		let levelParam = "EASY";
		if (level === 1) {
			levelParam = "MEDIUM";
		}
		if (level === 2) {
			levelParam = "HARD";
		}
		return levelParam;
	};
	const levelOption = [
		{
			value: 0,
			label: "Dễ",
		},
		{
			value: 1,
			label: "Trung bình",
		},
		{
			value: 2,
			label: "Khó",
		},
	];
	const onChange = (checkValues) => {
		setChecked(checkValues.target.checked);
	};
	const onFinish = (values) => {
		updateQuesionsService(
			questionId,
			{ ...values, chapterId: chapterId, level: sentLevel(values.level) },
			(res) => {
				notify.success("Cập nhật câu hỏi thành công!");
				navigate("/question-list")
			},
			(error) => {
				notify.error("Lỗi cập nhật câu hỏi!");
			}
		);
	};
	return (
		<Skeleton active loading={infoLoading}>
			<div className="question-edit">
				<div className="question-edit-title">Question Edit</div>
				<div className="question-subject-chapter">
					<div className="question-subject">
						<span className="question-select-title">
							Học phần:{" "}
						</span>
						<Select
							showSearch
							placeholder="Select a subject"
							optionFilterProp="children"
							filterOption={(input, option) =>
								(option?.label ?? "").includes(input)
							}
							defaultValue={questionInfo.subjectId}
							optionLabelProp="label"
							options={subjectOptions}
							onChange={subjectOnChange}
							loading={subLoading}
						/>
					</div>
					<div className="question-subject question-chapter">
						<span className="question-select-title">Chương: </span>
						<Select
							showSearch
							placeholder="Select a chapter"
							value={chapterId}
							optionFilterProp="children"
							filterOption={(input, option) =>
								(option?.label ?? "").includes(input)
							}
							optionLabelProp="label"
							options={chapterOptions}
							onChange={chapterOnchange}
							loading={chapterLoading || infoLoading}
						/>
					</div>
				</div>
				<Form
					name="question-edit"
					className="question-form"
					onFinish={onFinish}
					initialValues={{
						content: questionInfo.content,
						lstAnswer: questionInfo.lstAnswer
							? questionInfo.lstAnswer
							: [],
						level: questionInfo.level,
					}}
				>
					<div className="topicText-level">
						<Form.Item
							className="topic-text"
							label="Câu hỏi: "
							name="content"
							rules={[
								{
									required: true,
									message: "Chưa nhập câu hỏi!",
								},
							]}
						>
							<ReactQuill
								theme="snow"
								modules={modules}
								formats={formats}
								bounds="#root"
								placeholder="Nhập câu hỏi..."
							/>
						</Form.Item>
						<Form.Item
							className="level"
							label="Mức độ"
							name="level"
							rules={[
								{
									required: true,
									message: "Chưa chọn mức độ!",
								},
							]}
						>
							<Select
								placeholder="Chọn mức độ"
								options={levelOption}
								style={{ height: 45 }}
							></Select>
						</Form.Item>
					</div>
					<Form.List name={"lstAnswer"}>
						{(childFields, childListOperations) => (
							<div className="answers">
								{childFields.map((childField, childIndex) => (
									<div
										key={`frAnswers${childIndex}`}
										name={[
											childField.name,
											`frAnswers${childIndex}`,
										]}
										className="answer-list"
									>
										<div className="answer-list-text-checkbox">
											<Form.Item
												{...childField}
												name={[
													childField.name,
													`isCorrect`,
												]}
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
												name={[
													childField.name,
													`content`,
												]}
												key={`content${childIndex}`}
												rules={[
													{
														required: true,
														message:
															"Chưa nhập câu trả lời!",
													},
												]}
												className="answers-item"
											>
												<ReactQuill
													theme="snow"
													modules={modules}
													formats={formats}
													bounds="#root"
													placeholder="Nhập câu trả lời..."
												/>
											</Form.Item>
											<Button
												type="dashed"
												onClick={() =>
													childListOperations.remove(
														childIndex
													)
												}
												icon={<DeleteOutlined />}
											/>
										</div>
									</div>
								))}
								{childFields.length < 4 && (
									<Form.Item className="add-answer-btn">
										<Button
											onClick={() =>
												childListOperations.add()
											}
											icon={<PlusOutlined />}
										>
											Thêm tùy chọn
										</Button>
									</Form.Item>
								)}
							</div>
						)}
					</Form.List>
					<Form.Item>
						<Button
							type="primary"
							htmlType="submit"
							style={{ width: 100, height: 40 }}
						>
							Lưu
						</Button>
					</Form.Item>
				</Form>
			</div>
		</Skeleton>
	);
};
export default QuestionEdit;
