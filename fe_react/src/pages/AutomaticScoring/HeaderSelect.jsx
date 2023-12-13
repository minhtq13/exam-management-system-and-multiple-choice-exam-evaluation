import React, { useState } from "react";
import iconCheck from "../..//assets/images/svg/iconCheck.svg";
import iconArrow from "../../assets/images/svg/arrow-under-header.svg";
import iconCheckAct from "../../assets/images/svg/arrow-under.svg";
import exportIcon from "../../assets/images/svg/export-icon.svg";
import { Button, Select, Space } from "antd";
import { dataSelectCTDT, dataSelectKTDTVT, dataSelectLKQT } from "./data";
import { wordLimit } from "../../utils/tools";
const { Option } = Select;

const HeaderSelect = () => {
  const [type, setType] = useState("ktdtvt");
  const [secondType, setSecondType] = useState("Chọn học phần");
  const [isActive, setIsActive] = useState(0);

  const handleChangeFirstSelect = (value) => {
    setType(value);
    setSecondType("Chọn học phần");
  };
  const handleChangeSecondSelect = (value) => {
    setSecondType(value);
  };

  const getDataMap = () => {
    switch (type) {
      case "ktdtvt":
        return dataSelectKTDTVT;
      case "lkqt":
        return dataSelectLKQT;
      default:
        return dataSelectKTDTVT;
    }
  };
  return (
    <div>
      <div className="block-select">
        <div className="name-school">Trường Điện - Điện Tử</div>
        <div className="block-button">
          <Space>
            <div className="detail-button">Kỳ: </div>
            <Select
              optionLabelProp="label"
              suffixIcon={<img src={iconArrow} alt="" />}
              className="custom-select-antd"
              defaultValue="ktdtvt"
              onChange={handleChangeFirstSelect}
              style={{ width: 300 }}
            >
              {dataSelectCTDT.map((item, index) => {
                return (
                  <Option value={item.value} label={item.title} key={index}>
                    <div
                      className="d-flex item_DropBar dropdown-option"
                      onMouseEnter={() => {
                        setIsActive(index);
                      }}
                    >
                      <div
                        className="dropdown-option-item text-14"
                        style={isActive === index ? { color: "#8c1515" } : {}}
                      >
                        {wordLimit(item.title, 35)}
                      </div>
                      {type === item.value ? (
                        <img src={isActive === index ? iconCheckAct : iconCheck} alt="" />
                      ) : (
                        ""
                      )}
                    </div>
                  </Option>
                );
              })}
            </Select>
          </Space>

          <Space>
            <div className="detail-button">Học phần: </div>
            <Select
              value={secondType}
              optionLabelProp="label"
              onChange={handleChangeSecondSelect}
              className="custom-select-antd"
              suffixIcon={<img src={iconArrow} alt="" />}
              style={{ width: 200 }}
            >
              {getDataMap().map((item, index) => {
                return (
                  <Option value={item.value} label={item.title} key={index}>
                    <div
                      className="d-flex item_DropBar dropdown-option"
                      onMouseEnter={() => {
                        setIsActive(index);
                      }}
                    >
                      <div
                        className="dropdown-option-item text-14"
                        style={isActive === index ? { color: "#8c1515 " } : {}}
                      >
                        {item.title}
                      </div>
                      {secondType === item.value ? (
                        <img src={isActive === index ? iconCheckAct : iconCheck} alt="" />
                      ) : (
                        ""
                      )}
                    </div>
                  </Option>
                );
              })}
            </Select>
          </Space>
          <Button className="options">
            <img src={exportIcon} alt="Export Icon" />
            Export
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HeaderSelect;
