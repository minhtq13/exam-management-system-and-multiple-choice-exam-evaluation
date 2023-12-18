import { Button, Input, List, Spin } from "antd";
import "./TestSetCreate.scss";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import { AiOutlineDownload, AiFillEye } from "react-icons/ai";
import { testSetCreateService } from "../../../services/testServices";
import useNotify from "../../../hooks/useNotify";
import TestPreview from "../../../components/TestPreview/TestPreview";
import { downloadTestPdf } from "../../../utils/tools";
import useTest from "../../../hooks/useTest";
import { HUST_COLOR } from "../../../utils/constant";

const TestSetCreate = () => {
	const { getTestSetDetail, testSetDetail, detailLoading } = useTest();
	const location = useLocation();
	const notify = useNotify();
	const testId = location.pathname.split("/")[2];
	const [testSetNum, setTestSetNum] = useState(null);
	const [isError, setIsError] = useState(false);
	const [testNos, setTestNos] = useState([]);
	const [btnLoading, setBtnLoading] = useState(false);
	const [listLoading, setListLoading] = useState(false);
	const [testNo, setTestNo] = useState(null);
	const onView = (test) => {
		getTestSetDetail({ testId: testId, code: test.testSetCode });
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
				<div className="test-set-header">Tạo bộ đề thi</div>
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
									<AiFillEye color={HUST_COLOR} />
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
				<Spin tip="Loading preview..." spinning={detailLoading}>
					{testSetDetail.lstQuestion && testSetDetail.lstQuestion.length > 0 ? (
						<TestPreview
							questions={testSetDetail.lstQuestion ? testSetDetail.lstQuestion : []}
							testDetail={testSetDetail.testSet ? testSetDetail.testSet : {}}
							testNo={testNo}
						/>
					) : (
						<div className="test-preview-test-set">
							<div>
								Nhập số lượng đề thi muốn tạo và xem trước đề
								thi ở đây.
							</div>
						</div>
					)}
				</Spin>
				<Button
					type="primary"
					htmlType="submit"
					icon={<AiOutlineDownload size={18} />}
					disabled={testSetDetail.lstQuestion && testSetDetail.lstQuestion.length < 1}
					onClick={() =>
						downloadTestPdf(testSetDetail.lstQuestion ? testSetDetail.lstQuestion : [], testSetDetail.testSet ? testSetDetail.testSet : {}, testNo)
					}
				>
					Tải xuống
				</Button>
			</div>
		</div>
	);
};
export default TestSetCreate;
