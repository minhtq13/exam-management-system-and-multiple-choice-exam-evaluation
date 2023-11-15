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
import useSubjects from "../../../hooks/useSubjects";

const QuestionList = () => {
	const { getAllSubjects, allSubjects, tableLoading } = useSubjects();
	const { allQuestions, loading, getAllQuestions } = useQuestions();
	const [chapterOrders, setChapterOrders] = useState([]);
	const [chapterOptions, setChapterOptions] = useState([]);
	const [subjectCode, setSubjectCode] = useState(null);
	const [preSub, setPreSub] = useState(null);
	const notify = useNotify();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	useEffect(() => {
		getAllSubjects();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	const subjectOptions = allSubjects.map((item) => {
		return { value: item.code, label: item.description };
	});
	const getOptions = (array) => {
		let options = array
			? array.map((item) => {
					return { value: item.order, label: item.title };
			  })
			: [];
		return options ? options : [];
	};
	const tagRender = (value, color) => {
		if (value === "EASY") {
			color = "green";
		} else if (value === "MEDIUM") {
			color = "geekblue";
		} else color = "volcano";
		return color;
	};
	const subjectOnChange = (value) => {
		if (value !== preSub) {
			getAllQuestions({}, value);
		}
		if (value !== preSub) {
			setChapterOrders([]);
			setPreSub(value);
		}
		setChapterOptions(
			getOptions(
				allSubjects.find((item) => item.code === value)?.chapters
			)
		);
		setSubjectCode(value);
	};
	const chapterOnchange = (values) => {
		setChapterOrders(values);
		// setQuestionList(
		//   allQuestions.filter((item) => values.includes(item.chapter.order))
		// );
	};
	const onRemove = (id) => {
		deleteQuesionsService(
			id,
			null,
			(res) => {
				notify.success("Xoá câu hỏi thành công!");
				getAllQuestions({}, subjectCode);
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
	return (
		<div className="question-list">
			<div className="subject-chapters-top">
				<div className="test-subject">
					<span className="select-label">Học phần:</span>
					<Select
						showSearch
						placeholder="Chọn môn học để hiển thị ngân hàng câu hỏi"
						optionFilterProp="children"
						filterOption={(input, option) =>
							(option?.label ?? "").includes(input)
						}
						optionLabelProp="label"
						options={subjectOptions}
						onChange={subjectOnChange}
						loading={tableLoading}
					/>
				</div>
				<div className="test-chapters">
					<span className="select-label">Chương:</span>
					<Select
						mode="multiple"
						allowClear
						placeholder="Chọn chương để hiển thị ngân hàng câu hỏi"
						optionFilterProp="children"
						filterOption={(input, option) =>
							(option?.label ?? "").includes(input)
						}
						optionLabelProp="label"
						options={chapterOptions}
						onChange={chapterOnchange}
						value={chapterOrders}
						loading={tableLoading}
					/>
				</div>
			</div>
			<Spin spinning={loading} tip="Loading...">
				{(chapterOrders.length > 0
					? allQuestions.filter((item) =>
							chapterOrders.includes(item.chapter.order)
					  )
					: allQuestions
				).map((item, index) => {
					return (
						<div
							className="question-items"
							key={`index-${item.id}`}
						>
							<div className="topic-remove">
								<div className="topic-level">
									<div className="question-topic">{`Câu ${
										index + 1
									}: ${item.topicText}`}</div>
									<Tag color={tagRender(item.level)}>
										{item.level}
									</Tag>
								</div>
								<div className="btn-space">
									<ModalPopup
										buttonOpenModal={
											<Button icon={<DeleteOutlined />} />
										}
										title="Xóa câu hỏi"
										message="Bạn có chắc chắn muốn xóa câu hỏi này không?"
										confirmMessage={
											"Thao tác này không thể hoàn tác"
										}
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
							{item.answers &&
								item.answers.map((ans, ansNo) => {
									return (
										<div
											className={
												ans.isCorrected === "true"
													? "answer-items corrected"
													: "answer-items"
											}
											key={`answer${ansNo}`}
										>
											{`${String.fromCharCode(
												65 + ansNo
											)}. ${ans.content}`}
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
