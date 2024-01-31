/* eslint-disable jsx-a11y/anchor-is-valid */
import { Button, Input, Space, Table, Tag, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import deleteIcon from "../../../assets/images/svg/delete-icon.svg";
import deletePopUpIcon from "../../../assets/images/svg/delete-popup-icon.svg";
import exportIcon from "../../../assets/images/svg/export-icon.svg";
import ActionButton from "../../../components/ActionButton/ActionButton";
import ModalPopup from "../../../components/ModalPopup/ModalPopup";
import { appPath } from "../../../config/appPath";
import useImportExport from "../../../hooks/useImportExport";
import useTeachers from "../../../hooks/useTeachers";
import { setSelectedItem } from "../../../redux/slices/appSlice";
import { convertGender } from "../../../utils/tools";
import "./TeacherList.scss";
import SearchFilter from "../../../components/SearchFilter/SearchFilter";
import debounce from "lodash.debounce";
import { ImportOutlined } from "@ant-design/icons";
import useAccount from "../../../hooks/useAccount";

const TeacherList = () => {
  const initialParam = {
    name: null,
    code: null,
    page: 0,
    size: 10,
    sort: "lastModifiedAt",
  };
  const { deleLoading, deleteUser } = useAccount();
  const [param, setParam] = useState(initialParam);
  const [deleteDisable, setDeleteDisable] = useState(true);
  const [deleteKey, setDeleteKey] = useState(null);
  const [fileList, setFileList] = useState(null);
  const { allTeachers, getAllTeachers, tableTeacherLoading, paginationTeacher } = useTeachers();
  const { exportList, importList, loadingImport } = useImportExport();
  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("file", fileList);
    importList(formData, "teacher");
  };
  const handleChange = (e) => {
    setFileList(e.target.files[0]);
  };

  const dispatch = useDispatch();
  const onRow = (record) => {
    return {
      onClick: () => {
        dispatch(setSelectedItem(record));
      },
    };
  };
  const handleEdit = (record) => {
    navigate(`${appPath.teacherEdit}/${record.id}`);
  };
  useEffect(() => {
    if (!loadingImport) {
      getAllTeachers(param);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [param, loadingImport]);
  const navigate = useNavigate();
  const columns = [
    {
      title: "Mã cán bộ",
      dataIndex: "code",
      key: "code",
      width: "15%",
      align: "center",
    },
    {
      title: "Họ và tên",
      dataIndex: "name",
      key: "name",
      // eslint-disable-next-line jsx-a11y/anchor-is-valid
      render: (text) => <a>{text}</a>,
      width: "25%",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text) => <a href={`mailto:${text}`}>{text}</a>,
      width: "22%",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      align: "center",
      width: "10%",
    },
    {
      title: "Giới tính",
      key: "gender",
      width: "10%",
      dataIndex: "gender",
      align: "center",
      render: (_, { gender }) => (
        <>
          {gender.map((gender) => {
            let color = "geekblue";
            if (gender === "MALE") {
              color = "green";
            } else if (gender === "FEMALE") color = "geekblue";
            else color = "red";
            return (
              <Tag color={color} key={gender}>
                {gender ? convertGender(gender?.toUpperCase()) : "Không xác định"}
              </Tag>
            );
          })}
        </>
      ),
      filters: [
        {
          text: "Nam",
          value: "MALE",
        },
        {
          text: "Nữ",
          value: "FENam",
        },
      ],
      onFilter: (value, record) => record.gender.indexOf(value) === 0,
      filterSearch: true,
    },
    {
      title: "Thao tác",
      key: "action",
      align: "center",
      render: (_, record) => (
        <Space size="middle" style={{ cursor: "pointer" }}>
          <ActionButton icon="edit" handleClick={() => handleEdit(record)} />
        </Space>
      ),
    },
  ];
  const dataFetch = allTeachers.map((obj, index) => ({
    key: (index + 1).toString(),
    identityType: obj.identityType,
    name: obj.lastName + " " + obj.firstName,
    email: obj.email,
    phoneNumber: obj.phoneNumber,
    gender: [obj.gender],
    code: obj.code,
    id: obj.id,
  }));
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
    if (newSelectedRowKeys.length === 1) {
      setDeleteKey(dataFetch.find((item) => item.key === newSelectedRowKeys[0]).id);
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
  const handleDelete = () => {
    deleteUser(deleteKey, { userType: "TEACHER" }, getAllTeachers, param);
    setSelectedRowKeys([])
  };
  const handleExport = () => {
    const params = {
      name: param.name,
      code: param.code,
    };
    exportList(params, "teacher");
  };
  const onSearch = (value, _e, info) => {
    setParam({ ...param, search: value })
  };
  const onChange = debounce((_e) => {
    setParam({ ...param, search: _e.target.value })
  }, 3000);
  return (
    <div className="teacher-list">
      <div className="header-teacher-list">
        <p>Danh sách giảng viên</p>
      </div>
      <div className="search-filter-button">
        <SearchFilter displayFilter={false} placeholder="Nhập tên hoặc mã cán bộ" onSearch={onSearch} onChange={onChange} />
        <div className="block-button">
          <ModalPopup
            buttonOpenModal={
              <Tooltip title="Xoá giảng viên">
                <Button className="options" disabled={deleteDisable}>
                  <img src={deleteIcon} alt="Delete Icon" />
                </Button>
              </Tooltip>
            }
            buttonDisable={deleteDisable}
            title="Xóa giảng viên"
            message={"Bạn chắc chắn muốn xóa giảng viên này không? "}
            confirmMessage={"Thao tác này không thể hoàn tác"}
            icon={deletePopUpIcon}
            ok={"Đồng ý"}
            onAccept={handleDelete}
            loading={deleLoading}
          />
          <Tooltip title="Export danh sách giảng viên">
            <Button className="options" onClick={handleExport}>
              <img src={exportIcon} alt="Tải xuống Icon" />
            </Button>
          </Tooltip>
          <Input type="file" name="file" onChange={(e) => handleChange(e)}></Input>
          <Tooltip title="Import danh sách giảng viên">
            <Button
              type="primary"
              onClick={handleUpload}
              disabled={!fileList}
              loading={loadingImport}
            >
              <ImportOutlined />
            </Button>
          </Tooltip>
        </div>
      </div>
      <div className="teacher-list-wrapper">
        <Table
          scroll={{ y: 396 }}
          size="small"
          className="teacher-list-table"
          columns={columns}
          dataSource={dataFetch}
          rowSelection={rowSelection}
          onRow={onRow}
          loading={tableTeacherLoading}
          pagination={{
            current: paginationTeacher.current,
            total: paginationTeacher.total,
            pageSize: paginationTeacher.pageSize,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50", "100"],
            showQuickJumper: true,
            showTotal: (total, range) => (
              <span>
                <strong>
                  {range[0]}-{range[1]}
                </strong>{" "}
                trong <strong>{total}</strong> giảng viên
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
      </div>
    </div>
  );
};
export default TeacherList;
