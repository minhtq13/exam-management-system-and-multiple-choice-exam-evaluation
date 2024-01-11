import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Button } from "antd";
// import debounce from "lodash.debounce";
import { React } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import logoDHBK from "../../../assets/images/png-jpg/logo-dhbk.png";
// import Searchbox from "../../../components/Search/Searchbox";
import { setIsCollapse } from "../../../redux/slices/appSlice";
import Account from "./Account/Account";
import "./Header.scss";
import Notifications from "./Notification/Notifications";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isCollapse } = useSelector((state) => state.appReducer);
  // const handleOnChange = debounce((event) => {
  //   console.log(event.target.value);
  // }, 300);
  // const handleOnSearch = (value) => {
  //   console.log(value);
  // };
  const toggleCollapsed = () => {
    dispatch(setIsCollapse(!isCollapse));
  };
  const handleClick = () => {
    navigate("/student-list");
  };
  return (
    <div className="header-layout">
      <div
        onClick={handleClick}
        style={{ cursor: "pointer" }}
        className={isCollapse ? "header-logo logo-collapsed" : "header-logo"}
      >
        {isCollapse ? (
          <img src={logoDHBK} alt="" />
        ) : (
          <div className="logo">
            <img src={logoDHBK} alt="" />
            <div>HUSTBrainwave</div>
          </div>
        )}
      </div>
      <div className="button-header">
        <Button type="primary" onClick={toggleCollapsed} style={{ marginBottom: 16 }}>
          {isCollapse ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </Button>
      </div>
      <div className="header-search">
        {/* <Searchbox
          onChange={(event) => handleOnChange(event)}
          onSearch={(value) => handleOnSearch(value)}
        /> */}
        HỆ THỐNG HỖ TRỢ ĐÁNH GIÁ KẾT QUẢ THI TRẮC NGHIỆM - TRƯỜNG ĐẠI HỌC BÁCH KHOA HÀ NỘI
        <img src={logoDHBK} alt=""  style={{ marginLeft: 20, maxWidth: 35}}/>
      </div>
      <div className="header-noti-account">
        <Notifications />
        <Account />
      </div>
    </div>
  );
};

export default Header;
