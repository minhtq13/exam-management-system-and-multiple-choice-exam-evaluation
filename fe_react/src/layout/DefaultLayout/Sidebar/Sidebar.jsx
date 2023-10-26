import {
	AppstoreOutlined,
	FormOutlined,
	SearchOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import { useEffect, useState } from "react";
import { BsQuestionCircleFill } from "react-icons/bs";
import { FaBookOpen, FaGraduationCap, FaRegCalendarAlt } from "react-icons/fa";
import { GiTeacher } from "react-icons/gi";
import { ImBlogger } from "react-icons/im";
import { MdOutlineSubject } from "react-icons/md";
import { VscLibrary } from "react-icons/vsc";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import "./Sidebar.scss";

const Sidebar = () => {
	const location = useLocation();
	const pathName = location.pathname.split("/")[1];
	const { isCollapse } = useSelector((state) => state.appReducer);
	const item = [
		{
			label: (
				<div
					className={
						isCollapse ? "title-present-collapse" : "title-present"
					}
				>
					Main Menu
				</div>
			),
			key: "mainmenu",
			type: "group",
			children: [
				{
					label: "Dashboard",
					key: "dashboard",
					icon: <AppstoreOutlined style={{ color: "#ffff" }} />,
					children: [
						{
							label: "Student Dashboard",
							key: "student-dashboard",
						},
						{
							label: "Teacher Dashboard",
							key: "teacher-dashboard",
						},
						{
							label: "Admin Dashboard",
							key: "admin-dashboard",
						},
					],
				},
				{
					label: "Sinh viên",
					key: "students",
					icon: <FaGraduationCap style={{ color: "#ffff" }} />,
					children: [
						{ label: "Danh sách sinh viên", key: "student-list" },
						{ label: "Thêm sinh viên", key: "student-add" },
					],
				},
				{
					label: "Giảng viên",
					key: "Teachers",
					icon: <GiTeacher style={{ color: "#ffff" }} />,
					children: [
						{ label: "Danh sách giảng viên", key: "teacher-list" },
						{ label: "Thêm giảng viên", key: "teacher-add" },
					],
				},

				{
					label: "Học phần",
					key: "subjects",
					icon: <MdOutlineSubject style={{ color: "#ffff" }} />,
					children: [
						{ label: "Danh sách học phần", key: "subject-list" },
						{ label: "Thêm học phần", key: "subject-add" },
					],
				},
				{
					label: "Câu hỏi",
					key: "questions",
					icon: <BsQuestionCircleFill style={{ color: "#ffff" }} />,
					children: [
						{ label: "Danh sách câu hỏi", key: "question-list" },
						{ label: "Thêm câu hỏi", key: "question-add" },
					],
				},
			],
		},
		{
			label: (
				<div
					className={
						isCollapse ? "title-present-collapse" : "title-present"
					}
				>
					Management
				</div>
			),
			key: "management",
			type: "group",
			children: [
				{
					label: "Đề thi",
					key: "tests",
					icon: <FormOutlined style={{ color: "#ffff" }} />,
					children: [
						{ label: "Danh sách đề thi", key: "test-list" },
						{ label: "Thêm đề thi", key: "test-create" },
					],
				},
				{
					label: "Chấm điểm tự động",
					key: "automatic-scoring",
					icon: <SearchOutlined style={{ color: "#ffff" }} />,
				},
				{
					label: "Lớp thi",
					key: "exam-class",
					icon: <FaBookOpen style={{ color: "#ffff" }} />,
					children: [
						{
							label: "Danh sách lớp thi",
							key: "exam-class-list",
						},
						{
							label: "Thêm lớp thi",
							key: "exam-class-create",
						},
					],
				},
				{
					label: "Thời khóa biểu",
					key: "time-table",
					icon: <FaRegCalendarAlt style={{ color: "#ffff" }} />,
				},
				{
					label: "Thư viện",
					key: "library",
					icon: <VscLibrary style={{ color: "#ffff" }} />,
				},
				{
					label: "Blogs",
					key: "blog",
					icon: <ImBlogger style={{ color: "#ffff" }} />,
					children: [
						{ label: "All Blogs", key: "all-blogs" },
						{ label: "Add Blog", key: "add-blog" },
						{ label: "Edit Blog", key: "edit-blog" },
					],
				},
			],
		},
	];
	const [openKeys, setOpenKeys] = useState();
	const onOpenChange = (keys) => {
		setOpenKeys(keys);
	};
	const toggleMenuCollapse = (info) => {
		setOpenKeys(info.keyPath);
	};
	const [currentActive, setCurrentActive] = useState(pathName);
	const navigate = useNavigate();
	const handleClickMenu = (info) => {
		toggleMenuCollapse(info);
		navigate(`/${info.key}`);
	};
	useEffect(() => {
		setCurrentActive(pathName);
	}, [pathName]);

	return (
		<div
			style={{ width: 256 }}
			className={
				isCollapse ? "sidebar-layout collapsed" : "sidebar-layout"
			}
		>
			<div className="sidebar">
				<Menu
					mode="inline"
					onClick={(info) => handleClickMenu(info)}
					items={item}
					inlineCollapsed={isCollapse}
					selectedKeys={[currentActive]}
					openKeys={openKeys}
					onOpenChange={(key) => onOpenChange(key)}
				></Menu>
			</div>
		</div>
	);
};
export default Sidebar;
