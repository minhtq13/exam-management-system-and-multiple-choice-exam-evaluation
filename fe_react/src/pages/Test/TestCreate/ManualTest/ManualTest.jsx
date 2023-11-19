import { DatePicker, Input, Spin } from "antd";
import "./ManualTest.scss";
import { useState } from "react";
import TestView from "./TestView/TestView";

const ManualTest = ({ questionList, chapterIds, subjectId }) => {
  const [startTime, setStartTime] = useState(null);
	const [name, setName] = useState("");
  const [endTime, setEndTime] = useState(null);
  const [duration, setDuration] = useState(null);
  const [totalPoint, setTotalPoint] = useState(null);
  return (
    <div className="manual-test">
      <div className="manual-select">
				<div className="manual-item">
					<span>Tên kỳ thi:</span>
					<Input placeholder="Nhập tên kỳ thi" onChange={e => setName(e.target.value)}/>
				</div>
        <div className="manual-item manual-date">
          <span>Thời gian bắt đầu:</span>
          <DatePicker
            format={"YYYY-MM-DD HH:mm"}
						showTime={{format: "HH:mm"}}
            onChange={(value) => setStartTime(value)}
          ></DatePicker>
        </div>
        <div className="manual-item manual-time">
          <span>Thời gian kết thúc:</span>
          <DatePicker
            format={"YYYY-MM-DD HH:mm"}
						showTime={{format: "HH:mm"}}
            onChange={(value) => setEndTime(value)}
          ></DatePicker>
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
        <Spin tip="Loading..." spinning={false}>
          <TestView
            questionList={questionList}
            testDay={startTime}
            testTime={endTime}
            duration={duration}
            totalPoint={totalPoint}
						name={name}
						subjectId={subjectId}
          />
        </Spin>
      </div>
    </div>
  );
};
export default ManualTest;
