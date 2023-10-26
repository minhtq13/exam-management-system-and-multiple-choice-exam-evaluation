import { React } from "react";
import debounce from "lodash.debounce";
import Searchbox from "../../../components/Search/Searchbox";
import Account from "./Account/Account";
import "./Header.scss";
import Notifications from "./Notification/Notifications";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "antd";
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";
import { setIsCollapse } from "../../../redux/slices/appSlice";
import logo from "../../../assets/images/png-jpg/logo.png";
import logoSmall from "../../../assets/images/png-jpg/logo-small.png";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isCollapse } = useSelector((state) => state.appReducer);
  const handleOnChange = debounce((event) => {
    console.log(event.target.value);
  }, 300);
  const handleOnSearch = (value) => {
    console.log(value);
  };
  const toggleCollapsed = () => {
    dispatch(setIsCollapse(!isCollapse));
  };
  const handleClick = () => {
    navigate("/home");
  };
  return (
    <div className="header-layout">
      <div
        onClick={handleClick}
        style={{ cursor: "pointer" }}
        className={isCollapse ? "header-logo logo-collapsed" : "header-logo"}
      >
        {isCollapse ? <img src={logoSmall} alt="" /> : <img src={logo} alt="" />}
      </div>
      <div className="button-header">
        <Button type="primary" onClick={toggleCollapsed} style={{ marginBottom: 16 }}>
          {isCollapse ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </Button>
      </div>
      <div className="header-search">
        <Searchbox
          onChange={(event) => handleOnChange(event)}
          onSearch={(value) => handleOnSearch(value)}
        />
      </div>
      <div className="header-noti-account">
        <Notifications />
        <Account />
      </div>
    </div>
  );
};

export default Header;
