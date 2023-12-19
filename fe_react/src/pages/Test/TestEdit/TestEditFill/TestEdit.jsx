import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useEffect, useState } from "react";
import "./TestEdit.scss";
import { useLocation } from "react-router-dom";
import {
	testSetDetailService,
	updateTestSetService,
} from "../../../../services/testServices";
import { Button, Spin, Modal, Input, Form } from "antd";
import useNotify from "../../../../hooks/useNotify";
import { downloadTestPdf } from "../../../../utils/tools";
import TestPreview from "../../../../components/TestPreview/TestPreview";
const TestEdit = () => {
	const [editLoading, setEditLoading] = useState(false);
	const [loadingData, setLoadingData] = useState(true);
	const [openModal, setOpenModal] = useState(true);
	const [initialValues, setInitialValues] = useState([]);
	const [testDetail, setTestDetail] = useState({});
	const [idValues, setIdValues] = useState([]);
	const [openSuccessModal, setOpenSuccessModal] = useState(false);
	const [openPreModal, setOpenPreModal] = useState(false);
	const notify = useNotify();
	const location = useLocation();
	const code = location.pathname.split("/")[3];
	const testId = location.pathname.split("/")[4];
	useEffect(() => {
		if (!editLoading) {
			setLoadingData(true);
			testSetDetailService(
				{ testId: testId, code: code },
				(res) => {
					setLoadingData(false);
					setInitialValues(
						res.data.lstQuestion.length > 0
							? res.data.lstQuestion.map((item, index) => {
									return {
										questionNo: String(index + 1),
										content: item.content,
										answers:
											item.answers.length > 0
												? item.answers.map(
														(ans, ansNo) => {
															return {
																answerNo:
																	String.fromCharCode(
																		65 +
																			ansNo
																	),
																content:
																	ans.content,
															};
														}
												  )
												: [],
									};
							  })
							: []
					);
					setIdValues(
						res.data.lstQuestion.length > 0
							? res.data.lstQuestion.map((item, index) => {
									return {
										questionId: item.id,
										answers:
											item.answers.length > 0
												? item.answers.map(
														(ans, ansNo) => {
															return {
																answerId:
																	ans.answerId,
															};
														}
												  )
												: [],
									};
							  })
							: []
					);

					setTestDetail(res.data);
				},
				(error) => {
					notify.error("Lỗi!");
					setLoadingData(true);
				}
			);
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}
	}, [editLoading]);

	const convertAnsNo = (letter) => {
		const letterLowerCase = letter.toLowerCase();

		switch (letterLowerCase) {
			case "a":
				return 1;
			case "b":
				return 2;
			case "c":
				return 3;
			case "d":
				return 4;
			default:
				return null; // Trả về null cho trường hợp không khớp
		}
	};

	const onFinish = (values) => {
		setEditLoading(true);
		updateTestSetService(
			{
				testSetId: testDetail.testSet.testSetId,
				questions: idValues.map((itemA, index) => {
					const correspondingItemB = values.lstQuestion[index] || {
						answers: [],
					};

					return {
						...itemA,
						questionNo:
							Number(correspondingItemB.questionNo) || null,
						answers: itemA.answers.map((answerA, answerIndex) => ({
							...answerA,
							answerNo: correspondingItemB.answers[answerIndex]
								? convertAnsNo(
										correspondingItemB.answers[answerIndex]
											.answerNo
								  )
								: null,
						})),
					};
				}),
			},
			(res) => {
				setEditLoading(false);
				setOpenSuccessModal(true);
			},
			(error) => {
				setEditLoading(false);
				notify.error("Lỗi cập nhật đề thi!");
			}
		);
	};

	console.log(initialValues);

	return (
		<div className="test-edit">
			<div className="test-edit-header">Cập nhật đề thi</div>
			<Spin tip="Loading..." spinning={loadingData}>
				<div className="test-preview">
					{!loadingData && (
						<Form
							initialValues={{
								lstQuestion: initialValues,
							}}
							onFinish={onFinish}
							name="test-edit-form"
						>
							<Form.List name="lstQuestion">
								{(parentFields, parentListOperations) => (
									<div className="question-edit">
										{parentFields.map(
											(parentField, parentIndex) => (
												<div
													key={`fragQuestions${parentField.key}`}
													className="question-list"
													name={[
														parentField.name,
														`fragQuetion${parentField.key}`,
													]}
												>
													<div className="question-text">
														<Form.Item
															className="topic-Text"
															label="Câu số:"
															key={`questionNo${parentField.key}`}
															{...parentField}
															name={[
																parentField.name,
																`questionNo`,
															]}
															rules={[
																{
																	required: true,
																	message:
																		"Chưa nhập thứ tự câu hỏi!",
																},
															]}
														>
															<Input />
														</Form.Item>
														<Form.Item
															className="content"
															key={`content${parentField.key}`}
															{...parentField}
															name={[
																parentField.name,
																`content`,
															]}
														>
															<ReactQuill
																key={
																	parentIndex
																}
																readOnly={true}
																theme="snow"
																modules={{
																	toolbar: false,
																}}
															/>
														</Form.Item>
													</div>
													<Form.List
														key={`answers${parentField.key}`}
														{...parentField}
														name={[
															parentField.name,
															`answers`,
														]}
													>
														{(
															childFields,
															childListOperations
														) => (
															<div className="answers">
																{childFields.map(
																	(
																		childField,
																		childIndex
																	) => {
																		return (
																			<div
																				key={`frAnswers${childField.key}-${parentIndex}`}
																				name={[
																					childField.name,
																					`frAnswers${childField.key}`,
																				]}
																				className="answer-list"
																			>
																				<div className="answer-list">
																					<Form.Item
																						{...childField}
																						name={[
																							childField.name,
																							`answerNo`,
																						]}
																						key={`answerNo${childField.key}-${parentField.key}`}
																						rules={[
																							{
																								required: true,
																								message:
																									"Chưa nhập thứ tự câu trả lời!",
																							},
																						]}
																						className="answer-item"
																					>
																						<Input></Input>
																					</Form.Item>
																					<Form.Item
																						{...childField}
																						name={[
																							childField.name,
																							`content`,
																						]}
																						key={`content${childField.key}-${parentField.key}`}
																						className="answers-item"
																					>
																						<ReactQuill
																							key={
																								childIndex
																							}
																							readOnly={
																								true
																							}
																							theme="snow"
																							modules={{
																								toolbar: false,
																							}}
																						/>
																					</Form.Item>
																				</div>
																			</div>
																		);
																	}
																)}
															</div>
														)}
													</Form.List>
												</div>
											)
										)}
									</div>
								)}
							</Form.List>
							<Form.Item className="add-btn">
								<Button
									type="primary"
									htmlType="submit"
									loading={editLoading}
									style={{ width: 80, height: 40 }}
								>
									Lưu
								</Button>
							</Form.Item>
						</Form>
					)}
				</div>
			</Spin>
			<Modal
				open={openModal}
				title="Hướng dẫn"
				onOk={() => setOpenModal(false)}
				onCancel={() => setOpenModal(false)}
				okText="Đã hiểu"
				centered={true}
			>
				<p>
					Vui lòng điền số thứ tự câu hỏi và câu trả lời vào ô nhập
					liệu!
				</p>
			</Modal>
			<Modal
				open={openSuccessModal}
				title="Sửa đề thi thành công!"
				okText="Xem đề thi"
				onOk={() => setOpenPreModal(true)}
				onCancel={() => setOpenSuccessModal(false)}
				cancelText="Đóng"
				centered={true}
			>
				<p>Bạn đã sửa đề thi thành công!</p>
			</Modal>
			<Modal
				className="test-edit-preview"
				open={openPreModal}
				okText="Tải xuống"
				onOk={() =>
					downloadTestPdf(
						testDetail.lstQuestion,
						testDetail.testSet,
						code
					)
				}
				onCancel={() => setOpenPreModal(false)}
				cancelText="Đóng"
				centered={true}
			>
				<Spin tip="Loading..." spinning={loadingData}>
					<TestPreview
						questions={testDetail.lstQuestion}
						testDetail={testDetail.testSet}
						testNo={code}
					/>
				</Spin>
			</Modal>
		</div>
	);
};
export default TestEdit;
