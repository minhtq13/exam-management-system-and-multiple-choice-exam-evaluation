/* eslint-disable jsx-a11y/anchor-is-valid */
import { SearchOutlined } from "@ant-design/icons";
import { Button, Input, Space, Table, Tag } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import deleteIcon from "../../../assets/images/svg/delete-icon.svg";
import deletePopUpIcon from "../../../assets/images/svg/delete-popup-icon.svg";
import exportIcon from "../../../assets/images/svg/export-icon.svg";
import ModalPopup from "../../../components/ModalPopup/ModalPopup";
import { appPath } from "../../../config/appPath";
import useImportExport from "../../../hooks/useImportExport";
import useNotify from "../../../hooks/useNotify";
import useStudents from "../../../hooks/useStudents";
import { setSelectedItem } from "../../../redux/slices/appSlice";
import { deleteStudentsService } from "../../../services/studentsService";
import "./StudentList.scss";
import { convertGender, customPaginationText } from "../../../utils/tools";

const StudentList = () => {
	const initialParam = {
		name: null,
		code: null,
		page: 0,
		size: 10,
		courseNum: null,
		sort: "lastModifiedAt",
	};
	const [deleteDisable, setDeleteDisable] = useState(true);
	const {
		allStudents,
		getAllStudents,
		tableStudentLoading,
		paginationStudent,
	} = useStudents();
	const { importList, exportList, loadingImport } = useImportExport();
	const [deleteKey, setDeleteKey] = useState(null);
	const searchInput = useRef(null);
	const [fileList, setFileList] = useState(null);
	const [param, setParam] = useState(initialParam);
	const handleUpload = async () => {
		const formData = new FormData();
		formData.append("file", fileList);
		importList(formData, "student", getAllStudents, initialParam);
	};
	const handleChange = (e) => {
		setFileList(e.target.files[0]);
	};
	const handleReset = (clearFilters) => {
		clearFilters();
	};
	const getColumnSearchProps = (dataIndex) => ({
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
						setParam({
							...param,
							[dataIndex]: e.target.value,
							page: 0,
						});
					}}
					onPressEnter={() => getAllStudents(param)}
					style={{
						marginBottom: 8,
						display: "block",
					}}
				/>
				<Space>
					<Button
						type="primary"
						onClick={() => getAllStudents({ ...param, page: 0 })}
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
							setParam(initialParam);
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
	const dispatch = useDispatch();
	const onRow = (record) => {
		return {
			onClick: () => {
				dispatch(setSelectedItem(record));
			},
		};
	};

	useEffect(() => {
		if (!loadingImport) {
			getAllStudents(param);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [param, loadingImport]);
	const notify = useNotify();
	const navigate = useNavigate();
	const handleEdit = (record) => {
		navigate(`${appPath.studentEdit}/${record.id}`);
	};
	const columns = [
		{
			title: "MSSV",
			dataIndex: "code",
			key: "code",
			...getColumnSearchProps("code"),
		},
		{
			title: "Họ tên",
			dataIndex: "name",
			key: "name",
			// eslint-disable-next-line jsx-a11y/anchor-is-valid
			render: (text) => <a>{text}</a>,
			...getColumnSearchProps("name"),
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
		{
			title: "Số điện thoại",
			dataIndex: "phoneNumber",
			key: "phoneNumber",
		},
		{
			title: "Ngày sinh",
			dataIndex: "birthDate",
			key: "birthDate",
		},
		{
			title: "Giới tính",
			key: "gender",
			dataIndex: "gender",
			render: (_, { gender }) => (
				<>
					{gender.map((gender) => {
						let color = "geekblue";
						if (gender === "MALE") {
							color = "green";
						} else if (gender === "FEMALE") color = "geekblue";
						else color = "red";
						return (
							<Tag color={color} key={gender}>
								{gender
									? convertGender(gender?.toUpperCase())
									: "Không xác định"}
							</Tag>
						);
					})}
				</>
			),
		},
		{
			title: "Thao tác",
			key: "action",
			render: (_, record) => (
				<Space size="middle" style={{ cursor: "pointer" }}>
					<Button danger onClick={() => handleEdit(record)}>
						Sửa
					</Button>
				</Space>
			),
		},
	];
	const dataFetch = allStudents.map((obj, index) => ({
		key: (index + 1).toString(),
		identityType: obj.identityType,
		name: obj.lastName + " " + obj.firstName,
		firstName: obj.firstName,
		lastName: obj.lastName,
		email: obj.email,
		phoneNumber: obj.phoneNumber,
		birthDate: obj.birthDate,
		gender: [obj.gender],
		code: obj.code,
		id: obj.id,
		courseNum: obj.courseNum,
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
	const handleDelete = () => {
		deleteStudentsService(
			deleteKey,
			null,
			(res) => {
				notify.success("Xoá sinh viên thành công!");
				getAllStudents();
				setSelectedRowKeys([]);
			},
			(error) => {
				notify.error("Lỗi xoá sinh viên!");
			}
		);
	};
	const handleExport = () => {
		const params = {
			name: param.name,
			code: param.code,
			courseNum: param.courseNum,
		};
		exportList(params, "student");
	};
	return (
		<div className="student-list">
			<div className="header-student-list">
				<p>Danh sách sinh viên</p>
				<div className="block-button">
					<Button className="options" onClick={handleExport}>
						<img src={exportIcon} alt="Tải xuống Icon" />
						Tải xuống
					</Button>
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
						buttonDisable={deleteDisable}
						title="Delete Student"
						message={"Bạn chắc chắn muốn xóa sinh viên này không? "}
						confirmMessage={"Thao tác này không thể hoàn tác"}
						ok={"Đồng ý"}
						icon={deletePopUpIcon}
						onAccept={handleDelete}
					/>
					<Input
						type="file"
						name="file"
						onChange={(e) => handleChange(e)}
					></Input>
					<Button
						type="primary"
						onClick={handleUpload}
						disabled={!fileList}
						loading={loadingImport}
					>
						Import
					</Button>
				</div>
			</div>
			<div className="student-list-wrapper">
				<Table
					className="student-list-table"
					columns={columns}
					dataSource={dataFetch}
					rowSelection={rowSelection}
					onRow={onRow}
					loading={tableStudentLoading}
					pagination={{
						current: paginationStudent.current,
						total: paginationStudent.total,
						pageSize: paginationStudent.pageSize,
						showSizeChanger: true,
						pageSizeOptions: ["10", "20", "50", "100"],
						locale: customPaginationText,
						showQuickJumper: true,
						showTotal: (total, range) => (
							<span>
								<strong>
									{range[0]}-{range[1]}
								</strong>{" "}
								trong <strong>{total}</strong> danh sách
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
			</div>
		</div>
	);
};
export default StudentList;
