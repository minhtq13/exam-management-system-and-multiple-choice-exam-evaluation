import { AppstoreAddOutlined, DownloadOutlined, EditOutlined, EyeOutlined, FileSearchOutlined, FormOutlined, SearchOutlined, SelectOutlined, UnorderedListOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";
import React from "react";
import { HUST_COLOR } from "../../utils/constant";
import "./ActionButton.scss";

const ActionButton = ({ icon, handleClick, color = HUST_COLOR }) => {
  const clickAction = () => {
    handleClick();
  };
  const switchIconAndToolTip = () => {
    switch (icon) {
      case "edit":
        return {
          icon: <EditOutlined style={{ color: color }} />,
          toolTip: "Cập nhật",
        };
      case "create-test-set":
        return {
          icon: <FormOutlined style={{ color: color }} />,
          toolTip: "Tạo bộ đề",
        };
      case "view-test-set":
        return {
          icon: <SearchOutlined style={{ color: color }} />,
          toolTip: "Xem bộ đề",
        };
      case "detail":
        return {
          icon: <FileSearchOutlined style={{ color: color }} />,
          toolTip: "Chi tiết",
        };
      case "content":
        return {
          icon: <UnorderedListOutlined style={{ color: color }} />,
          toolTip: "Nội dung",
        }
      case "add-chapter":
        return {
          icon: <AppstoreAddOutlined  style={{ color: color }} />,
          toolTip: "Thêm chương",
        }
      case "select": 
        return {
          icon: <SelectOutlined style={{ color: color }} />,
          toolTip: "Chọn",
        }
      case "view-img-handle":
        return {
          icon: <SearchOutlined style={{ color: color }} />,
          toolTip: "Xem chi tiết ảnh chấm"
        }
      case "preview-img-in-folder":
        return {
          icon: <EyeOutlined style={{ color: color }} />,
          toolTip: "Xem chi tiết ảnh"
        }
      case "download":
        return {
          icon: <DownloadOutlined style={{ color: color }} />,
          toolTip: "Download"
        }
      default:
        return {
          icon: <EditOutlined style={{ color: color }} />,
          toolTip: "Cập nhật",
        };
    }
  }

  return (
    <Tooltip title={switchIconAndToolTip().toolTip} color={HUST_COLOR} key={HUST_COLOR}>
      <div className="action-button-component" onClick={clickAction}>
        {switchIconAndToolTip().icon}
      </div>
    </Tooltip>
  );
};

export default ActionButton;
