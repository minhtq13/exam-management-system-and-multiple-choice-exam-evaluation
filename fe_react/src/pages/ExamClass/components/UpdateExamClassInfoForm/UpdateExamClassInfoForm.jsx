import {
  DatePicker,
  Form,
  Input,
  Select,
  Button,
  Modal,
  Space,
  Table,
  Spin,
  Popover,
} from "antd";
import "./UpdateExamClassInfoForm.scss";
import React, { useEffect, useState } from "react";
import useCombo from "../../../../hooks/useCombo";
import useTest from "../../../../hooks/useTest";
import useNotify from "../../../../hooks/useNotify";
import { testSetDetailService } from "../../../../services/testServices";
import TestPreview from "../../../../components/TestPreview/TestPreview";
import useTeachers from "../../../../hooks/useTeachers";
import useStudents from "../../../../hooks/useStudents";
import { customPaginationText, disabledDate } from "../../../../utils/tools";
import SearchFilter from "../../../../components/SearchFilter/SearchFilter";
import debounce from "lodash.debounce";
import { courseNumOptions } from "../../../../utils/constant";
const UpdateExamClassInfoForm = ({
  onFinish,
  initialValues,
  infoHeader,
  btnText,
  loading,
  onSelectTestId,
  onSelectStudents,
  onSelectTeachers,
  testDisplay,
  lstStudentId,
  lstSupervisorId,
}) => {
  const {
    allSemester,
    semesterLoading,
    getAllSemesters,
    subLoading,
    allSubjects,
    getAllSubjects,
    getAllStudent,
    getAllTeacher,
  } = useCombo();
  const {
    allTeachers,
    getAllTeachers,
    tableTeacherLoading,
    paginationTeacher,
  } = useTeachers();
  const {
    allStudents,
    getAllStudents,
    tableStudentLoading,
    paginationStudent,
  } = useStudents();
  const studentParamInit = {
    name: null,
    code: null,
    page: 0,
    size: 10,
    courseNums: null,
    sort: "lastModifiedAt",
  };
  const teacherParamInit = {
    name: null,
    code: null,
    page: 0,
    size: 10,
    sort: "lastModifiedAt",
  };
  const { allTest, getAllTests, tableLoading, pagination } = useTest();
  const initialParam = {
    subjectId: initialValues.subjectId ?? null,
    semesterId: initialValues.semesterId ?? null,
    page: 0,
    size: 10,
  };
  const [studentParam, setStudentParam] = useState(studentParamInit);
  const [teacherParam, setTeacherParam] = useState(teacherParamInit);
  const [param, setParam] = useState(initialParam);
  const [openModal, setOpenModal] = useState(false);
  const [testValue, setTestValue] = useState(testDisplay ?? "");
  const [testNo, setTestNo] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [testDetail, setTestDetail] = useState({});
  const [openModalPreview, setOpenModalPreview] = useState(false);
  const [openStudentModal, setOpenStudentModal] = useState(false);
  const [openTeacherModal, setOpenTeacherModal] = useState(false);
  const [studentSelected, setStudentSelected] = useState(lstStudentId ?? []);
  const [teacherSelected, setTeacherSelected] = useState(
    lstSupervisorId ?? []
  );
  // const [testId, setTestId] = useState(null);
  const [studentSelectedPerPage, setStudentSelectedPerPage] = useState({ "1": lstStudentId } ?? {});
  const [teacherSelectedPerPage, setTeacherSelectedPerPage] = useState({ "1": lstSupervisorId } ?? {});
  const notify = useNotify();
  useEffect(() => {
    if (openTeacherModal) {
      getAllTeachers(teacherParam);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teacherParam, openTeacherModal]);
  useEffect(() => {
    if (openStudentModal) {
      getAllStudents(studentParam);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studentParam, openStudentModal]);
  useEffect(() => {
    getAllSemesters({ search: "" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    getAllSubjects({ subjectCode: null, subjectTitle: null });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    getAllTeacher({ teacherName: null, teacherCode: null });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    getAllStudent({ studentName: null, studentCode: null });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (openModal) {
      getAllTests(param);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [param, openModal]);
  // eslint-disable-next-line
  const getOptions = (array, codeShow) => {
    return array && array.length > 0
      ? array.map((item) => {
        return {
          value: item.id,
          label: codeShow
            ? `${item.name} - ${item.code} `
            : item.name,
        };
      })
      : [];
  };

  const [form] = Form.useForm();

  const teacherColumns = [
    {
      title: "Mã cán bộ",
      dataIndex: "code",
      key: "code",
      width: "20%"
    },
    {
      title: "Họ và tên",
      dataIndex: "name",
      key: "name",
      width: "35%",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: "35%",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      width: "20%",
    },
  ];

  const studentColumns = [
    {
      title: "MSSV",
      dataIndex: "code",
      key: "code",
      width: "12%",
    },
    {
      title: "Họ tên",
      dataIndex: "name",
      key: "name",
      width: "33%",
      // eslint-disable-next-line jsx-a11y/anchor-is-valid
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Khóa",
      dataIndex: "courseNum",
      key: "courseNum",
      width: "15%",
      align: "center",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: "32%",
    },
  ];

  const columns = [
    {
      title: "Tên kỳ thi",
      dataIndex: "name",
      key: "name",
      width: "15%"
    },
    {
      title: "Học phần",
      dataIndex: "subjectName",
      key: "subjectName",
      width: "30%",
    },
    {
      title: "Học kỳ",
      dataIndex: "semester",
      key: "semester",
      width: "10%",
      align: "center"
    },
    {
      title: "Số câu hỏi",
      dataIndex: "questionQuantity",
      key: "questionQuantity",
      width: "10%",
      align: "center"
    },
    Table.EXPAND_COLUMN,
    {
      title: "Số bộ đề",
      dataIndex: "testSet",
      key: "testSet",
      width: "10%",
    },
    {
      title: "TG thi",
      dataIndex: "duration",
      key: "duration",
      width: "10%",
      align: "center",
      render: (text) => <span>{text} phút</span>,
    },
    {
      title: "Thao tác",
      key: "action",
      align: "center",
      render: (_, record) => (
        <>
          <Space size="small" style={{ cursor: "pointer" }}>
            <Button
              size="small"
              onClick={() => {
                setTestValue(
                  `${record.name} - ${record.duration} phút - ${record.testSet} mã đề`
                );
                form.setFieldsValue({ testId: record.id });
                setOpenModal(false);
                onSelectTestId(record.id);
              }}
            >
              Chọn
            </Button>
          </Space>
        </>
      ),
    },
  ];
  const studentSelectChange = (newSelectedRowKeys) => {
    setStudentSelectedPerPage({
      ...studentSelectedPerPage,
      [paginationStudent.current]: newSelectedRowKeys,
    });
    setStudentSelected(
      Object.values({
        ...studentSelectedPerPage,
        [paginationStudent.current]: newSelectedRowKeys,
      }).reduce((acc, arr) => acc.concat(arr), [])
    );
    onSelectStudents(
      Object.values({
        ...studentSelectedPerPage,
        [paginationStudent.current]: newSelectedRowKeys,
      }).reduce((acc, arr) => acc.concat(arr), [])
    );
  };
  const rowStudentSelection = {
    selectedRowKeys:
      studentSelectedPerPage[paginationStudent.current],
    onChange: studentSelectChange,
  };
  const teacherSelectChange = (newSelectedRowKeys) => {
    setTeacherSelectedPerPage({
      ...teacherSelectedPerPage,
      [paginationTeacher.current]: newSelectedRowKeys,
    });
    setTeacherSelected(
      Object.values({
        ...teacherSelectedPerPage,
        [paginationTeacher.current]: newSelectedRowKeys,
      }).reduce((acc, arr) => acc.concat(arr), [])
    );
    onSelectTeachers(
      Object.values({
        ...teacherSelectedPerPage,
        [paginationTeacher.current]: newSelectedRowKeys,
      }).reduce((acc, arr) => acc.concat(arr), [])
    );
  };
  const rowTeacherSelection = {
    selectedRowKeys:
      teacherSelectedPerPage[paginationTeacher.current],
    onChange: teacherSelectChange,
  };

  const onStudentChange = debounce((_e) => {
    setStudentParam({ ...studentParam, search: _e.target.value })
  }, 3000);
  const onStudentSearch = (value, _e, info) => {
    setStudentParam({ ...studentParam, search: value });
  }
  const onStudentSelect = (options) => {
    setStudentParam({ ...studentParam, courseNums: options })
  }
  const onTeacherChange = debounce((_e) => {
    setTeacherParam({ ...teacherParam, search: _e.target.value })
  }, 3000);
  const onTeacherSearch = (value, _e, info) => {
    setTeacherParam({ ...teacherParam, search: value });
  }
  const handleView = (record, code) => {
    setTestNo(code);
    setOpenModalPreview(true);
    setViewLoading(true);
    testSetDetailService(
      { testId: record.id, code: code },
      (res) => {
        setViewLoading(false);
        setQuestions(res.data.lstQuestion);
        setTestDetail(res.data.testSet);
      },
      (error) => {
        notify.error("Lỗi!");
        setViewLoading(true);
      }
    );
  };
  const dataFetch = allTest?.map((obj, index) => ({
    name: obj.name,
    key: (index + 1).toString(),
    questionQuantity: obj.questionQuantity,
    subjectName: obj.subjectName,
    duration: obj.duration,
    id: obj.id,
    semester: obj.semester,
    testSetNos: obj.testSetNos,
    lstTestSetCode: obj.lstTestSetCode,
    testSet:
      obj.lstTestSetCode && obj.lstTestSetCode.length > 0
        ? obj.lstTestSetCode.split(",").length
        : 0,
  }));
  const studentList = allStudents.map((obj, index) => ({
    key: obj.id,
    name: obj.lastName + " " + obj.firstName,
    email: obj.email,
    code: obj.code,
    id: obj.id,
    courseNum: obj.courseNum,
  }));
  const teacherList = allTeachers.map((obj, index) => ({
    key: obj.id,
    name: obj.lastName + " " + obj.firstName,
    email: obj.email,
    phoneNumber: obj.phoneNumber,
    code: obj.code,
    id: obj.id,
  }));
  return (
    <div className="exam-class-info">
      <p className="info-header">{infoHeader}</p>
      <Form
        name="info-exam-class-form"
        className="info-exam-class-form"
        initialValues={initialValues}
        onFinish={onFinish}
        form={form}
      >
        <div className="info-exam-class-header">Thông tin lớp thi</div>
        <Form.Item
          name="semesterId"
          label="Kỳ thi"
          rules={[{ required: true, message: "Chưa chọn kỳ thi" }]}
        >
          <Select
            loading={semesterLoading}
            placeholder="Chọn kỳ thi"
            options={getOptions(allSemester, false)}
            style={{ height: 45 }}
            onChange={(value) =>
              setParam({ ...param, semesterId: value })
            }
          />
        </Form.Item>
        <Form.Item
          name="subjectId"
          colon={true}
          label="Môn thi"
          rules={[
            {
              required: true,
              message: "Chưa chọn môn thi",
            },
          ]}
        >
          <Select
            placeholder="Chọn môn thi"
            loading={subLoading}
            options={getOptions(allSubjects)}
            style={{ height: 45 }}
            onChange={(value) =>
              setParam({ ...param, subjectId: value })
            }
          ></Select>
        </Form.Item>
        <Form.Item
          name="code"
          label="Mã lớp thi"
          colon={true}
          rules={[
            {
              required: true,
              message: "Chưa điền mã lớp thi",
            },
          ]}
        >
          <Input placeholder="Nhập mã lớp thi" />
        </Form.Item>
        <Form.Item
          name="roomName"
          label="Phòng thi"
          colon={true}
          rules={[
            {
              required: true,
              message: "Chưa điền phòng thi",
            },
          ]}
        >
          <Input placeholder="Vui lòng nhập phòng thi" />
        </Form.Item>
        <Form.Item
          name="examineTime"
          colon={true}
          label="Thời gian thi"
          rules={[
            {
              required: true,
              message: "Chưa chọn thời gian thi",
            },
          ]}
        >
          <DatePicker
            placeholder="Chọn thời gian thi"
            format={"HH:mm - DD/MM/YYYY"}
            showTime={{ format: "HH:mm" }}
            disabledDate={disabledDate}
          ></DatePicker>
        </Form.Item>

        <Form.Item name="lstStudentId" label="Sinh viên">
          <div className="test-select">
            <Input
              placeholder="Chọn sinh viên"
              value={studentSelected.length > 0 ? `Đã chọn ${studentSelected.length} sinh viên` : ""}
            />
            <Button onClick={() => setOpenStudentModal(true)}>Chọn</Button>
          </div>
        </Form.Item>
        <Form.Item
          name="testId"
          label="Đề thi"
          colon={true}
          rules={[
            {
              required: true,
              message: "Chưa chọn bộ đề thi",
            },
          ]}
        >
          <div className="test-select">
            <Popover
              content={testValue}
              placement="bottom"
              trigger="hover"
            >
              <Input
                placeholder="Chọn đề thi"
                value={testValue}
              />
            </Popover>
            <Button onClick={() => setOpenModal(true)}>Chọn</Button>
          </div>
        </Form.Item>
        <Form.Item name="lstSupervisorId" label="Giám thị">
          <div className="test-select">
            <Input
              placeholder="Chọn giảng viên"
              value={teacherSelected.length > 0 ? `Đã chọn ${teacherSelected.length} giảng viên` : ""}
            />
            <Button onClick={() => setOpenTeacherModal(true)}>Chọn</Button>
          </div>
        </Form.Item>
        <Form.Item className="btn-info">
          <Button
            type="primary"
            htmlType="submit"
            block
            loading={loading}
            style={{ width: 150, height: 50 }}
          >
            {btnText}
          </Button>
        </Form.Item>
      </Form>
      <Modal
        className="exam-class-modal"
        open={openModal}
        cancelText="Quay lại"
        title="Danh sách đề thi"
        onOk={() => setOpenModal(false)}
        onCancel={() => setOpenModal(false)}
        maskClosable={true}
        centered={true}
      >
        <Table
          size="small"
          scroll={{ y: 408 }}
          className="test-list-exam-class-table"
          columns={columns}
          dataSource={dataFetch}
          loading={tableLoading}
          expandable={{
            expandedRowRender: (record) => (
              <div className="test-set-item-examclass">
                <span className="test-set-no-label">
                  Mã đề:
                </span>
                <div className="test-set-no-examclass">
                  {record.lstTestSetCode &&
                    record.lstTestSetCode
                      .split(",")
                      .map((item, index) => {
                        return (
                          <Button
                            key={index}
                            onClick={() => {
                              setOpenModalPreview(true);
                              handleView(record, item);
                            }}
                          >
                            {item}
                          </Button>
                        );
                      })}
                </div>
              </div>
            ),
          }}
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
      </Modal>
      <Modal
        className="exam-class-modal"
        open={openStudentModal}
        cancelText="Quay lại"
        title="Danh sách sinh viên"
        onOk={() => setOpenStudentModal(false)}
        onCancel={() => setOpenStudentModal(false)}
        maskClosable={true}
        centered={true}
      >
        <div className="selected-number-text">{`Đã chọn: ${studentSelected.length} sinh viên`}</div>
        <SearchFilter displayFilter placeholder="Nhập tên hoặc MSSV" options={courseNumOptions} onSearch={onStudentSearch} onChange={onStudentChange} onSelect={onStudentSelect} />
        <Table
          size="small"
          scroll={{ y: 320 }}
          className="student-exam-class-table"
          columns={studentColumns}
          dataSource={studentList}
          rowSelection={rowStudentSelection}
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
              setStudentParam({
                ...studentParam,
                page: page - 1,
                size: pageSize,
              });
            },
            onShowSizeChange: (current, size) => {
              setStudentParam({
                ...studentParam,
                size: size,
              });
            },
          }}
        />
      </Modal>
      <Modal
        className="exam-class-modal"
        cancelText="Quay lại"
        open={openTeacherModal}
        title="Danh sách giảng viên"
        onOk={() => setOpenTeacherModal(false)}
        onCancel={() => setOpenTeacherModal(false)}
        maskClosable={true}
        centered={true}
      >
        <div className="selected-number-text">{`Đã chọn: ${teacherSelected.length} giảng viên`}</div>
        <SearchFilter displayFilter={false} placeholder="Nhập tên hoặc mã cán bộ" onChange={onTeacherChange} onSearch={onTeacherSearch} />
        <Table
          size="small"
          scroll={{ y: 320 }}
          className="teacher-exam-class-table"
          columns={teacherColumns}
          dataSource={teacherList}
          rowSelection={rowTeacherSelection}
          loading={tableTeacherLoading}
          pagination={{
            current: paginationTeacher.current,
            total: paginationTeacher.total,
            pageSize: paginationTeacher.pageSize,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50", "100"],
            locale: customPaginationText,
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
              setTeacherParam({
                ...teacherParam,
                page: page - 1,
                size: pageSize,
              });
            },
            onShowSizeChange: (current, size) => {
              setTeacherParam({
                ...teacherParam,
                size: size,
              });
            },
          }}
        />
      </Modal>
      <Modal
        className="modal-preview-test"
        open={openModalPreview}
        onCancel={() => setOpenModalPreview(false)}
        maskClosable={true}
        centered={true}
        footer={[
          <Button key="back" onClick={() => setOpenModalPreview(false)}>
            Quay lại
          </Button>,
        ]}
      >
        <Spin tip="Đang tải..." spinning={viewLoading}>
          <TestPreview
            questions={questions}
            testDetail={testDetail}
            testNo={testNo}
          />
        </Spin>
      </Modal>
    </div>
  );
};
export default UpdateExamClassInfoForm;
