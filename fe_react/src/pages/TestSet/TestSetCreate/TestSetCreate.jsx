import { Button, Input, List, Spin } from "antd";
import "./TestSetCreate.scss";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import { AiOutlineDownload, AiFillEye } from "react-icons/ai";
import {
	testSetCreateService,
	testSetDetailService,
} from "../../../services/testServices";
import useNotify from "../../../hooks/useNotify";
import TestPreview from "../../../components/TestPreview/TestPreview";
import useImportExport from "../../../hooks/useImportExport";

const TestSetCreate = () => {
	const location = useLocation();
	const notify = useNotify();
	const testId = location.pathname.split("/")[2];
	const { loading, exportTestList } = useImportExport();
	const [testSetNum, setTestSetNum] = useState(null);
	const [isError, setIsError] = useState(false);
	const [testNos, setTestNos] = useState([]);
	const [btnLoading, setBtnLoading] = useState(false);
	const [listLoading, setListLoading] = useState(false);
	const [viewLoading, setViewLoading] = useState(false);
	const [questions, setQuestions] = useState([]);
	const [testDetail, setTestDetail] = useState({});
	const [testNo, setTestNo] = useState(null);
	const [buttonDisable, setButtonDisable] = useState(true);
	const onView = (test) => {
		setViewLoading(true);
		testSetDetailService(
			{ testId: testId, code: test.testSetCode },
			(res) => {
				setQuestions(res.data.lstQuestion);
				setTestDetail(res.data.testSet);
				setViewLoading(false);
				setButtonDisable(false);
			},
			(error) => {
				notify.error("Lỗi!");
				setViewLoading(true);
				setButtonDisable(true);
			}
		);
	};
	const handleExport = () => {
		exportTestList(
			{
				testId: testDetail.testId,
				code: testDetail.testSetCode,
			},
			`${testDetail.subjectCode}-${testDetail.semester}`
		);
	};
	const onCreate = () => {
		if (!testSetNum) {
			setIsError(true);
		} else {
			setBtnLoading(true);
			setListLoading(true);
			testSetCreateService(
				{ testId: testId, numOfTestSet: testSetNum },
				(res) => {
					notify.success("Tạo bộ đề thi thành công!");
					setTestNos(res.data);
					setBtnLoading(false);
					setListLoading(false);
				},
				(error) => {
					notify.error("Lỗi tạo bộ đề thi!");
					setBtnLoading(false);
					setListLoading(true);
				}
			);
		}
	};
	return (
		<div className="test-set-create">
			<div className="test-set-left">
				<div className="test-set-header">Test set create</div>
				<div className="test-set-quantity">
					<div className="test-set-input">
						<span>Số lượng đề:</span>
						<Input
							type="number"
							placeholder="Nhập số lượng đề thi"
							value={testSetNum}
							onChange={(e) => {
								if (!e.target.value) {
									setIsError(false);
								} else {
									setIsError(false);
								}
								setTestSetNum(e.target.value);
							}}
						/>
					</div>
					{isError && (
						<span className="is-error">
							Please enter the number of test set !
						</span>
					)}
				</div>
				<Button
					type="primary"
					htmlType="submit"
					onClick={onCreate}
					style={{ width: 80, height: 40 }}
					loading={btnLoading}
				>
					Tạo
				</Button>
				<List
					header={"Danh sách mã đề"}
					itemLayout="horizontal"
					className="test-set-list"
					dataSource={testNos}
					loading={listLoading}
					renderItem={(item) => (
						<List.Item
							actions={[
								<div
									key="list-view"
									className="preview"
									onClick={() => {
										onView(item);
										setTestNo(item.testSetCode);
									}}
								>
									<div className="preview-text">Preview</div>
									<AiFillEye color="#8c1515" />
								</div>,
							]}
						>
							<List.Item.Meta
								title={`Mã đề thi: ${item.testSetCode}`}
							></List.Item.Meta>
						</List.Item>
					)}
				/>
			</div>
			<div className="test-set-right">
				<Spin tip="Loading preview..." spinning={viewLoading}>
					{questions.length > 0 ? (
						<TestPreview
							questions={questions}
							testDetail={testDetail}
							testNo={testNo}
						/>
					) : (
						<div className="test-preview">Test Preview</div>
					)}
				</Spin>
				<Button
					type="primary"
					htmlType="submit"
					disabled={buttonDisable}
					icon={<AiOutlineDownload size={18} />}
					onClick={() => handleExport()}
					loading={loading}
				>
					Download
				</Button>
			</div>
		</div>
	);
};
export default TestSetCreate;
