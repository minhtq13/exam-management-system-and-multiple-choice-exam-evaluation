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
const TestView = ({
	questionList,
	startTime,
	endTime,
	duration,
	totalPoint,
	name,
	subjectId,
}) => {
	const [quesIds, setQesIds] = useState([]);
	const [openModal, setOpenModal] = useState(false);
	const [loading, setLoading] = useState(false);
	const [testId, setTestId] = useState(null);
	const [numberQues, setNumberQues] = useState(0);
	const onChange = (checkValues) => {
		setQesIds(checkValues);
		setNumberQues(checkValues.length);
	};
	const navigate = useNavigate();
	const notify = useNotify();
	const onCreate = () => {
		setLoading(true);
		testService(
			{
				subjectId: subjectId,
				questionQuantity: numberQues,
				name: name,
				startTime: dayjs(startTime).format("DD/MM/YYYY HH:mm"),
				endTime: dayjs(endTime).format("DD/MM/YYYY HH:mm"),
				duration: Number(duration),
				totalPoint: Number(totalPoint),
				questionIds: quesIds,
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
							<div className="question-number">{`Câu ${
								index + 1
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
			),
			value: item.id,
		};
	});
	return (
		<div className="test-view">
			<div className="test-wrap">
				<div className="number-ques">{`Số lượng câu hỏi: ${numberQues}`}</div>
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
				open={openModal}
				title="Tạo đề thi thành công!"
				onOk={() => navigate(`${appPath.testSetCreate}/${testId}`)}
				onCancel={() => setOpenModal(false)}
			>
				<p>Bạn có muốn tạo tập đề thi không?</p>
			</Modal>
		</div>
	);
};
export default TestView;
