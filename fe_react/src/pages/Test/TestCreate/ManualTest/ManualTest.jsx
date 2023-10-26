import { DatePicker, TimePicker, Input, Spin } from "antd";
import "./ManualTest.scss";
import { useState } from "react";
import TestView from "./TestView/TestView";

const ManualTest = ({ loading, questionList, chapterOrders }) => {
	const [testDay, setTestDay] = useState(null);
	const [testTime, setTestTime] = useState(null);
	const [duration, setDuration] = useState(null);
	const [totalPoint, setTotalPoint] = useState(null);
	return (
		<div className="manual-test">
			<div className="manual-select">
				<div className="manual-item manual-date">
					<span>Ngày thi:</span>
					<DatePicker
						format={"YYYY-MM-DD"}
						onChange={(value) => setTestDay(value)}
					></DatePicker>
				</div>
				<div className="manual-item manual-time">
					<span>Giờ thi:</span>
					<TimePicker
						format={"HH:mm"}
						onChange={(value) => setTestTime(value)}
					></TimePicker>
				</div>
				<div className="manual-item manual-duration">
					<span>Duration: </span>
					<Input
						type="number"
						placeholder="Nhập thời gian thi"
						onChange={(_e) => setDuration(_e.target.value)}
					/>
				</div>
				<div className="manual-item manual-totalPoint">
					<span>Điểm: </span>
					<Input
						type="number"
						placeholder="Nhập tổng điểm bài thi"
						onChange={(_e) => setTotalPoint(_e.target.value)}
					/>
				</div>
			</div>
			<div className="test-re-view">
				<Spin tip="Loading..." spinning={loading}>
					<TestView
						questionList={questionList}
						testDay={testDay}
						testTime={testTime}
						duration={duration}
						totalPoint={totalPoint}
					/>
				</Spin>
			</div>
		</div>
	);
};
export default ManualTest;
