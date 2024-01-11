import { Button, Form, Select, Space } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import iconArrow from "../../assets/images/svg/arrow-under-header.svg";
import deletePopUpIcon from "../../assets/images/svg/delete-popup-icon.svg";
import ModalPopup from "../../components/ModalPopup/ModalPopup";
import useAI from "../../hooks/useAI";
import useNotify from "../../hooks/useNotify";
import "./AutomaticScoring.scss";
import HeaderSelect from "./HeaderSelect";
import ModalSelectedImage from "./ModalSelectedImage";
import TableResult from "./TableResult";

const { Option } = Select;

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};
const numberAnswerOption = [
  {
    text: "15 câu",
    value: 15,
  },
  {
    text: "20 câu",
    value: 20,
  },
  {
    text: "25 câu",
    value: 25,
  },
  {
    text: "30 câu",
    value: 30,
  },
  {
    text: "40 câu",
    value: 40,
  },
  {
    text: "60 câu",
    value: 60,
  },
];

const AutomaticScoring = () => {
  const notify = useNotify();
  const { refreshTableImage } = useSelector((state) => state.refreshReducer);
  const {
    getModelAI,
    resultAI,
    loading,
    resetTableResult,
    setResultAI,
    saveTableResult,
    imgInFolder,
    getImgInFolder,
    setImgInFolder,
  } = useAI();
  const { examClassCode } = useSelector((state) => state.appReducer);
  const [listExamClassCode, setListExamClassCode] = useState([]);
  const [listMSSV, setListMSSV] = useState([]);
  const [numberAnswer, setNumberAnswer] = useState(30);

  useEffect(() => {
    if (examClassCode) {
      getImgInFolder(examClassCode, {});
    } else {
      setImgInFolder([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [examClassCode, refreshTableImage]);
  const handleSubmit = () => {
    resetTableResult({}, false);
    setResultAI([]);
    if (imgInFolder.length > 0) {
      getModelAI(examClassCode);
    } else {
      notify.error("Vui lòng tải ảnh lên!");
    }
  };
  const onFinish = (values) => {};
  const handleReset = () => {
    resetTableResult();
    setResultAI([]);
  };
  const handleSaveResult = () => {
    saveTableResult();
  };
  const handleSelectMDT = (value) => {};
  const handleSelectMSSV = (value) => {};
  const handleSelectNumberAnswer = (value) => {
    setNumberAnswer(value);
  };
  return (
    <div className="automatic-scoring-wrapper">
      <div className="header-automatic-scoring">
        <h2>Chấm điểm tự động</h2>
      </div>
      <HeaderSelect />
      <div className="content-automatic-scoring">
        <Form name="validate_other" {...formItemLayout} onFinish={onFinish}>
          <div className="option">
            <ModalSelectedImage loading={loading} imgInFolder={imgInFolder} />
            <ModalPopup
              buttonOpenModal={
                <Button
                  type="primary"
                  loading={loading}
                  className="button-submit-ai"
                  disabled={!examClassCode || imgInFolder.length === 0}
                >
                  Chấm điểm
                </Button>
              }
              icon={deletePopUpIcon}
              title="Chấm điểm"
              message={"Bạn chắc chắn muốn chấm điểm những ảnh đã chọn? "}
              confirmMessage={"Bạn có thể xem lại các ảnh được chấm ở bên cạnh nút chấm điểm!"}
              ok={"Đồng ý"}
              onAccept={handleSubmit}
            />
            <Button
              onClick={handleReset}
              className="button-reset-table-result"
              disabled={resultAI.length === 0}
            >
              Đặt lại
            </Button>
          </div>
          <div className="filter-table-ai">
            <Space>
              <div className="detail-button">MSSV: </div>
              <Select
                optionLabelProp="label"
                onChange={handleSelectMSSV}
                className="custom-select-antd"
                suffixIcon={<img src={iconArrow} alt="" />}
                style={{ width: 230 }}
                placeholder="Tìm MSSV"
                showSearch
                allowClear
              >
                {listMSSV.map((item, index) => {
                  return (
                    <Option value={item.value} label={item.text} key={index}>
                      <div className="d-flex item_DropBar dropdown-option">
                        <div className="dropdown-option-item text-14">{item.value}</div>
                      </div>
                    </Option>
                  );
                })}
              </Select>
            </Space>
            <Space>
              <div className="detail-button">Mã đề thi: </div>
              <Select
                optionLabelProp="label"
                onChange={handleSelectMDT}
                className="custom-select-antd"
                suffixIcon={<img src={iconArrow} alt="" />}
                style={{ width: 230 }}
                placeholder="Tìm mã đề thi"
                showSearch
                allowClear
              >
                {listExamClassCode.map((item, index) => {
                  return (
                    <Option value={item.value} label={item.text} key={index}>
                      <div className="d-flex item_DropBar dropdown-option">
                        <div className="dropdown-option-item text-14">{item.value}</div>
                      </div>
                    </Option>
                  );
                })}
              </Select>
            </Space>
            <Space>
              <div className="detail-button">Hiển thị: </div>
              <Select
                optionLabelProp="label"
                onChange={handleSelectNumberAnswer}
                className="custom-select-antd"
                suffixIcon={<img src={iconArrow} alt="" />}
                style={{ width: 150 }}
                placeholder="Nhập số câu muốn hiển thị"
                showSearch
                defaultValue={30}
              >
                {numberAnswerOption.map((item, index) => {
                  return (
                    <Option value={item.value} label={item.text} key={index}>
                      <div className="d-flex item_DropBar dropdown-option">
                        <div className="dropdown-option-item text-14">{item.text}</div>
                      </div>
                    </Option>
                  );
                })}
              </Select>
            </Space>
          </div>
          <div className="result-ai">
            <TableResult
              numberAnswer={numberAnswer}
              resultAI={resultAI}
              loadingTable={loading}
              setListExamClassCode={setListExamClassCode}
              setListMSSV={setListMSSV}
            />
          </div>
          <div className="button-footer">
            <Button
              type="primary"
              onClick={handleSaveResult}
              loading={loading}
              disabled={resultAI.length === 0}
              className="button-submit-ai"
            >
              Lưu kết quả
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default AutomaticScoring;
