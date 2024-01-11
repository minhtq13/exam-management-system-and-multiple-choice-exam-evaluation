import { Button, Input, Table, Tabs } from "antd";
import React, { useEffect, useState } from "react";
import useImportExport from "../../../hooks/useImportExport";
import exportIcon from "../../../assets/images/svg/export-icon.svg";
import useExamClasses from "../../../hooks/useExamClass";
import { useSelector } from "react-redux";
import { customPaginationText } from "../../../utils/tools";
import "./ExamClassDetail.scss";
import { HUST_COLOR } from "../../../utils/constant";

const ExamClassDetail = () => {
  const { detailExamClass } = useSelector((state) => state.appReducer);
  useEffect(() => {
    setClassCode(detailExamClass.classCode);
    setRecord(detailExamClass.record);
    setClassId(detailExamClass.classId);
  }, [detailExamClass]);
  const [fileList, setFileList] = useState(null);
  const [roleType, setRoleType] = useState("STUDENT");
  const [classCode, setClassCode] = useState(null);
  const [record, setRecord] = useState({});
  const [classId, setClassId] = useState(null);

  const { partiLoading, participants, getParticipants, resultLoading, resultData } =
    useExamClasses();

  const { exportExamClassStudent } = useImportExport();
  useEffect(() => {
    if (classId && roleType !== "STATISTIC") {
      getParticipants(classId, roleType);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classId, roleType]);
  const handleExportStudent = () => {
    exportExamClassStudent(classCode);
  };
  const handleChange = (e) => {
    setFileList(e.target.files[0]);
  };
  const tabsData = participants.map((itemA, index) => {
    const correspondingItemB = resultData.find((itemB) => itemB.studentId === itemA.id);
    if (resultData.length > 0) {
      return {
        key: (index + 1).toString(),
        name: itemA.name,
        code: itemA.code,
        testSetCode: correspondingItemB ? correspondingItemB.testSetCode : null,
        totalPoints: correspondingItemB ? correspondingItemB.totalPoints : "Không có bài",
      };
    } else {
      return {
        key: (index + 1).toString(),
        name: itemA.name,
        code: itemA.code,
      };
    }
  });
  const tabsColumn = [
    {
      title: "Họ tên",
      dataIndex: "name",
      key: "name",
      width: "25%",
      align: "center",
    },
    {
      title: roleType === "STUDENT" ? "MSSV" : "Mã cán bộ",
      dataIndex: "code",
      key: "code",
      width: "12%",
      align: "center",
    },
  ];
  const addTabsColumn = [
    {
      title: "Mã đề thi",
      dataIndex: "testSetCode",
      key: "testSetCode",
      width: "12%",
      align: "center",
    },
    {
      title: "Điểm thi",
      dataIndex: "totalPoints",
      key: "totalPoint",
      width: "12%",
      align: "center",
    },
  ];

  const [pageSize, setPageSize] = useState(10);

  const renderTabStatistic = () => {};
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
          scroll={{ y: 396 }}
          size="small"
          className="exam-class-detail-participants"
          columns={roleType === "STUDENT" ? [...tabsColumn, ...addTabsColumn] : tabsColumn}
          dataSource={tabsData}
          loading={partiLoading || resultLoading}
          pagination={{
            pageSize: pageSize,
            total: tabsData.length,
            locale: customPaginationText,
            showQuickJumper: true,
            showSizeChanger: true,
            showTotal: (total, range) => (
              <span>
                <strong>
                  {range[0]}-{range[1]}
                </strong>{" "}
                trong <strong>{total}</strong> bản ghi
              </span>
            ),
            pageSizeOptions: ["10", "20", "50", "100"],
            onChange: (page, pageSize) => {},
            onShowSizeChange: (current, size) => {
              setPageSize(size);
            },
          }}
        />
      </div>
    );
  };
  const tabsOptions = [
    {
      key: "STUDENT",
      label: <h3>Sinh viên</h3>,
      children: renderTab(),
    },
    {
      key: "SUPERVISOR",
      label: <h3>Giám thị</h3>,
      children: renderTab(),
    },
    {
      key: "STATISTIC",
      label: <h3>Thống kê</h3>,
      children: renderTabStatistic(),
    },
  ];
  return (
    <div>
      <h1 style={{ color: HUST_COLOR, fontSize: "30px", padding: "20px 0px", fontWeight: "600" }}>
        Chi tiết lớp thi
      </h1>
      <div className="exam-class-participant-details">
        <div className="exam-class-info-details">
          <div className="exam-class-participant-left">
            <div>{`Môn thi: ${record.subjectTitle}`}</div>
            <div>{`Mã lớp thi: ${record.code}`}</div>
            <div>{`Học kỳ: ${record.semester}`}</div>
          </div>
          <div className="exam-class-participant-right">
            <div>{`Phòng thi: ${record.roomName}`}</div>
            <div>{`Ngày thi: ${record.date}`}</div>
          </div>
          <div className="exam-class-participant-right">
            <div>{`Giờ thi: ${record.time}`}</div>
            <div>{`Trạng thái: ${
              resultData.length > 0 ? "Đã có điểm thi" : "Chưa có điểm thi"
            }`}</div>
          </div>
        </div>
        <Tabs defaultActiveKey="STUDENT" items={tabsOptions} onChange={(key) => setRoleType(key)} />
      </div>
    </div>
  );
};

export default ExamClassDetail;
