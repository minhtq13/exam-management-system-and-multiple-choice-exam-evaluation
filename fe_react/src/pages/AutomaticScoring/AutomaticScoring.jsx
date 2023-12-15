import { UploadOutlined } from "@ant-design/icons";
import { Button, Form, Modal, Upload, message } from "antd";
import { useState } from "react";
import { useSelector } from "react-redux";
import { BASE_URL } from "../../config/apiPath";
import useAI from "../../hooks/useAI";
import "./AutomaticScoring.scss";
import HeaderSelect from "./HeaderSelect";
import TableResult from "./TableResult";

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};
const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const AutomaticScoring = () => {
  // eslint-disable-next-line no-unused-vars
  const [urlImg, setUrlImg] = useState();
  const { getModelAI, resultAI, loading, resetTableResult, setResultAI, saveTableResult } = useAI();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const handleCancel = () => setPreviewOpen(false);
  const { examClassCode } = useSelector((state) => state.appReducer);
  const props = {
    name: "files",
    listType: "picture",
    multiple: true,
    // method: "POST",
    action: `${BASE_URL}/test-set/handled-answers/upload/${examClassCode}`,
    beforeUpload: (file) => {
      const isPNG =
        file.type === "image/png" || file.type === "image/jpg" || file.type === "image/jpeg";
      if (!isPNG) {
        message.error(`${file.name} không phải file ảnh!`);
      }
      return isPNG || Upload.LIST_IGNORE;
    },
    onChange(info) {
      if (info.file.status !== "uploading") {
        setUrlImg(info.file.name);
      }
      if (info.file.status === "done") {
        message.success(`${info.file.name} tải lên thành công`);
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file đã tồn tại hoặc kết nối bị gián đoạn`);
      }
    },
  };
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf("/") + 1));
  };
  const handleSubmit = () => {
    // if (urlImg) {
    getModelAI(examClassCode);
    // }
  };
  const onFinish = (values) => {};
  const handleReset = () => {
    resetTableResult();
    setResultAI([]);
  };
  const handleSaveResult = () => {
    saveTableResult();
  };

  const uploadBlock = (
    <div>
      <Upload {...props} onPreview={handlePreview}>
        <div>
          <Button disabled={!examClassCode} icon={<UploadOutlined />}>
            Tải ảnh lên
          </Button>
        </div>
      </Upload>
      <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
        <img
          alt="example"
          style={{
            width: "100%",
          }}
          src={previewImage}
        />
      </Modal>
    </div>
  );

  return (
    <div className="exam-list-wrapper">
      <div className="header-exam-list">
        <h2>Chấm điểm tự động</h2>
      </div>
      <HeaderSelect />
      <div className="content-exam-list">
        <Form name="validate_other" {...formItemLayout} onFinish={onFinish}>
          {/* <div className="block-1">
            <div className="number-answer">
              <Form.Item name="numberAnswer" label="Số lượng câu hỏi" rules={[{ required: false }]}>
                <Input type="number" placeholder="Số lượng câu hỏi trong mỗi phiếu trả lời" />
              </Form.Item>
            </div>
          </div> */}
          <div className="upload">
            <Form.Item name="pathImg">
              <div>{uploadBlock}</div>
            </Form.Item>
          </div>
          <div className="option">
            <Button
              type="primary"
              onClick={handleSubmit}
              loading={loading}
              className="button-submit-ai"
              disabled={!examClassCode}
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
            {/* {resultAI.length > 0 && (
              <div className="total-record">
                Đã tìm thấy{" "}
                <span style={{ fontWeight: 600, color: "#000" }}>{resultAI.length}</span> kết quả
              </div>
            )} */}
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
