import { Button, Form } from "antd";
import { useSelector } from "react-redux";
import useAI from "../../hooks/useAI";
import useNotify from "../../hooks/useNotify";
import "./AutomaticScoring.scss";
import HeaderSelect from "./HeaderSelect";
import ModalSelectedImage from "./ModalSelectedImage";
import TableResult from "./TableResult";
import { useEffect } from "react";

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};

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
    getImgInFolder, setImgInFolder
  } = useAI();
  const { examClassCode } = useSelector((state) => state.appReducer);
  useEffect(() => {
    if (examClassCode) {
      getImgInFolder(examClassCode, {});
    } else {
      setImgInFolder([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [examClassCode, refreshTableImage]);
  const handleSubmit = () => {
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
            <Button
              type="primary"
              onClick={handleSubmit}
              loading={loading}
              className="button-submit-ai"
              disabled={!examClassCode || imgInFolder.length === 0}
            >
              Chấm điểm
            </Button>
            <Button
              onClick={handleReset}
              className="button-reset-table-result"
              disabled={resultAI.length === 0}
            >
              Đặt lại
            </Button>
          </div>
          <div className="result-ai">
            <TableResult resultAI={resultAI} />
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
