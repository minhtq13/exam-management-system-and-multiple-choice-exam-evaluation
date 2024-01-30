/* eslint-disable jsx-a11y/anchor-is-valid */
import { Button, Input, Space, Table, Tag } from "antd";
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
import useStudents from "../../../hooks/useStudents";
import { setSelectedItem } from "../../../redux/slices/appSlice";
import { convertGender, customPaginationText } from "../../../utils/tools";
import SearchFilter from "../../../components/SearchFilter/SearchFilter";
import "./StudentList.scss";
import debounce from "lodash.debounce";
import { ImportOutlined } from "@ant-design/icons";
import { courseNumOptions } from "../../../utils/constant";
import useAccount from "../../../hooks/useAccount";

const StudentList = () => {
  const initialParam = {
    search: null,
    page: 0,
    size: 10,
    courseNums: [],
    sort: "lastModifiedAt",
  };
  const [deleteDisable, setDeleteDisable] = useState(true);
  const { deleteUser, deleLoading } = useAccount();
  const {
    allStudents,
    getAllStudents,
    tableStudentLoading,
    paginationStudent,
  } = useStudents();
  const { importList, exportList, loadingImport } = useImportExport();
  const [deleteKey, setDeleteKey] = useState(null);
  const [fileList, setFileList] = useState(null);
  const [param, setParam] = useState(initialParam);
  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("file", fileList);
    importList(formData, "student", getAllStudents, initialParam);
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

  useEffect(() => {
    if (!loadingImport) {
      getAllStudents(param);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [param, loadingImport]);
  const navigate = useNavigate();
  const handleEdit = (record) => {
    navigate(`${appPath.studentEdit}/${record.id}`);
  };
  const columns = [
    {
      title: "MSSV",
      dataIndex: "code",
      key: "code",
      width: "12%",
      align: "center",
    },
    {
      title: "Họ và tên",
      dataIndex: "name",
      key: "name",
      // eslint-disable-next-line jsx-a11y/anchor-is-valid
      render: (text) => <a>{text}</a>,
      width: "20%",
    },
    {
      title: "Khóa",
      dataIndex: "courseNum",
      key: "courseNum",
      width: "10%",
      align: "center",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: "22%",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Giới tính",
      key: "gender",
      dataIndex: "gender",
      width: "12%",
      align: "center",
      render: (_, { gender }) => {
        return (
          <>
            {gender.map((gender) => {
              let color = "geekblue";
              if (gender === "MALE") {
                color = "green";
              } else if (gender === "FEMALE") color = "geekblue";
              else color = "red";
              return (
                <Tag color={color} key={gender}>
                  {gender
                    ? convertGender(gender?.toUpperCase())
                    : "Không xác định"}
                </Tag>
              );
            })}
          </>
        )
      }

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
  const dataFetch = allStudents.map((obj, index) => ({
    key: (index + 1).toString(),
    identityType: obj.identityType,
    name: obj.lastName + " " + obj.firstName,
    firstName: obj.firstName,
    lastName: obj.lastName,
    email: obj.email,
    gender: [obj.gender],
    code: obj.code,
    id: obj.id,
    courseNum: obj.courseNum,
    phoneNumber: obj.phoneNumber
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
  const onSearch = (value, _e, info) => {
    setParam({ ...param, search: value })
  };
  const onSeletCourse = (options) => {
    setParam({ ...param, courseNums: options })
  }
  const onChange = debounce((_e) => {
    setParam({ ...param, search: _e.target.value })
  }, 3000);
  const handleDelete = () => {
    deleteUser(deleteKey, { userType: "STUDENT" }, getAllStudents, param);
    setSelectedRowKeys([])
  };
  const handleExport = () => {
    const params = {
      name: param.name,
      code: param.code,
      courseNums: param.courseNums && param.courseNums.length > 0
        ? param.courseNums.join(",")
        : null,
    };
    exportList(params, "student");
  };
  return (
    <div className="student-list">
      <div className="header-student-list">
        <p>Danh sách sinh viên</p>
      </div>
      <div className="search-filter-button">
        <SearchFilter displayFilter placeholder="Nhập tên hoặc MSSV" options={courseNumOptions} onSearch={onSearch} onChange={onChange} onSelect={onSeletCourse} />
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
            buttonDisable={deleteDisable}
            title="Delete Student"
            message={"Bạn chắc chắn muốn xóa sinh viên này không? "}
            confirmMessage={"Thao tác này không thể hoàn tác"}
            ok={"Đồng ý"}
            icon={deletePopUpIcon}
            loading={deleLoading}
            onAccept={handleDelete}
          />
          <Button className="options" onClick={handleExport}>
            <img src={exportIcon} alt="Tải xuống Icon" />
            Tải xuống
          </Button>
          <Input
            type="file"
            name="file"
            onChange={(e) => handleChange(e)}
          ></Input>
          <Button
            type="primary"
            onClick={handleUpload}
            disabled={!fileList}
            loading={loadingImport}
          >
            <ImportOutlined /> Import
          </Button>
        </div>
      </div>
      <div className="student-list-wrapper">
        <Table
          scroll={{ y: 396 }}
          className="student-list-table"
          size="small"
          columns={columns}
          dataSource={dataFetch}
          rowSelection={rowSelection}
          onRow={onRow}
          loading={tableStudentLoading}
          pagination={{
            current: paginationStudent.current,
            total: paginationStudent.total,
            pageSize: paginationStudent.pageSize,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50", "100"],
            locale: customPaginationText,
            showQuickJumper: true,
            showTotal: (total, range) => (
              <span>
                <strong>
                  {range[0]}-{range[1]}
                </strong>{" "}
                trong <strong>{total}</strong> sinh viên
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
export default StudentList;
