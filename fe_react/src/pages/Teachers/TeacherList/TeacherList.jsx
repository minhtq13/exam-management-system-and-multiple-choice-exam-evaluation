/* eslint-disable jsx-a11y/anchor-is-valid */
import { Button, Input, Space, Table, Tag } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import addIcon from "../../../assets/images/svg/add-icon.svg";
import deleteIcon from "../../../assets/images/svg/delete-icon.svg";
import exportIcon from "../../../assets/images/svg/export-icon.svg";
import { appPath } from "../../../config/appPath";
import useNotify from "../../../hooks/useNotify";
import useTeachers from "../../../hooks/useTeachers";
import Highlighter from "react-highlight-words";
import { setSelectedItem } from "../../../redux/slices/appSlice";
import { deleteTeachersService } from "../../../services/teachersServices";
import ModalPopup from "../../../components/ModalPopup/ModalPopup";
import deletePopUpIcon from "../../../assets/images/svg/delete-popup-icon.svg";
import "./TeacherList.scss";
import axios from "axios";
import { SearchOutlined } from "@ant-design/icons";

const TeacherList = () => {
	const [deleteDisable, setDeleteDisable] = useState(true);
	const { allTeachers, getAllTeachers, tableLoading } = useTeachers();
	const [deleteKey, setDeleteKey] = useState(null);
	const [searchText, setSearchText] = useState("");
	const [searchedColumn, setSearchedColumn] = useState("");
	const searchInput = useRef(null);
	const handleSearch = (selectedKeys, confirm, dataIndex) => {
		confirm();
		setSearchText(selectedKeys[0]);
		setSearchedColumn(dataIndex);
	};
	const handleReset = (clearFilters) => {
		clearFilters();
		setSearchText("");
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
					onChange={(e) =>
						setSelectedKeys(e.target.value ? [e.target.value] : [])
					}
					onPressEnter={() =>
						handleSearch(selectedKeys, confirm, dataIndex)
					}
					style={{
						marginBottom: 8,
						display: "block",
					}}
				/>
				<Space>
					<Button
						type="primary"
						onClick={() =>
							handleSearch(selectedKeys, confirm, dataIndex)
						}
						icon={<SearchOutlined />}
						size="small"
						style={{
							width: 90,
						}}
					>
						Search
					</Button>
					<Button
						onClick={() =>
							clearFilters && handleReset(clearFilters)
						}
						size="small"
						style={{
							width: 90,
						}}
					>
						Reset
					</Button>
					<Button
						type="link"
						size="small"
						onClick={() => {
							confirm({
								closeDropdown: false,
							});
							setSearchText(selectedKeys[0]);
							setSearchedColumn(dataIndex);
						}}
					>
						Filter
					</Button>
					<Button
						type="link"
						size="small"
						onClick={() => {
							close();
						}}
					>
						close
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
		render: (text) =>
			searchedColumn === dataIndex ? (
				<Highlighter
					highlightStyle={{
						backgroundColor: "#ffc069",
						padding: 0,
					}}
					searchWords={[searchText]}
					autoEscape
					textToHighlight={text ? text.toString() : ""}
				/>
			) : (
				text
			),
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
		navigate(`${appPath.teacherEdit}/${record.code}`);
	};
	useEffect(() => {
		getAllTeachers();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
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
			dataIndex: "fullName",
			key: "fullName",
			// eslint-disable-next-line jsx-a11y/anchor-is-valid
			render: (text) => <a>{text}</a>,
			...getColumnSearchProps("fullName"),
		},
		{
			title: "Tên người dùng",
			dataIndex: "username",
			key: "username",
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
			dataIndex: "birthday",
			key: "birthday",
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
		fullName: obj.fullName,
		username: obj.username,
		email: obj.email,
		phoneNumber: obj.phoneNumber,
		birthday: obj.birthday,
		gender: [obj.gender],
		code: obj.code,
		id: obj.id,
	}));
	const [selectedRowKeys, setSelectedRowKeys] = useState([]);
	const onSelectChange = (newSelectedRowKeys) => {
		setSelectedRowKeys(newSelectedRowKeys);
		if (newSelectedRowKeys.length === 1) {
			setDeleteKey(
				dataFetch.find((item) => item.key === newSelectedRowKeys[0]).id
			);
			setDeleteDisable(false);
			console.log(
				dataFetch.find((item) => item.key === newSelectedRowKeys[0])
			);
		} else {
			setDeleteDisable(true);
		}
	};
	const rowSelection = {
		selectedRowKeys,
		onChange: onSelectChange,
		selections: [Table.SELECTION_ALL],
	};
	const handleClickAddStudent = () => {
		navigate("/teacher-add");
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
		axios({
			url: "http://localhost:8088/e-learning/api/teacher/export", // Replace with your API endpoint
			method: "GET",
			responseType: "blob", // Set the response type to 'blob'
		})
			.then((response) => {
				// Create a download link
				const url = window.URL.createObjectURL(
					new Blob([response.data])
				);
				const link = document.createElement("a");
				link.href = url;
				link.setAttribute("download", `Teachers-${Date.now()}.xlsx`); // Set the desired file name
				document.body.appendChild(link);
				link.click();
			})
			.catch((error) => {
				notify.error("Error downloading Excel file!");
				console.error("Error downloading Excel file:", error);
			});
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
					<Button className="options" onClick={handleClickAddStudent}>
						<img src={addIcon} alt="Add Icon" />
						Thêm
					</Button>
				</div>
			</div>
			<div className="teacher-list-wrapper">
				<Table
					className="teacher-list-table"
					columns={columns}
					dataSource={dataFetch}
					rowSelection={rowSelection}
					pagination={{
						pageSize: 8,
					}}
					onRow={onRow}
					loading={tableLoading}
				/>
			</div>
		</div>
	);
};
export default TeacherList;
