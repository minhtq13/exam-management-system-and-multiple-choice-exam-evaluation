import { Button, Modal, Space, Table } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ImageUpload from "./ImageUpload";
import "./ModalSelectedImage.scss";
import PreviewImageInFolder from "./PreviewImageInFolder";

const ModalSelectedImage = ({ loading, imgInFolder }) => {
  const { examClassCode } = useSelector((state) => state.appReducer);
  const [dataTable, setDataTable] = useState([]);
  const [open, setOpen] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [arrayImage, setArrayImage] = useState([]);
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
    if (imgInFolder) {
      const newDataTable = imgInFolder.map((item, index) => {
        return {
          key: index + 1,
          fileName: item.fileName,
          fileExt: item.fileExt,
          filePath: item.filePath,
        };
      });
      const newArrayImage = [];
      imgInFolder.map((item, index) => {
        newArrayImage.push(item.filePath);
        return null;
      });
      setArrayImage(newArrayImage);
      setDataTable(newDataTable);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imgInFolder]);

  const [pageSize, setPageSize] = useState(8);
  const columns = [
    {
      title: "TT",
      dataIndex: "key",
      width: "10%",
      align: "center",
    },
    {
      title: "Ảnh",
      width: "20%",
      key: "action",
      align: "center",
      render: (_, record, index) => {
        return (
          <Space size="middle" style={{ cursor: "pointer" }}>
              <PreviewImageInFolder  srcImage={record.filePath} imageName={record.fileName} />
          </Space>
        );
      },
    },
    {
      title: "Tên ảnh",
      dataIndex: "fileName",
      width: "30%",
    },
    {
      title: "Loại ảnh",
      dataIndex: "fileExt",
      width: "10%",
      align: "center",
    },
    {
      align: "center",
      title: "Thao tác",
      key: "action",
      render: (_, record) => {
        return (
          <Space size="middle" style={{ cursor: "pointer" }}>
            <Button size="small" danger>
              Xoá ảnh
            </Button>
          </Space>
        );
      },
    },
  ];

  return (
    <div className="modal-selected-image-component">
      <Button
        type="primary"
        onClick={showModal}
        loading={loading}
        disabled={!examClassCode}
        style={{ minWidth: 200 }}
      >
        {imgInFolder.length ? `Đã chọn ${imgInFolder.length} ảnh` : "Nhấn vào đây để chọn ảnh"}
      </Button>
      <Modal
        className="modal-selected-image"
        open={open}
        title="Ảnh đã chọn"
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" type="primary" onClick={handleCancel}>
            Xác nhận
          </Button>,
        ]}
      >
        <div>
          <div style={{ marginBottom: 16 }} className="header-table-selected-image">
            <div className="block-upload">
              <ImageUpload />
            </div>
          </div>
          <Table
            scroll={{
              y: 450,
            }}
            size="small"
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
              pageSizeOptions: ["8", "15", "20", "50"],
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
