import {
	FormOutlined,
	SearchOutlined
} from "@ant-design/icons";
import { Menu } from "antd";
import { useEffect, useState } from "react";
import { AiFillCopy, AiFillEdit } from "react-icons/ai";
import { BsQuestionCircleFill } from "react-icons/bs";
import { FaBookOpen, FaGraduationCap } from "react-icons/fa";
import { GiTeacher } from "react-icons/gi";
import { MdOutlineSubject } from "react-icons/md";
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
					<AiFillEdit /> Quản lý
				</div>
			),
			key: "quanly",
			type: "group",
			children: [
				{
					label: "Sinh viên",
					key: "student-list",
					icon: <FaGraduationCap style={{ color: "#ffff" }} />,
				},
				{
					label: "Giảng viên",
					key: "teacher-list",
					icon: <GiTeacher style={{ color: "#ffff" }} />,
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
			
			],
		},
		{
			label: (
				<div
					className={
						isCollapse ? "title-present-collapse" : "title-present"
					}
				>
					<AiFillCopy /> Kỳ thi
				</div>
			),
			key: "kythi",
			type: "group",
			children: [
				{
					label: "Câu hỏi",
					key: "questions",
					icon: <BsQuestionCircleFill style={{ color: "#ffff" }} />,
					children: [
						{ label: "Danh sách câu hỏi", key: "question-list" },
						{ label: "Thêm câu hỏi", key: "question-add" },
					],
				},
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
					label: "Chấm điểm tự động",
					key: "automatic-scoring",
					icon: <SearchOutlined style={{ color: "#ffff" }} />,
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
					Quản trị
				</div>
			),
			key: "admin",
			type: "group",
			children: [
				{
					label: "Người dùng",
					key: "user",
					icon: <FaBookOpen style={{ color: "#ffff" }} />,
					children: [
						{
							label: "Tạo người dùng",
							key: "create-user",
						},
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
