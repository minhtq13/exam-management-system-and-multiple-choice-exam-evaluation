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
import useTeachers from "../../../hooks/useTeachers";
import { setSelectedItem } from "../../../redux/slices/appSlice";
import { deleteTeachersService } from "../../../services/teachersServices";
import "./TeacherList.scss";

const TeacherList = () => {
	const initialParam = {
		name: null,
		code: null,
		page: 0,
		size: 10,
		sort: "lastModifiedAt",
	};
	const [param, setParam] = useState(initialParam);
	const [deleteDisable, setDeleteDisable] = useState(true);
	const [deleteKey, setDeleteKey] = useState(null);
	const [fileList, setFileList] = useState(null);
	const { allTeachers, getAllTeachers, tableLoading, pagination } =
		useTeachers();
	const { exportList, importList, loadingImport } = useImportExport();
	const searchInput = useRef(null);
	const handleReset = (clearFilters) => {
		clearFilters();
	};
  const handleUpload = async () => {
		const formData = new FormData();
		formData.append("file", fileList);
		importList(formData, "teacher")
	};
	const handleChange = (e) => {
		setFileList(e.target.files[0]);
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
					onPressEnter={() => getAllTeachers(param)}
					style={{
						marginBottom: 8,
						display: "block",
					}}
				/>
				<Space>
					<Button
						type="primary"
						onClick={() => getAllTeachers({ ...param, page: 0 })}
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
	const handleEdit = (record) => {
		navigate(`${appPath.teacherEdit}/${record.id}`);
	};
	useEffect(() => {
    if (!loadingImport) {
      getAllTeachers(param);
    }
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [param, loadingImport]);
	const notify = useNotify();
	const navigate = useNavigate();
	const columns = [
		{
			title: "Mã cán bộ",
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
								{gender ? gender?.toUpperCase() : "UNKNOWN"}
							</Tag>
						);
					})}
				</>
			),
			filters: [
				{
					text: "Nam",
					value: "MALE",
				},
				{
					text: "Nữ",
					value: "FEMALE",
				},
			],
			onFilter: (value, record) => record.gender.indexOf(value) === 0,
			filterSearch: true,
		},
		{
			title: "Action",
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
	const dataFetch = allTeachers.map((obj, index) => ({
		key: (index + 1).toString(),
		identityType: obj.identityType,
		name: obj.lastName + " " + obj.firstName,
		email: obj.email,
		phoneNumber: obj.phoneNumber,
		birthDate: obj.birthDate,
		gender: [obj.gender],
		code: obj.code,
		id: obj.id,
	}));
	const [selectedRowKeys, setSelectedRowKeys] = useState([]);
	const onSelectChange = (newSelectedRowKeys) => {
		setSelectedRowKeys(newSelectedRowKeys);
		if (newSelectedRowKeys.length === 1) {
			setDeleteKey(dataFetch.find((item) => item.key === newSelectedRowKeys[0]).id);
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
		deleteTeachersService(
			deleteKey,
			null,
			(res) => {
				notify.success("Xoá giảng viên thành công!");
				getAllTeachers();
				setSelectedRowKeys([]);
			},
			(error) => {
				notify.error("Lỗi xoá giảng viên!");
			}
		);
	};
	const handleExport = () => {
		const params = {
			name: param.name,
			code: param.code,
		};
		exportList(params, "teacher");
	};
	return (
		<div className="teacher-list">
			<div className="header-teacher-list">
				<p>Danh sách giảng viên</p>
				<div className="block-button">
					<Button className="options" onClick={handleExport}>
						<img src={exportIcon} alt="Export Icon" />
						Export
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
						title="Xóa giảng viên"
						message={
							"Bạn chắc chắn muốn xóa giảng viên này không? "
						}
						confirmMessage={"Thao tác này không thể hoàn tác"}
						icon={deletePopUpIcon}
						ok={"Ok"}
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
			<div className="teacher-list-wrapper">
				<Table
					className="teacher-list-table"
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
			</div>
		</div>
	);
};
export default TeacherList;
