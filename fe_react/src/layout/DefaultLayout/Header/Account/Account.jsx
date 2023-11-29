import {
	LogoutOutlined,
	SettingOutlined,
	UserOutlined,
} from "@ant-design/icons";
import { Avatar, Dropdown } from "antd";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAccount from "../../../../hooks/useAccount";
import { clearInfoLocalStorage, getToken } from "../../../../utils/storage";
import "./Account.scss";


const Account = () => {
	const pathAvatarSample = "https://static1.dienanh.net/upload/202203/db8fd584-5830-40b0-b5e8-c42885d676b4.jpeg"
	const navigate = useNavigate();
	const token = getToken()
	const {getProfileUser, profileUser} = useAccount();
	useEffect(() => {
    getProfileUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);
	const items = [
		{
			key: 1,
			label: (
				<div className="account-role menu-item">
					<div>
						<Avatar size={40} src={pathAvatarSample} />
					</div>
					<div className="name-role">
						<span>{profileUser.name}</span>
						<span>{profileUser.email}</span>
					</div>
				</div>
			),
			onClick: () => {},
		},
		{
			key: 2,
			label: (
				<div className="menu-item">
					<UserOutlined />
					<div className="account-content">Hồ sơ</div>
				</div>
			),
			onClick: () => {
				navigate("/profile-user");
			},
		},
		{
			key: 3,
			label: (
				<div className="menu-item">
					<SettingOutlined />
					<div className="account-content">Cài đặt</div>
				</div>
			),
			onClick: () => {},
		},
		{
			key: 4,
			label: (
				<div className="menu-item">
					<LogoutOutlined />
					<div className="account-content">Đăng xuất</div>
				</div>
			),
			onClick: () => {
				navigate("/login");
				clearInfoLocalStorage()
			},
		},
	];
	return (
		<div className="account-menu">
			<Dropdown
				menu={{
					items,
				}}
				overlayClassName="user-menu-overlay"
				trigger={["click"]}
			>
				<div>
					<Avatar size={35} src={pathAvatarSample} />
				</div>
			</Dropdown>
		</div>
	);
};
export default Account;
