/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useRef, useState } from "react";
import "./StudentList.scss";
import { Button, Input, Space, Table, Tag } from "antd";
import Highlighter from "react-highlight-words";
import useStudents from "../../../hooks/useStudents";
import exportIcon from "../../../assets/images/svg/export-icon.svg";
import deleteIcon from "../../../assets/images/svg/delete-icon.svg";
import deletePopUpIcon from "../../../assets/images/svg/delete-popup-icon.svg";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useNotify from "../../../hooks/useNotify";
import { appPath } from "../../../config/appPath";
import { useDispatch } from "react-redux";
import { setSelectedItem } from "../../../redux/slices/appSlice";
import { deleteStudentsService } from "../../../services/studentsService";
import ModalPopup from "../../../components/ModalPopup/ModalPopup";
import { SearchOutlined } from "@ant-design/icons";

const StudentList = () => {
	const [deleteDisable, setDeleteDisable] = useState(true);
	const { allStudents, getAllStudents, tableLoading } = useStudents();
	const [deleteKey, setDeleteKey] = useState(null);
	const [searchText, setSearchText] = useState("");
	const [searchedColumn, setSearchedColumn] = useState("");
	const [importLoading, setImportLoading] = useState(false);
	const searchInput = useRef(null);
	const [fileList, setFileList] = useState(null);
	const handleUpload = async () => {
		const formData = new FormData();
		formData.append("file", fileList);
		setImportLoading(true);
		try {
			const response = await axios.post(
				"http://localhost:8000/api/v1/student/import",
				formData
			);
			if (response.status === 200) {
				notify.success("File uploaded successfully");
				getAllStudents();
				setImportLoading(false);
			}
		} catch (error) {
			setImportLoading(false);
			notify.error("Error uploading file");
		}
		console.log(fileList);
	};
	const handleChange = (e) => {
		setFileList(e.target.files[0]);
	};
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
		navigate(`${appPath.studentEdit}/${record.code}`);
	};
	useEffect(() => {
		getAllStudents();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	const notify = useNotify();
	const navigate = useNavigate();

	const columns = [
		{
			title: "MSSV",
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
			title: "Khóa",
			dataIndex: "course",
			key: "course",
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
					text: "Male",
					value: "Nam",
				},
				{
					text: "Female",
					value: "Nữ",
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
	const dataFetch = allStudents.map((obj, index) => ({
		key: (index + 1).toString(),
		fullName: obj.fullName,
		username: obj.username,
		email: obj.email,
		phoneNumber: obj.phoneNumber,
		birthday: obj.birthday,
		gender: [obj.gender],
		code: obj.code,
		id: obj.id,
		course: obj.course,
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
		axios({
			url: "http://localhost:8000/api/v1/student/export", // Replace with your API endpoint
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
				link.setAttribute("download", `Students-${Date.now()}.xlsx`); // Set the desired file name
				document.body.appendChild(link);
				link.click();
			})
			.catch((error) => {
				notify.error("Lỗi tải file!");
			});
	};
	return (
		<div className="student-list">
			<div className="header-student-list">
				<p>Danh sách sinh viên</p>
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
						title="Delete Student"
						message={"Bạn chắc chắn muốn xóa sinh viên này không? "}
						confirmMessage={"Thao tác này không thể hoàn tác"}
						ok={"Ok"}
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
						loading={importLoading}
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
export default StudentList;
