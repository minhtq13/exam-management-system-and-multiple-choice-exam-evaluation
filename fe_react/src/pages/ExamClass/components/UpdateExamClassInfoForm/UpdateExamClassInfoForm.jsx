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
import { SearchOutlined } from "@ant-design/icons";
import "./UpdateExamClassInfoForm.scss";
import React, { useEffect, useState, useRef } from "react";
import useCombo from "../../../../hooks/useCombo";
import useTest from "../../../../hooks/useTest";
import useNotify from "../../../../hooks/useNotify";
import { testSetDetailService } from "../../../../services/testServices";
import TestPreview from "../../../../components/TestPreview/TestPreview";
import useTeachers from "../../../../hooks/useTeachers";
import useStudents from "../../../../hooks/useStudents";
const UpdateExamClassInfoForm = ({
	onFinish,
	initialValues,
	infoHeader,
	btnText,
	loading,
	onSelectTestId,
	onSelectStudents,
	onSelectTeachers,
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
	const {
		allTeachers,
		getAllTeachers,
		tableTeacherLoading,
		paginationTeacher,
	} = useTeachers();
	const {
		allStudents,
		getAllStudents,
		tableStudentLoading,
		paginationStudent,
	} = useStudents();
	const studentParamInit = {
		name: null,
		code: null,
		page: 0,
		size: 10,
		courseNum: null,
		sort: "lastModifiedAt",
	};
	const teacherParamInit = {
		name: null,
		code: null,
		page: 0,
		size: 10,
		sort: "lastModifiedAt",
	};
	const { allTest, getAllTests, tableLoading, pagination } = useTest();
	const initialParam = {
		subjectId: initialValues.subjectId ?? null,
		semesterId: initialValues.semesterId ?? null,
		page: 0,
		size: 10,
	};
	const [studentParam, setStudentParam] = useState(studentParamInit);
	const [teacherParam, setTeacherParam] = useState(teacherParamInit);
	const [param, setParam] = useState(initialParam);
	const [openModal, setOpenModal] = useState(false);
	const [testValue, setTestValue] = useState("");
	const [testNo, setTestNo] = useState(null);
	const [viewLoading, setViewLoading] = useState(false);
	const [questions, setQuestions] = useState([]);
	const [testDetail, setTestDetail] = useState({});
	const [openModalPreview, setOpenModalPreview] = useState(false);
	const [openStudentModal, setOpenStudentModal] = useState(false);
	const [openTeacherModal, setOpenTeacherModal] = useState(false);
	const [studentSelected, setStudentSelected] = useState([]);
	const [teacherSelected, setTeacherSelected] = useState([]);
	const notify = useNotify();
	const searchInput = useRef(null);
	const errorMessange = "Chưa điền đầy đủ thông tin";
	useEffect(() => {
		if (openTeacherModal) {
			getAllTeachers(teacherParam);
		}
	}, [teacherParam, openTeacherModal]);
	useEffect(() => {
		if (openStudentModal) {
			getAllStudents(studentParam);
		}
	}, [studentParam, openStudentModal]);
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
	// const handleReset = (clearFilters) => {
	// 	clearFilters();
	// };
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
	const getColumnSearchProps = (
		dataIndex,
		onSearch,
		handleReset,
		param,
		initParam
	) => ({
		filterDropdown: ({
			setSelectedKeys,
			selectedKeys,
			confirm,
			clearFilters,
			close,
		}) => (
			<div
				style={{
					padding: 8,
				}}
				onKeyDown={(e) => e.stopPropagation()}
			>
				<Input
					ref={searchInput}
					placeholder={`Search ${dataIndex}`}
					value={selectedKeys[0]}
					onChange={(e) => {
						setSelectedKeys(e.target.value ? [e.target.value] : []);
						handleReset({
							...param,
							[dataIndex]: e.target.value,
							page: 0,
						});
					}}
					onPressEnter={() => onSearch(param)}
					style={{
						marginBottom: 8,
						display: "block",
					}}
				/>
				<Space>
					<Button
						type="primary"
						onClick={() => onSearch({ ...param, page: 0 })}
						icon={<SearchOutlined />}
						size="small"
						style={{
							width: 90,
						}}
					>
						Tìm kiếm
					</Button>
					<Button
						onClick={() => {
							clearFilters && handleReset(clearFilters);
							handleReset(initParam);
						}}
						size="small"
						style={{
							width: 90,
						}}
					>
						Đặt lại
					</Button>
					<Button
						type="link"
						size="small"
						onClick={() => {
							close();
						}}
					>
						Đóng
					</Button>
				</Space>
			</div>
		),
		filterIcon: (filtered) => (
			<SearchOutlined
				style={{
					color: filtered ? "#1677ff" : undefined,
				}}
			/>
		),
		onFilter: (value, record) =>
			record[dataIndex]
				.toString()
				.toLowerCase()
				.includes(value.toLowerCase()),
		onFilterDropdownOpenChange: (visible) => {
			if (visible) {
				setTimeout(() => searchInput.current?.select(), 100);
			}
		},
	});
	const teacherColumns = [
		{
			title: "Mã cán bộ",
			dataIndex: "code",
			key: "code",
			...getColumnSearchProps(
				"code",
				getAllTeachers,
				setTeacherParam,
				teacherParam,
				teacherParamInit
			),
		},
		{
			title: "Họ tên",
			dataIndex: "name",
			key: "name",
			...getColumnSearchProps(
				"name",
				getAllTeachers,
				setTeacherParam,
				teacherParam,
				teacherParamInit
			),
		},
		{
			title: "Email",
			dataIndex: "email",
			key: "email",
		},
	];

	const studentColumns = [
		{
			title: "MSSV",
			dataIndex: "code",
			key: "code",
			...getColumnSearchProps(
				"code",
				getAllStudents,
				setStudentParam,
				studentParam,
				studentParamInit
			),
		},
		{
			title: "Họ tên",
			dataIndex: "name",
			key: "name",
			// eslint-disable-next-line jsx-a11y/anchor-is-valid
			render: (text) => <a>{text}</a>,
			...getColumnSearchProps(
				"name",
				getAllStudents,
				setStudentParam,
				studentParam,
				studentParamInit
			),
		},
		{
			title: "Khóa",
			dataIndex: "courseNum",
			key: "courseNum",
			filters: [
				{
					text: "64",
					value: 64,
				},
				{
					text: "65",
					value: 65,
				},
				{
					text: "66",
					value: 66,
				},
				{
					text: "67",
					value: 67,
				},
				{
					text: "68",
					value: 68,
				},
			],
			onFilter: (value, record) => {
				return record.courseNum === value;
			},
		},
		{
			title: "Email",
			dataIndex: "email",
			key: "email",
		},
	];

	const columns = [
		{
			title: "Học phần",
			dataIndex: "subjectName",
			key: "subjectName",
		},
		{
			title: "Học kỳ",
			dataIndex: "semester",
			key: "semester",
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
	const studentSelectChange = (newSelectedRowKeys) => {
		setStudentSelected(newSelectedRowKeys);
		onSelectStudents(newSelectedRowKeys);
		console.log(newSelectedRowKeys);
		console.log(studentSelected);
	}
	const rowStudentSelection = {
		studentSelected,
		onChange: studentSelectChange,
		selections: [Table.SELECTION_ALL],
	};
	const teacherSelectChange = (newSelectedRowKeys) => {
		setTeacherSelected([...newSelectedRowKeys]);
		onSelectTeachers([...newSelectedRowKeys]);
	}
	const rowTeacherSelection = {
		teacherSelected,
		onChange: teacherSelectChange,
		selections: [Table.SELECTION_ALL],
	};
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
	const studentOnchange = (values) => {
		setStudentSelected(values)
		onSelectStudents(values)
	}
	const teacherOnchange = (values) => {
		setStudentSelected(values)
		onSelectTeachers(values)
	}
	const dataFetch = allTest?.map((obj, index) => ({
		name: obj.name,
		key: (index + 1).toString(),
		questionQuantity: obj.questionQuantity,
		subjectName: obj.subjectName,
		duration: obj.duration,
		id: obj.id,
		semester: obj.semester,
		testSetNos: obj.testSetNos,
		lstTestSetCode: obj.lstTestSetCode,
		testSet:
			obj.lstTestSetCode && obj.lstTestSetCode.length > 0
				? obj.lstTestSetCode.split(",").length
				: 0,
	}));
	const studentList = allStudents.map((obj, index) => ({
		key: obj.id,
		name: obj.lastName + " " + obj.firstName,
		email: obj.email,
		code: obj.code,
		id: obj.id,
		courseNum: obj.courseNum,
	}));
	const teacherList = allTeachers.map((obj, index) => ({
		key: obj.id,
		name: obj.lastName + " " + obj.firstName,
		email: obj.email,
		code: obj.code,
		id: obj.id,
	}));
	console.log("st", studentSelected);
	console.log("te", teacherSelected);
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
						key={JSON.stringify(studentSelected)}
						open={false}
						className="exam-class-students"
						mode="multiple"
						showSearch
						allowClear
						loading={studentLoading}
						placeholder="Chọn học sinh"
						onChange={studentOnchange}
						onClick={() => setOpenStudentModal(true)}
						filterOption={(input, option) =>
							(option?.label.toLowerCase() ?? "").includes(
								input.toLowerCase()
							)
						}
						defaultValue={studentSelected}
						options={getOptions(allStudent, true)}
					/>
				</Form.Item>
				<Form.Item name="lstSupervisorId" label="Giám thị">
					<Select
						key={JSON.stringify(teacherSelected)}
						open={false}
						className="exam-class-teachers"
						mode="multiple"
						showSearch
						allowClear
						onChange={teacherOnchange}
						loading={teacherLoading}
						filterOption={(input, option) =>
							(option?.label.toLowerCase() ?? "").includes(
								input.toLowerCase()
							)
						}
						onClick={() => setOpenTeacherModal(true)}
						defaultValue={teacherSelected}
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
				className="exam-class-test-modal"
				open={openStudentModal}
				title="Danh sách học sinh"
				onOk={() => setOpenStudentModal(false)}
				onCancel={() => setOpenStudentModal(false)}
				maskClosable={true}
				centered={true}
			>
				<Table
					className="student-list-table"
					columns={studentColumns}
					dataSource={studentList}
					rowSelection={rowStudentSelection}
					loading={tableStudentLoading}
					pagination={{
						current: paginationStudent.current,
						total: paginationStudent.total,
						pageSize: paginationStudent.pageSize,
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
							setStudentParam({
								...studentParam,
								page: page - 1,
								size: pageSize,
							});
						},
						onShowSizeChange: (current, size) => {
							setStudentParam({
								...studentParam,
								size: size,
							});
						},
					}}
				/>
			</Modal>
			<Modal
				className="exam-class-test-modal"
				open={openTeacherModal}
				title="Danh sách giáo viên"
				onOk={() => setOpenTeacherModal(false)}
				onCancel={() => setOpenTeacherModal(false)}
				maskClosable={true}
				centered={true}
			>
				<Table
					className="teacher-list-table"
					columns={teacherColumns}
					dataSource={teacherList}
					rowSelection={rowTeacherSelection}
					loading={tableTeacherLoading}
					pagination={{
						current: paginationTeacher.current,
						total: paginationTeacher.total,
						pageSize: paginationTeacher.pageSize,
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
							setTeacherParam({
								...teacherParam,
								page: page - 1,
								size: pageSize,
							});
						},
						onShowSizeChange: (current, size) => {
							setTeacherParam({
								...teacherParam,
								size: size,
							});
						},
					}}
				/>
			</Modal>
			<Modal
				open={openModalPreview}
				okText="Đồng ý"
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
