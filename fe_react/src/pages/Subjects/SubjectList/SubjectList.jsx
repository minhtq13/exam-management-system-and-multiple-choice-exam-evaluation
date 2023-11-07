/* eslint-disable jsx-a11y/anchor-is-valid */
import { Button, Input, Space, Table } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import addIcon from "../../../assets/images/svg/add-icon.svg";
import deleteIcon from "../../../assets/images/svg/delete-icon.svg";
import deletePopUpIcon from "../../../assets/images/svg/delete-popup-icon.svg";
import { appPath } from "../../../config/appPath";
import useNotify from "../../../hooks/useNotify";
import useSubjects from "../../../hooks/useSubjects";
import { setSelectedItem } from "../../../redux/slices/appSlice";
import { SearchOutlined } from "@ant-design/icons";
import "./SubjectList.scss";

import ModalPopup from "../../../components/ModalPopup/ModalPopup";
import { deleteSubjectsService } from "../../../services/subjectsService";
import Highlighter from "react-highlight-words";

const SubjectList = () => {
	const [deleteDisable, setDeleteDisable] = useState(true);
	const { allSubjects, getAllSubjects, tableLoading } = useSubjects();
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
	const handleEdit = (record) => {
		navigate(`${appPath.subjectEdit}/${record.code}`);
	};
	const handleView = (record) => {
		navigate(`${appPath.subjectView}/${record.code}`);
	};
	useEffect(() => {
		getAllSubjects();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
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
			title: "Mã học phần",
			dataIndex: "code",
			key: "code",
			...getColumnSearchProps("code"),
		},
		{
			title: "Tên học phần",
			dataIndex: "title",
			key: "title",
			// eslint-disable-next-line jsx-a11y/anchor-is-valid
			render: (text) => <a>{text}</a>,
			...getColumnSearchProps("title"),
		},
		{
			title: "Mô tả",
			dataIndex: "description",
			key: "description",
			...getColumnSearchProps("description"),
		},
		{
			title: "Số tín chỉ",
			dataIndex: "credit",
			key: "credit",
		},
		{
			title: "Số câu hỏi",
			dataIndex: "questionQuantity",
			key: "questionQuantity",
		},
		{
			title: "Số chương",
			dataIndex: "chapterQuantity",
			key: "chapterQuantity",
		},
		{
			title: "Action",
			key: "action",
			render: (_, record) => (
				<Space size="middle" style={{ cursor: "pointer" }}>
					<Button danger onClick={() => handleEdit(record)}>
						Sửa
					</Button>
					<Button onClick={() => handleView(record)}>View</Button>
				</Space>
			),
		},
	];
	const dataFetch = allSubjects.map((obj, index) => ({
		key: (index + 1).toString(),
		title: obj.title,
		credit: obj.credit,
		chapterQuantity: obj.chapterQuantity,
		questionQuantity: obj.questionQuantity,
		description: obj.description,
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
		} else {
			setDeleteDisable(true);
		}
	};
	const rowSelection = {
		selectedRowKeys,
		onChange: onSelectChange,
		selections: [Table.SELECTION_ALL],
	};
	const handleClickAddSubject = () => {
		navigate("/subject-add");
	};
	const handleDelete = () => {
		deleteSubjectsService(
			deleteKey,
			null,
			(res) => {
				notify.success("Xoá học phần thành công!");
				getAllSubjects();
				setSelectedRowKeys([]);
			},
			(error) => {
				notify.error("Lỗi xoá học phần!");
			}
		);
	};
	return (
		<div className="subject-list">
			<div className="header-subject-list">
				<p>Danh sách học phần</p>
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
						title="Xóa học phần"
						message={
							"Bạn có chắc chắn muốn xóa học phần này không? "
						}
						confirmMessage={"Thao tác này không thể hoàn tác"}
						icon={deletePopUpIcon}
						ok={"Ok"}
						onAccept={handleDelete}
					/>
					<Button className="options" onClick={handleClickAddSubject}>
						<img src={addIcon} alt="Add Icon" />
						Thêm
					</Button>
				</div>
			</div>
			<div className="subject-list-wrapper">
				<Table
					className="subject-list-table"
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
export default SubjectList;
