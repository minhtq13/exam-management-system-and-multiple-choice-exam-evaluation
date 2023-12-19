import { UploadOutlined } from "@ant-design/icons";
import { Button, Modal, Select, Space, Table, Upload, message } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import iconArrow from "../../assets/images/svg/arrow-under-header.svg";
import { BASE_URL } from "../../config/apiPath";
import "./ModalSelectedImage.scss";
const { Option } = Select;
const columns = [
  {
    title: "TT",
    dataIndex: "key",
    width: 100,
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
          <Button size="small" onClick={() => handleClickViewImage(record.filePath)}>Xem ảnh</Button>
          <Button size="small" danger>Xoá ảnh</Button>
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
};

const ModalSelectedImage = ({ loading, imgInFolder }) => {
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

  const [pageSize, setPageSize] = useState(10);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [urlImg, setUrlImg] = useState();
  const handleCancelPreview = () => setPreviewOpen(false);
  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
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
  const options = [
    { label: "File", value: "file" },
    { label: "Directory", value: "directory" },
  ];

  const [uploadType, setUploadType] = useState(options[0].value);

  const handleChange = (value) => {
    setUploadType(value);
  };

  const uploadBlock = (
    <div>
      <Space>
        <div className="detail-button">Upload theo: </div>
        <Select
          optionLabelProp="label"
          onChange={handleChange}
          className="custom-select-antd"
          suffixIcon={<img src={iconArrow} alt="" />}
          style={{ width: 150, marginRight: 20 }}
          defaultValue={uploadType}
        >
          {options.map((item, index) => {
            return (
              <Option value={item.value} label={item.label} key={index}>
                <div className="d-flex item_DropBar dropdown-option">
                  <div className="dropdown-option-item text-14">{item.label}</div>
                </div>
              </Option>
            );
          })}
        </Select>
      </Space>
      <Upload {...props} onPreview={handlePreview} directory={uploadType === "file" ? false : true}>
        <Button icon={<UploadOutlined />} style={{ minWidth: 180 }}>
          Tải {uploadType === "file" ? "file" : "thư mục"} ảnh lên
        </Button>
      </Upload>
      <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancelPreview}>
        <img alt="example" style={{ width: "100%" }} src={previewImage} />
      </Modal>
    </div>
  );

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
        title="Chọn ảnh"
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
            <div className="block-upload">{uploadBlock}</div>
          </div>
          <Table
            scroll={{
              y: 410,
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
              pageSizeOptions: ["10", "20", "50", "100"],
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
