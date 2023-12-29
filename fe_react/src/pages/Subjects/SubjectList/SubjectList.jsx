/* eslint-disable jsx-a11y/anchor-is-valid */
import {
  Button,
  Input,
  Modal,
  Space,
  Table,
  Form,
  Popconfirm,
  InputNumber,
} from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import addIcon from "../../../assets/images/svg/add-icon.svg";
import deleteIcon from "../../../assets/images/svg/delete-icon.svg";
import deletePopUpIcon from "../../../assets/images/svg/delete-popup-icon.svg";
import { appPath } from "../../../config/appPath";
import useNotify from "../../../hooks/useNotify";
import useSubjects from "../../../hooks/useSubjects";
import { setSelectedItem } from "../../../redux/slices/appSlice";
import { SearchOutlined } from "@ant-design/icons";
import "./SubjectList.scss";

import ModalPopup from "../../../components/ModalPopup/ModalPopup";
import { deleteSubjectsService } from "../../../services/subjectsService";
import { updateChapterService } from "../../../services/chapterServices";
import { customPaginationText } from "../../../utils/tools";
import ActionButton from "../../../components/ActionButton/ActionButton";

const SubjectList = () => {
  const initialParam = {
    title: null,
    code: null,
    page: 0,
    size: 10,
    sort: "code",
  };
  const [form] = Form.useForm();
  const [deleteDisable, setDeleteDisable] = useState(true);
  const [editingKey, setEditingKey] = useState("");
  const isEditing = (record) => record.id === editingKey;
  const {
    allSubjects,
    getAllSubjects,
    tableLoading,
    pagination,
    subjectInfo,
    getSubjectByCode,
    infoLoading,
  } = useSubjects();
  const [deleteKey, setDeleteKey] = useState(null);
  const [param, setParam] = useState(initialParam);
  const [openModal, setOpenModal] = useState(false);
  const [subjectId, setSubjectId] = useState(null);
  const searchInput = useRef(null);
  const handleReset = (clearFilters) => {
    clearFilters();
  };
  const errorMessange = "Chưa điền đầy đủ thông tin";
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => {
            setSelectedKeys(e.target.value ? [e.target.value] : []);
            setParam({
              ...param,
              [dataIndex]: e.target.value,
              page: 0,
            });
          }}
          onPressEnter={() => getAllSubjects(param)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => getAllSubjects({ ...param, page: 0 })}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Tìm kiếm
          </Button>
          <Button
            onClick={() => {
              clearFilters && handleReset(clearFilters);
              setParam(initialParam);
            }}
            size="small"
            style={{
              width: 90,
            }}
          >
            Đặt lại
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            Đóng
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1677ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
  });
  const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
  }) => {
    const inputNode = inputType === "number" ? <InputNumber /> : <Input />;
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item
            name={dataIndex}
            style={{
              margin: 0,
            }}
            rules={[
              {
                required: true,
                message: errorMessange,
              },
            ]}
          >
            {inputNode}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };
  const handleEdit = (record) => {
    navigate(`${appPath.subjectEdit}/${record.id}`);
  };
  const handleView = (record) => {
    setOpenModal(true);
    getSubjectByCode({}, record.id);
    setSubjectId(record.id);
  };
  useEffect(() => {
    getAllSubjects(param);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [param]);
  const notify = useNotify();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const onRow = (record) => {
    return {
      onClick: () => {
        dispatch(setSelectedItem(record));
      },
    };
  };
  const columns = [
    {
      title: "Mã học phần",
      dataIndex: "code",
      key: "code",
      ...getColumnSearchProps("code"),
      width: "15%",
      align: "center",
    },
    {
      title: "Tên học phần",
      dataIndex: "title",
      key: "title",
      // eslint-disable-next-line jsx-a11y/anchor-is-valid
      render: (text) => <a>{text}</a>,
      ...getColumnSearchProps("title"),
      width: "30%",
    },
    {
      title: "Số tín chỉ",
      dataIndex: "credit",
      key: "credit",
      width: "10%",
      align: "center"
    },
    {
      title: "Thao tác",
      key: "action",
      align: "center",
      render: (_, record) => (
        <Space size="middle" style={{ cursor: "pointer" }}>
          <ActionButton icon="edit" handleClick={() => handleEdit(record)} />
          <ActionButton icon="content" handleClick={() => handleView(record)} />
          <ActionButton icon="add-chapter" handleClick={() =>
            navigate(`${appPath.subjectView}/${record.id}`)
          } />
        </Space>
      ),
    },
  ];
  const edit = (record) => {
    form.setFieldsValue({
      orders: "",
      title: "",
      ...record,
    });
    setEditingKey(record.id);
  };
  const cancel = () => {
    setEditingKey("");
  };
  const save = async (record) => {
    const row = await form.validateFields();
    updateChapterService(
      record.id,
      {
        orders: row.orders,
        title: row.title,
      },
      (res) => {
        getSubjectByCode({}, subjectId);
        setEditingKey("");
      },
      (error) => {
        notify("error");
      }
    );
  };
  const chapterColumn = [
    {
      title: "Chương",
      dataIndex: "orders",
      width: "20%",
      editable: true,
      align: "center"
    },
    {
      title: "Nội dung",
      dataIndex: "title",
      width: "60%",
      editable: true,
    },
    {
      title: "Thao tác",
      dataIndex: "action",
      align: "center",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Button
              onClick={() => save(record)}
              style={{
                marginRight: 8,
              }}
            >
              Lưu
            </Button>
            <Popconfirm
              cancelText="Đóng"
              okText="Đồng ý"
              title="Bạn chắc chắn muốn thoát?"
              onConfirm={cancel}
            >
              <Button type="submit">Đóng</Button>
            </Popconfirm>
          </span>
        ) : (
          <Button
            disabled={editingKey !== ""}
            onClick={() => edit(record)}
          >
            Cập nhật
          </Button>
        );
      },
    },
  ];
  const mergedColumns = chapterColumn.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === "orders" ? "number" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });
  const dataFetch = allSubjects.map((obj, index) => ({
    key: (index + 1).toString(),
    title: obj.title,
    credit: obj.credit,
    description: obj.description,
    code: obj.code,
    id: obj.id,
  }));
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
    if (newSelectedRowKeys.length === 1) {
      setDeleteKey(
        dataFetch.find((item) => item.key === newSelectedRowKeys[0]).id
      );
      setDeleteDisable(false);
    } else {
      setDeleteDisable(true);
    }
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    selections: [Table.SELECTION_ALL],
  };
  const handleClickAddSubject = () => {
    navigate("/subject-add");
  };
  const handleDelete = () => {
    deleteSubjectsService(
      deleteKey,
      null,
      (res) => {
        notify.success("Xoá học phần thành công!");
        getAllSubjects();
        setSelectedRowKeys([]);
      },
      (error) => {
        notify.error("Lỗi xoá học phần!");
      }
    );
  };
  return (
    <div className="subject-list">
      <div className="header-subject-list">
        <p>Danh sách học phần</p>
        <div className="block-button">
          <ModalPopup
            buttonOpenModal={
              <Button
                className="options"
                disabled={deleteDisable}
              >
                <img src={deleteIcon} alt="Delete Icon" />
                Xóa
              </Button>
            }
            title="Xóa học phần"
            message={
              "Bạn có chắc chắn muốn xóa học phần này không? "
            }
            confirmMessage={"Thao tác này không thể hoàn tác"}
            icon={deletePopUpIcon}
            ok={"Đồng ý"}
            onAccept={handleDelete}
          />
          <Button className="options" onClick={handleClickAddSubject}>
            <img src={addIcon} alt="Add Icon" />
            Thêm chương
          </Button>
        </div>
      </div>
      <div className="subject-list-wrapper">
        <Table
          scroll={{ y: 490 }}
          size="small"
          className="subject-list-table"
          columns={columns}
          dataSource={dataFetch}
          rowSelection={rowSelection}
          onRow={onRow}
          loading={tableLoading}
          pagination={{
            current: pagination.current,
            total: pagination.total,
            pageSize: pagination.pageSize,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50", "100"],
            locale: customPaginationText,
            showQuickJumper: true,
            showTotal: (total, range) => (
              <span>
                <strong>
                  {range[0]}-{range[1]}
                </strong>{" "}
                trong <strong>{total}</strong> môn học
              </span>
            ),
            onChange: (page, pageSize) => {
              setParam({
                ...param,
                page: page - 1,
                size: pageSize,
              });
            },
            onShowSizeChange: (current, size) => {
              setParam({
                ...param,
                size: size,
              });
            },
          }}
        />
        <Modal
          className="subject-list-content-modal"
          open={openModal}
          title="Nội dung"
          onOk={() => navigate(`${appPath.subjectView}/${subjectId}`)}
          cancelText="Đóng"
          okText="Thêm"
          onCancel={() => {
            setOpenModal(false);
            setEditingKey("");
          }}
          maskClosable={true}
          centered={true}
          style={{
            height: "50vh",
            width: "80vw",
            overflowY: "scroll",
          }}
        >
          <Form form={form} component={false}>
            <Table
              size="small"
              loading={infoLoading}
              components={{
                body: {
                  cell: EditableCell,
                },
              }}
              bordered
              dataSource={
                subjectInfo.lstChapter
                  ? subjectInfo.lstChapter.sort(
                    (a, b) => a.orders - b.orders
                  )
                  : []
              }
              columns={mergedColumns}
              pagination={false}
            />
          </Form>
        </Modal>
      </div>
    </div>
  );
};
export default SubjectList;
