import { Button, Modal } from "antd";
import React, { useState } from "react";
import "./AutomaticScoring.scss";
const MayBeWrong = ({ mayBeWrong, examClassCode }) => {
  const [open, setOpen] = useState(false);
  const showModal = () => {
    setOpen(true);
  };
  const handleOk = () => {
    setOpen(false);
  };
  const handleCancel = () => {
    setOpen(false);
  };
  const downloadTxtFile = () => {
    const fileName = `MayBeWrong_${examClassCode}.txt`;
    const fileContent = mayBeWrong.join("\n");
    const element = document.createElement("a");
    const file = new Blob([fileContent], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = fileName;
    document.body.appendChild(element);
    element.click();
  };

  const errorFileCount = mayBeWrong.filter((item) => item.split(",").length > 1).length;
  const warningFileCount = mayBeWrong.length - errorFileCount;

  return (
    <>
      <Button type="primary" onClick={showModal} disabled={mayBeWrong.length === 0}>
        Xem kết quả lỗi ({mayBeWrong.length})
      </Button>
      <Modal
        className="may-be-wrong-modal"
        open={open}
        title="Kết quả chấm điểm"
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="download" onClick={downloadTxtFile}>
            Tải xuống file txt
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            Ok
          </Button>,
        ]}
      >
        <div className="may-be-wrong-content">
          <div className="header-mbw-content">
            Kết quả chấm này cho biết những ảnh chứa nhãn CÓ THỂ sai (độ tin cậy thấp), và những ảnh
            gặp lỗi trong quá trình chấm.
          </div>
          <div className="result-mbw">
            Có: <strong style={{ fontSize: 16 }}>{errorFileCount}</strong> ảnh bị lỗi,{" "}
            <strong style={{ fontSize: 16 }}>{warningFileCount}</strong> ảnh có thể sai, tổng số:{" "}
            <strong style={{ fontSize: 16 }}>{mayBeWrong.length}</strong> ảnh lỗi
          </div>
          <h3>Dưới đây là kết quả chấm cụ thể: </h3>
          {mayBeWrong.map((item, index) => {
            const splitItem = item.split(",");
            return (
              <div key={index}>
                <div className="mbw-value">
                  <span style={{ color: splitItem.length > 1 ? "orange" : "red" }}>
                    {index + 1}
                  </span>
                  . {item}
                </div>
              </div>
            );
          })}

          <p className="hint-mbw">
            Những ảnh bị lỗi sẽ không hiển thị không bảng kết quả
            <br /> Những nhãn có độ tin cậy thấp sẽ được highlight trong chi tiết ảnh chấm
          </p>
        </div>
      </Modal>
    </>
  );
};
export default MayBeWrong;
