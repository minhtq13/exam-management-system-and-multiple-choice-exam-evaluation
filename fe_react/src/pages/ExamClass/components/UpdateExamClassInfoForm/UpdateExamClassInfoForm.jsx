import {
	DatePicker,
	Form,
	Input,
	Select,
	Button,
	Modal,
	Space,
	Table,
	Spin,
	Popover,
} from "antd";
import "./UpdateExamClassInfoForm.scss";
import React, { useEffect, useState } from "react";
import useCombo from "../../../../hooks/useCombo";
import useTest from "../../../../hooks/useTest";
import useNotify from "../../../../hooks/useNotify";
import { testSetDetailService } from "../../../../services/testServices";
import TestPreview from "../../../../components/TestPreview/TestPreview";
const UpdateExamClassInfoForm = ({
	onFinish,
	initialValues,
	infoHeader,
	btnText,
	loading,
	onSelectTestId,
}) => {
	const {
		allSemester,
		semesterLoading,
		getAllSemesters,
		subLoading,
		allSubjects,
		getAllSubjects,
		allTeacher,
		allStudent,
		studentLoading,
		teacherLoading,
		getAllStudent,
		getAllTeacher,
	} = useCombo();
	const { allTest, getAllTests, tableLoading, pagination } = useTest();
	const initialParam = {
		subjectId: initialValues.subjectId ?? null,
		semesterId: initialValues.semesterId ?? null,
		page: 0,
		size: 10,
	};
	const [param, setParam] = useState(initialParam);
	const [openModal, setOpenModal] = useState(false);
	const [testValue, setTestValue] = useState("");
	const [testNo, setTestNo] = useState(null);
	const [viewLoading, setViewLoading] = useState(false);
	const [questions, setQuestions] = useState([]);
	const [testDetail, setTestDetail] = useState({});
	const [openModalPreview, setOpenModalPreview] = useState(false);
	const notify = useNotify();
	const errorMessange = "Chưa điền đầy đủ thông tin";
	useEffect(() => {
		getAllSemesters({ search: "" });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	useEffect(() => {
		getAllSubjects({ subjectCode: null, subjectTitle: null });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	useEffect(() => {
		getAllTeacher({ teacherName: null, teacherCode: null });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	useEffect(() => {
		getAllStudent({ studentName: null, studentCode: null });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	useEffect(() => {
		if (openModal) {
			getAllTests(param);
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [param, openModal]);
	// eslint-disable-next-line
	const getOptions = (array, codeShow) => {
		return array && array.length > 0
			? array.map((item) => {
					return {
						value: item.id,
						label: codeShow
							? `${item.name} - ${item.code} `
							: item.name,
					};
			  })
			: [];
	};

	const columns = [
		{
			title: "Học phần",
			dataIndex: "subjectName",
			key: "subjectName",
		},
		{
			title: "Số câu hỏi",
			dataIndex: "questionQuantity",
			key: "questionQuantity",
		},
		Table.EXPAND_COLUMN,
		{
			title: "Số bộ đề",
			dataIndex: "testSet",
			key: "testSet",
		},
		{
			title: "Thời gian làm bài",
			dataIndex: "duration",
			key: "duration",
		},
		{
			title: "Thao tác",
			key: "action",
			render: (_, record) => (
				<>
					<Space size="middle" style={{ cursor: "pointer" }}>
						<Button
							onClick={() => {
								setTestValue(
									`${record.name} - ${record.questionQuantity} (câu) - ${record.duration} (phút) - ${record.testSet} (mã đề)`
								);
								setOpenModal(false);
								onSelectTestId(record.id);
							}}
						>
							Chọn
						</Button>
					</Space>
				</>
			),
		},
	];
	const handleView = (record, code) => {
		setTestNo(code);
		setOpenModalPreview(true);
		setViewLoading(true);
		testSetDetailService(
			{ testId: record.id, code: code },
			(res) => {
				setViewLoading(false);
				setQuestions(res.data.lstQuestion);
				setTestDetail(res.data.testSet);
			},
			(error) => {
				notify.error("Lỗi!");
				setViewLoading(true);
			}
		);
	};
	const dataFetch = allTest?.map((obj, index) => ({
		name: obj.name,
		key: (index + 1).toString(),
		questionQuantity: obj.questionQuantity,
		subjectName: obj.subjectName,
		duration: obj.duration,
		id: obj.id,
		testSetNos: obj.testSetNos,
		lstTestSetCode: obj.lstTestSetCode,
		testSet:
			obj.lstTestSetCode && obj.lstTestSetCode.length > 0
				? obj.lstTestSetCode.split(",").length
				: 0,
	}));
	return (
		<div className="exam-class-info">
			<p className="info-header">{infoHeader}</p>
			<Form
				name="info-exam-class-form"
				className="info-exam-class-form"
				initialValues={initialValues}
				onFinish={onFinish}
			>
				<div className="info-exam-class-header">Thông tin lớp thi</div>
				<Form.Item
					name="code"
					label="Mã lớp thi"
					colon={true}
					rules={[
						{
							required: true,
							message: errorMessange,
						},
					]}
				>
					<Input placeholder="Nhập mã lớp thi" />
				</Form.Item>
				<Form.Item
					name="roomName"
					label="Phòng thi"
					colon={true}
					rules={[
						{
							required: true,
							message: errorMessange,
						},
					]}
				>
					<Input placeholder="Vui lòng nhập phòng thi" />
				</Form.Item>
				<Form.Item
					name="semesterId"
					label="Kỳ thi"
					rules={[{ required: true, message: "Chưa chọn kỳ thi" }]}
				>
					<Select
						loading={semesterLoading}
						placeholder="Chọn kỳ thi"
						options={getOptions(allSemester, false)}
						style={{ height: 45 }}
						onChange={(value) =>
							setParam({ ...param, semesterId: value })
						}
					/>
				</Form.Item>
				<Form.Item name="lstStudentId" label="Học sinh">
					<Select
						className="exam-class-students"
						mode="multiple"
						showSearch
						allowClear
						loading={studentLoading}
						placeholder="Chọn học sinh"
						filterOption={(input, option) =>
							(option?.label.toLowerCase() ?? "").includes(
								input.toLowerCase()
							)
						}
						options={getOptions(allStudent, true)}
					/>
				</Form.Item>
				<Form.Item name="lstSupervisorId" label="Giám thị">
					<Select
						className="exam-class-teachers"
						mode="multiple"
						showSearch
						allowClear
						loading={teacherLoading}
						filterOption={(input, option) =>
							(option?.label.toLowerCase() ?? "").includes(
								input.toLowerCase()
							)
						}
						placeholder="Chọn giám thị"
						options={getOptions(allTeacher, true)}
					/>
				</Form.Item>
				<Form.Item
					name="subjectId"
					colon={true}
					label="Môn thi"
					rules={[
						{
							required: true,
							message: "Chưa chọn môn thi",
						},
					]}
				>
					<Select
						placeholder="Chọn môn thi"
						loading={subLoading}
						options={getOptions(allSubjects)}
						style={{ height: 45 }}
						onChange={(value) =>
							setParam({ ...param, subjectId: value })
						}
					></Select>
				</Form.Item>
				<Form.Item
					name="examineTime"
					colon={true}
					label="Thời gian thi"
					rules={[
						{
							required: true,
							message: "Chưa chọn thời gian thi",
						},
					]}
				>
					<DatePicker
						format={"YYYY-MM-DD HH:mm:ss"}
						showTime={{ format: "HH:mm:ss" }}
					></DatePicker>
				</Form.Item>
				<Form.Item
					name="code"
					label="Đề thi"
					colon={true}
					rules={[
						{
							required: true,
							message: errorMessange,
						},
					]}
				>
					<div className="test-select">
						<Popover
							content={testValue}
							placement="bottom"
							trigger="hover"
						>
							<Input
								placeholder="Chọn đề thi"
								value={testValue}
							/>
						</Popover>

						<Button onClick={() => setOpenModal(true)}>Chọn</Button>
					</div>
				</Form.Item>
				<Form.Item className="btn-info">
					<Button
						type="primary"
						htmlType="submit"
						block
						loading={loading}
						style={{ width: 150, height: 50 }}
					>
						{btnText}
					</Button>
				</Form.Item>
			</Form>
			<Modal
				className="exam-class-test-modal"
				open={openModal}
				title="Danh sách đề thi"
				onOk={() => setOpenModal(false)}
				onCancel={() => setOpenModal(false)}
				maskClosable={true}
				style={{ height: "80vh", overflowY: "scroll", width: "80vw" }}
				centered={true}
			>
				<Table
					className="test-list-table"
					columns={columns}
					dataSource={dataFetch}
					loading={tableLoading}
					expandable={{
						expandedRowRender: (record) => (
							<div className="test-set-item-examclass">
								<span className="test-set-no-label">
									Mã đề:
								</span>
								<div className="test-set-no-examclass">
									{record.lstTestSetCode &&
										record.lstTestSetCode
											.split(",")
											.map((item, index) => {
												return (
													<Button
														key={index}
														onClick={() => {
															setOpenModalPreview(
																true
															);
															handleView(
																record,
																item
															);
														}}
													>
														{item}
													</Button>
												);
											})}
								</div>
							</div>
						),
					}}
					pagination={{
						current: pagination.current,
						total: pagination.total,
						pageSize: pagination.pageSize,
						showSizeChanger: true,
						pageSizeOptions: ["10", "20", "50", "100"],
						showQuickJumper: true,
						showTotal: (total, range) => (
							<span>
								<strong>
									{range[0]}-{range[1]}
								</strong>{" "}
								of <strong>{total}</strong> items
							</span>
						),
						onChange: (page, pageSize) => {
							setParam({
								...param,
								page: page - 1,
								size: pageSize,
							});
						},
						onShowSizeChange: (current, size) => {
							setParam({
								...param,
								size: size,
							});
						},
					}}
				/>
			</Modal>
			<Modal
				open={openModalPreview}
				okText="OK"
				onOk={() => setOpenModalPreview(false)}
				onCancel={() => setOpenModalPreview(false)}
				maskClosable={true}
				centered={true}
				style={{
					height: "80vh",
					width: "70vw",
					overflowY: "scroll",
				}}
				width={"40vw"}
			>
				<Spin tip="Loading..." spinning={viewLoading}>
					<TestPreview
						questions={questions}
						testDetail={testDetail}
						testNo={testNo}
					/>
				</Spin>
			</Modal>
		</div>
	);
};
export default UpdateExamClassInfoForm;
