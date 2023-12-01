/* eslint-disable jsx-a11y/anchor-is-valid */
import { Button, List, Modal, Select, Space, Spin, Table } from "antd";
import React, { useEffect, useState } from "react";
import { AiFillEye } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import addIcon from "../../../assets/images/svg/add-icon.svg";
import deleteIcon from "../../../assets/images/svg/delete-icon.svg";
import deletePopUpIcon from "../../../assets/images/svg/delete-popup-icon.svg";
import ModalPopup from "../../../components/ModalPopup/ModalPopup";
import TestPreview from "../../../components/TestPreview/TestPreview";
import { appPath } from "../../../config/appPath";
import useCombo from "../../../hooks/useCombo";
import useImportExport from "../../../hooks/useImportExport";
import useNotify from "../../../hooks/useNotify";
import useTest from "../../../hooks/useTest";
import { setSelectedItem } from "../../../redux/slices/appSlice";
import {
	deleteTestService,
	testSetDetailService,
} from "../../../services/testServices";
import "./TestList.scss";
const TestList = () => {
	const [deleteDisable, setDeleteDisable] = useState(true);
	const { allTest, getAllTests, tableLoading, pagination } = useTest();
	const {
		subLoading,
		allSubjects,
		getAllSubjects,
		allSemester,
		semesterLoading,
		getAllSemesters,
	} = useCombo();
	const initialParam = { jectId: null, semesterId: null, page: 0, size: 10 };
	const { exportTestList, loadingExport } = useImportExport();
	const [deleteKey, setDeleteKey] = useState(null);
	const [openModal, setOpenModal] = useState(false);
	const [openModalPreview, setOpenModalPreview] = useState(false);
	const [questions, setQuestions] = useState([]);
	const [testDetail, setTestDetail] = useState({});
	const [testNo, setTestNo] = useState(null);
	const [viewLoading, setViewLoading] = useState(false);
	const [testItem, setTestItem] = useState({});
	const [testSetNos, setTestSetNos] = useState([]);
	const [param, setParam] = useState(initialParam);
	const handleCreate = (record) => {
		console.log(record);
		navigate(`${appPath.testSetCreate}/${record.id}`);
	};
	useEffect(() => {
		getAllTests(param);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [param]);
	useEffect(() => {
		getAllSubjects({ subjectCode: null, subjectTitle: null });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	useEffect(() => {
		getAllSemesters({ search: "" });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	const subjectOptions = allSubjects.map((item) => {
		return { value: item.id, label: item.name };
	});
	const semesterOptions =
		allSemester && allSemester.length > 0
			? allSemester.map((item) => {
					return { value: item.id, label: item.name };
			  })
			: [];
	const subjectOnChange = (value) => {
		setParam({ ...param, subjectId: value });
	};
	const semsOnChange = (value) => {
		setParam({ ...param, semesterId: value });
	};

	const handleExport = (param) => {
		const params = { testId: param.testId, code: param.testSetCode };
		exportTestList(
			params,
			`${testDetail.subjectCode}-${testDetail.semester}`
		);
	};
	const notify = useNotify();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const onRow = (record) => {
		return {
			onClick: () => {
				dispatch(setSelectedItem(record));
			},
		};
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
		{
			title: "Thời gian làm bài",
			dataIndex: "duration",
			key: "duration",
		},
		{
			title: "Ngày tạo",
			dataIndex: "createdAt",
			key: "createdAt",
		},
		{
			title: "Ngày sửa đổi",
			dataIndex: "modifiedAt",
			key: "modifiedAt",
		},
		{
			title: "Action",
			key: "action",
			render: (_, record) => (
				<>
					<Space size="middle" style={{ cursor: "pointer" }}>
						<Button
							danger
							onClick={() => {
								setTestItem(record);
								console.log(record);
								setTestSetNos(
									record.lstTestSetCode.length > 0
										? record.lstTestSetCode.split(",")
										: []
								);
								setOpenModal(true);
							}}
						>
							Xem bộ đề
						</Button>
						<Button onClick={() => handleCreate(record)}>
							Tạo bộ đề
						</Button>
					</Space>
				</>
			),
		},
	];
	const dataFetch = allTest?.map((obj, index) => ({
		key: (index + 1).toString(),
		questionQuantity: obj.questionQuantity,
		subjectName: obj.subjectName,
		createdAt: obj.createdAt,
		modifiedAt: obj.modifiedAt,
		duration: obj.duration,
		id: obj.id,
		testSetNos: obj.testSetNos,
		lstTestSetCode: obj.lstTestSetCode,
	}));
	const [selectedRowKeys, setSelectedRowKeys] = useState([]);
	const onSelectChange = (newSelectedRowKeys) => {
		setSelectedRowKeys(newSelectedRowKeys);
		if (newSelectedRowKeys.length === 1) {
			setDeleteKey(
				dataFetch.find((item) => item.key === newSelectedRowKeys[0]).id
			);
			setDeleteDisable(false);
		} else {
			setDeleteDisable(true);
		}
	};
	const rowSelection = {
		selectedRowKeys,
		onChange: onSelectChange,
		selections: [Table.SELECTION_ALL],
	};
	const handleClickAddTest = () => {
		navigate("/test-create");
	};
	const handleDelete = () => {
		deleteTestService(
			deleteKey,
			null,
			(res) => {
				notify.success("Xoá đề thi thành công!");
				getAllTests();
				setSelectedRowKeys([]);
			},
			(error) => {
				notify.error("Lỗi xoá đề thi!");
			}
		);
	};

	const handleView = (item) => {
		setTestNo(item);
		setOpenModalPreview(true);
		setViewLoading(true);
		testSetDetailService(
			{ testId: testItem.id ?? null, code: item },
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
	return (
		<div className="test-list">
			<div className="header-test-list">
				<p>Danh sách đề thi</p>
				<div className="block-button">
					<ModalPopup
						buttonOpenModal={
							<Button
								className="options"
								disabled={deleteDisable}
							>
								<img src={deleteIcon} alt="Delete Icon" />
								Xóa
							</Button>
						}
						title="Xóa đề thi"
						message={"Bạn chắc chắn muốn xóa đề thi này không? "}
						confirmMessage={"Thao tác này không thể hoàn tác"}
						icon={deletePopUpIcon}
						ok={"Ok"}
						onAccept={handleDelete}
					/>
					<Button className="options" onClick={handleClickAddTest}>
						<img src={addIcon} alt="Add Icon" />
						Add Test
					</Button>
				</div>
			</div>
			<div className="test-list-wrapper">
				<div className="test-subject-semester">
					<div className="test-select">
						<span className="select-label">Học phần:</span>
						<Select
							allowClear
							showSearch
							placeholder="Chọn môn học để hiển thị danh sách đề thi"
							optionFilterProp="children"
							filterOption={(input, option) =>
								(option?.label ?? "").includes(input)
							}
							optionLabelProp="label"
							options={subjectOptions}
							onChange={subjectOnChange}
							loading={subLoading}
						/>
					</div>
					<div className="test-select test-select-semester">
						<span className="select-label">Kỳ thi:</span>
						<Select
							allowClear
							showSearch
							placeholder="Kỳ thi"
							optionFilterProp="children"
							filterOption={(input, option) =>
								(option?.label ?? "").includes(input)
							}
							optionLabelProp="label"
							options={semesterOptions}
							onChange={semsOnChange}
							loading={semesterLoading}
						/>
					</div>
				</div>
				<Table
					className="test-list-table"
					columns={columns}
					dataSource={dataFetch}
					rowSelection={rowSelection}
					onRow={onRow}
					loading={tableLoading}
					pagination={{
						current: pagination.current,
						total: pagination.total,
						pageSize: pagination.pageSize,
						showSizeChanger: true,
						pageSizeOptions: ["10", "20", "50", "100"],
						showQuickJumper: true,
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
				<Modal
					open={openModal}
					title="Danh sách mã đề"
					onOk={() => setOpenModal(false)}
					onCancel={() => setOpenModal(false)}
					maskClosable={true}
					style={{ height: "50vh", overflowY: "scroll" }}
					centered={true}
				>
					<List
						itemLayout="horizontal"
						className="test-set-list"
						dataSource={testSetNos}
						renderItem={(item) => (
							<List.Item
								actions={[
									<div
										key="list-view"
										className="preview"
										onClick={() => handleView(item)}
									>
										<div className="preview-text">
											Preview
										</div>
										<AiFillEye color="#8c1515" />
									</div>,
								]}
							>
								<List.Item.Meta
									title={`Mã đề thi: ${item}`}
								></List.Item.Meta>
							</List.Item>
						)}
					/>
					<Modal
						open={openModalPreview}
						okText="Download"
						onOk={() => handleExport(testDetail)}
						onCancel={() => setOpenModalPreview(false)}
						maskClosable={true}
						centered={true}
						style={{
							height: "80vh",
							width: "70vw",
							overflowY: "scroll",
						}}
						width={"40vw"}
						okButtonProps={{ loading: loadingExport }}
					>
						<Spin tip="Loading..." spinning={viewLoading}>
							<TestPreview
								questions={questions}
								testDetail={testDetail}
								testNo={testNo}
							/>
						</Spin>
					</Modal>
				</Modal>
			</div>
		</div>
	);
};
export default TestList;
