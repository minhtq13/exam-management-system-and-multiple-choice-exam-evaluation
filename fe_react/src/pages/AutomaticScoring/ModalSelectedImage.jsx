import React, { useEffect, useState } from "react";
import "./ModalSelectedImage.scss";
import { Button, Modal, Space, Table } from "antd";
import useAI from "../../hooks/useAI";
import { useSelector } from "react-redux";

const columns = [
  {
    title: "TT",
    dataIndex: "key",
  },
  {
    title: "Tên ảnh",
    dataIndex: "fileName",
    width: 400,
  },
  {
    title: "Loại ảnh",
    dataIndex: "fileExt",
  },
  {
    title: "Thao tác",
    key: "action",
    render: (_, record) => {

      return (
        <Space size="middle" style={{ cursor: "pointer" }}>
          <Button onClick={() => handleClickViewImage(record.filePath)}>Xem ảnh</Button>
          <Button danger>Xoá ảnh</Button>
        </Space>
      );
    },
  },
];
const handleClickViewImage = (filePath) => {
  const downloadLink = document.createElement("a");
  downloadLink.href = filePath;
  downloadLink.target = "_blank";
  // downloadLink.download = 'downloaded_image.jpg';
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}

const ModalSelectedImage = ({ loading }) => {
  const { getImgInFolder, setImgInFolder, imgInFolder } = useAI();
  const { examClassCode } = useSelector((state) => state.appReducer);
  const [dataTable, setDataTable] = useState([]);
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
  useEffect(() => {
    if (examClassCode) {
      getImgInFolder(examClassCode, {});
    } else {
      setImgInFolder([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [examClassCode]);
  useEffect(() => {
    if (imgInFolder) {
      const newDataTable = imgInFolder.map((item, index) => {
        return {
          key: index + 1,
          fileName: item.fileName,
          fileExt: item.fileExt,
          filePath: item.filePath,
        };
      });
      setDataTable(newDataTable);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imgInFolder]);

  const [pageSize, setPageSize] = useState(8);

  return (
    <div className="modal-selected-image-component">
      <Button type="primary" onClick={showModal} loading={loading} disabled={!examClassCode}>
        {imgInFolder.length ? `Đã chọn ${imgInFolder.length} ảnh` : "Nhấn vào đây để chọn ảnh"}
      </Button>
      <Modal
        className="modal-selected-image"
        open={open}
        title="Chọn ảnh"
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Quay lại
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            OK
          </Button>,
        ]}
      >
        <div>
          <div
            style={{
              marginBottom: 16,
            }}
          >
            <span
              style={{
                marginLeft: 8,
              }}
            >
              {imgInFolder.length ? `Đã chọn ${imgInFolder.length} ảnh` : ""}
            </span>
          </div>
          <Table
            columns={columns}
            dataSource={dataTable}
            pagination={{
              pageSize: pageSize,
              total: imgInFolder.length,
              showTotal: (total, range) => (
                <span>
                  <strong>
                    {range[0]}-{range[1]}
                  </strong>{" "}
                  of <strong>{total}</strong> items
                </span>
              ),
              showSizeChanger: true,
              pageSizeOptions: ["8", "15", "30", "50"],
              onChange: (page, pageSize) => {},
              onShowSizeChange: (current, size) => {
                setPageSize(size);
              },
            }}
          />
        </div>
      </Modal>
    </div>
  );
};

export default ModalSelectedImage;
