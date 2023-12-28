/* eslint-disable jsx-a11y/anchor-is-valid */
import { SearchOutlined } from "@ant-design/icons";
import { Button, Input, Modal, Select, Space, Table, Tabs } from "antd";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import deleteIcon from "../../../assets/images/svg/delete-icon.svg";
import deletePopUpIcon from "../../../assets/images/svg/delete-popup-icon.svg";
import exportIcon from "../../../assets/images/svg/export-icon.svg";
import ModalPopup from "../../../components/ModalPopup/ModalPopup";
import { appPath } from "../../../config/appPath";
import useCombo from "../../../hooks/useCombo";
import useExamClasses from "../../../hooks/useExamClass";
import useImportExport from "../../../hooks/useImportExport";
import useNotify from "../../../hooks/useNotify";
import { setSelectedItem } from "../../../redux/slices/appSlice";
import { deleteExamClassService } from "../../../services/examClassServices";
import "./ExamClassList.scss";
import { customPaginationText } from "../../../utils/tools";
import ActionButton from "../../../components/ActionButton/ActionButton";

const ExamClassList = () => {
  const initialParam = {
    code: null,
    subjectId: null,
    semesterId: null,
    page: 0,
    size: 10,
    sort: "id",
  };
  const [deleteDisable, setDeleteDisable] = useState(true);
  const {
    allExamClasses,
    getAllExamClasses,
    tableLoading,
    pagination,
    getParticipants,
    partiLoading,
    participants,
    resultLoading,
    getResult,
    resultData,
  } = useExamClasses();
  const { subLoading, allSubjects, getAllSubjects, allSemester, semesterLoading, getAllSemesters } =
    useCombo();
  const { exportExamClass, exportExamClassStudent } = useImportExport();
  const [deleteKey, setDeleteKey] = useState(null);
  const [importLoading, setImportLoading] = useState(false);
  const [param, setParam] = useState(initialParam);
  const searchInput = useRef(null);
  const [fileList, setFileList] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [roleType, setRoleType] = useState("STUDENT");
  const [classId, setClassId] = useState(null);
  const [classCode, setClassCode] = useState(null);
  const [record, setRecord] = useState({});
  useEffect(() => {
    if (classId) {
      getParticipants(classId, roleType);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classId, roleType]);
  useEffect(() => {
    if (classCode) {
      getResult(classCode, {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classCode, roleType]);
  useEffect(() => {
    getAllSubjects({ subjectCode: null, subjectTitle: null });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    getAllSemesters({ search: "" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const subjectOptions = allSubjects.map((item) => {
    return { value: item.id, label: item.name };
  });
  const semesterOptions =
    allSemester && allSemester.length > 0
      ? allSemester.map((item) => {
        return { value: item.id, label: item.name };
      })
      : [];
  const subjectOnChange = (value) => {
    setParam({ ...param, subjectId: value });
  };
  const semsOnChange = (value) => {
    setParam({ ...param, semesterId: value });
  };
  const tabsColumn = [
    {
      title: "Họ tên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: roleType === "STUDENT" ? "MSSV" : "Mã cán bộ",
      dataIndex: "code",
      key: "code",
    },
  ];
  const addTabsColumn = [
    {
      title: "Mã đề thi",
      dataIndex: "testSetCode",
      key: "testSetCode",
    },
    {
      title: "Điểm",
      dataIndex: "totalPoints",
      key: "totalPoint",
    },
  ];

  const tabsData = participants.map((itemA, index) => {
    const correspondingItemB = resultData.find((itemB) => itemB.id === itemA.id);
    return {
      key: (index + 1).toString(),
      name: itemA.name,
      code: itemA.code,
      testSetCode: correspondingItemB ? correspondingItemB.testSetCode : null,
      totalPoints: correspondingItemB ? correspondingItemB.totalPoints : null,
    };
  });
  const handleExportStudent = () => {
    exportExamClassStudent(classCode);
  };
  const renderTab = () => {
    return (
      <div className="exam-class-tabs">
        {roleType === "STUDENT" && (
          <div className="tab-button">
            <Button className="options" onClick={handleExportStudent}>
              <img src={exportIcon} alt="Tải xuống Icon" />
              Tải xuống
            </Button>
            <Input type="file" name="file" onChange={(e) => handleChange(e)}></Input>
            <Button
              type="primary"
              //onClick={handleUpload}
              disabled={!fileList}
            //loading={loadingImport}
            >
              Import
            </Button>
          </div>
        )}
        <Table
          size="small"
          className="exam-class-participant"
          columns={roleType === "STUDENT" ? [...tabsColumn, ...addTabsColumn] : tabsColumn}
          dataSource={tabsData}
          loading={partiLoading || resultLoading}
        />
      </div>
    );
  };
  const tabsOptions = [
    {
      key: "STUDENT",
      label: "Sinh viên",
      children: renderTab(),
    },
    {
      key: "SUPERVISOR",
      label: "Giám thị",
      children: renderTab(),
    },
  ];

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("file", fileList);
    setImportLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8088/e-learning/api/exam-class/import",
        formData
      );
      if (response.status === 200) {
        notify.success("Tải lên file thành công!");
        getAllExamClasses();
        setImportLoading(false);
      }
    } catch (error) {
      setImportLoading(false);
      notify.error("Lỗi tải file!");
    }
  };
  const handleChange = (e) => {
    setFileList(e.target.files[0]);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
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
          onPressEnter={() => getAllExamClasses(param)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => getAllExamClasses({ ...param, page: 0 })}
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
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
  });
  const dispatch = useDispatch();
  const onRow = (record) => {
    return {
      onClick: () => {
        dispatch(setSelectedItem(record));
      },
    };
  };
  const handleEdit = (record) => {
    navigate(`${appPath.examClassEdit}/${record.id}`);
  };
  useEffect(() => {
    getAllExamClasses(param);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [param]);
  const notify = useNotify();
  const navigate = useNavigate();

  const columns = [
    {
      title: "Mã lớp thi",
      dataIndex: "code",
      key: "code",
      ...getColumnSearchProps("code"),
      width: "10%",
      align: "center",
    },
    {
      title: "Kỳ thi",
      dataIndex: "semester",
      key: "semester",
      width: "8%",
      align: "center",
    },
    {
      title: "Phòng thi",
      dataIndex: "roomName",
      key: "roomName",
      // eslint-disable-next-line jsx-a11y/anchor-is-valid
      render: (text) => <a>{text}</a>,
      ...getColumnSearchProps("fullName"),
      width: "10%",
      align: "center",
    },
    {
      title: "Kỳ học",
      dataIndex: "semester",
      key: "semester",
      width: "8%",
      align: "center",
    },
    {
      title: "Môn thi",
      dataIndex: "subjectTitle",
      key: "subjectTitle",
      width: "22%",
    },
    {
      title: "Số SV",
      dataIndex: "numberOfStudents",
      key: "numberOfStudents",
      width: "8%",
      align: "center",
    },
    {
      title: "Số giám thị",
      dataIndex: "numberOfSupervisors",
      key: "numberOfSupervisors",
      width: "8%",
      align: "center",
    },
    {
      title: "Thời gian thi",
      dataIndex: "examineTime",
      key: "examineTime",
      width: "15%",
      align: "center",
    },
    {
      title: "Thao tác",
      key: "action",
      align: "center",
      render: (_, record) => (
        <Space size="middle" style={{ cursor: "pointer" }}>
          <ActionButton icon="detail" handleClick={() => {
              setRecord(record);
              setClassId(record.id);
              setClassCode(record.code);
              setOpenModal(true);
            }}/>
          <ActionButton  icon="edit" handleClick={() => handleEdit(record)} />
        </Space>
      ),
    },
  ];
  const dataFetch = allExamClasses.map((obj, index) => ({
    key: (index + 1).toString(),
    code: obj.code,
    roomName: obj.roomName,
    classCode: obj.classCode,
    semester: obj.semester,
    subjectTitle: obj.subjectTitle,
    examineTime: obj.examineTime === null && obj.examineDate === null ? "" : `${obj.examineTime} - ${obj.examineDate}`,
    numberOfStudents: obj.numberOfStudents ?? 0,
    numberOfSupervisors: obj.numberOfSupervisors ?? 0,
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
    deleteExamClassService(
      deleteKey,
      null,
      (res) => {
        notify.success("Xoá lớp thi thành công!");
        getAllExamClasses();
        setSelectedRowKeys([]);
      },
      (error) => {
        notify.error("Lỗi xoá lớp thi!");
      }
    );
  };
  const handleExport = () => {
    exportExamClass(param.semesterId, "exam-class");
  };
  return (
    <div className="exam-class-list">
      <div className="header-exam-class-list">
        <p>Danh sách lớp thi</p>
        <div className="block-button">
          <Button className="options" onClick={handleExport}>
            <img src={exportIcon} alt="Tải xuống Icon" />
            Tải xuống
          </Button>
          <ModalPopup
            buttonOpenModal={
              <Button className="options" disabled={deleteDisable}>
                <img src={deleteIcon} alt="Delete Icon" />
                Xóa
              </Button>
            }
            buttonDisable={deleteDisable}
            title="Xóa lớp thi"
            message={"Bạn chắc chắn muốn xóa lớp thi này không? "}
            confirmMessage={"Thao tác này không thể hoàn tác"}
            ok={"Đồng ý"}
            icon={deletePopUpIcon}
            onAccept={handleDelete}
          />
          <Input type="file" name="file" onChange={(e) => handleChange(e)}></Input>
          <Button
            type="primary"
            onClick={handleUpload}
            disabled={!fileList}
            loading={importLoading}
          >
            Import
          </Button>
        </div>
      </div>
      <div className="examclass-subject-semester">
        <div className="examclass-select examclass-select-semester">
          <span className="select-label">Kỳ thi:</span>
          <Select
            allowClear
            showSearch
            placeholder="Học kỳ"
            optionFilterProp="children"
            filterOption={(input, option) => (option?.label ?? "").includes(input)}
            optionLabelProp="label"
            options={semesterOptions}
            onChange={semsOnChange}
            loading={semesterLoading}
          />
        </div>
        <div className="examclass-select">
          <span className="select-label">Học phần:</span>
          <Select
            allowClear
            showSearch
            placeholder="Chọn môn học để hiển thị danh sách đề thi"
            optionFilterProp="children"
            filterOption={(input, option) => (option?.label ?? "").includes(input)}
            optionLabelProp="label"
            options={subjectOptions}
            onChange={subjectOnChange}
            loading={subLoading}
            className="examclass-select-subject"
          />
        </div>
      </div>
      <div className="exam-class-list-wrapper">
        <Table
          scroll={{ y: 490 }}
          size="middle"
          className="exam-class-list-table"
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
            showQuickJumper: true,
            locale: customPaginationText,
            showTotal: (total, range) => (
              <span>
                <strong>
                  {range[0]}-{range[1]}
                </strong>{" "}
                trong <strong>{total}</strong> lớp thi
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
          className="exam-class-participants"
          open={openModal}
          title="Danh sách người tham gia"
          onOk={() => setOpenModal(false)}
          onCancel={() => setOpenModal(false)}
          maskClosable={true}
          centered={true}
        >
          <div className="exam-class-participant-details">
            <div className="exam-class-info-details">
              <div className="exam-class-participant-left">
                <div>{`Môn thi: ${record.subjectTitle}`}</div>
                <div>{`Mã lớp thi: ${record.code}`}</div>
                <div>{`Học kỳ: ${record.semester}`}</div>
              </div>
              <div className="exam-class-participant-right">
                <div>{`Phòng thi: ${record.roomName}`}</div>
                <div>{`Ngày thi: ${record.examineDate}`}</div>
                <div>{`Giờ thi: ${record.examineTime}`}</div>
              </div>
            </div>
            <Tabs
              defaultActiveKey="STUDENT"
              items={tabsOptions}
              onChange={(key) => setRoleType(key)}
            />
          </div>
        </Modal>
      </div>
    </div>
  );
};
export default ExamClassList;
