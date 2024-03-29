import { Button, Input, Table, Tabs, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import exportIcon from "../../../assets/images/svg/export-icon.svg";
import useExamClasses from "../../../hooks/useExamClass";
import useImportExport from "../../../hooks/useImportExport";
import { HUST_COLOR } from "../../../utils/constant";
import { getDetailExamClass } from "../../../utils/storage";
import { customPaginationText } from "../../../utils/tools";
import ChartColumn from "./ChartColumn";
import ChartPie from "./ChartPie";
import "./ExamClassDetail.scss";
import { ImportOutlined } from "@ant-design/icons";

const ExamClassDetail = () => {
  const detailExamClass = getDetailExamClass();
  const [fileList, setFileList] = useState(null);
  const [roleType, setRoleType] = useState("STUDENT");
  const classId = detailExamClass.classId;
  const record = detailExamClass.record;
  const classCode = detailExamClass.classCode;

  const {
    partiLoading,
    participants,
    getParticipants,
    resultLoading,
    resultData,
    getResult,
    dataPieChart,
    dataColumnChart,
  } = useExamClasses();

  const { exportExamClassStudent } = useImportExport();
  useEffect(() => {
    if (classId && roleType !== "STATISTIC") {
      getParticipants(classId, roleType);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classId, roleType]);
  const handleExportStudent = () => {
    exportExamClassStudent(detailExamClass.classCode);
  };
  const handleChange = (e) => {
    setFileList(e.target.files[0]);
  };
  useEffect(() => {
    if (classCode) {
      getResult(classCode, {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classCode, roleType]);
  const tabsData = participants.map((item, index) => {
    const rowItem = resultData.find((subItem) => subItem.studentId === item.id);
    if (resultData.length > 0) {
      return {
        key: (index + 1).toString(),
        name: item.name,
        code: item.code,
        testSetCode: rowItem ? rowItem.testSetCode : null,
        totalPoints: rowItem ? Math.round(rowItem.totalPoints * 100) / 100 : "",
      };
    } else {
      return {
        key: (index + 1).toString(),
        name: item.name,
        code: item.code,
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

  const renderTabStatistic = () => {
    return (
      <div className="charts">
        <ChartColumn dataColumnChart={dataColumnChart} resultData={resultData} />
        <ChartPie dataPieChart={dataPieChart} resultData={resultData} />
      </div>
    );
  };
  const renderTab = () => {
    return (
      <div className="exam-class-tabs">
        {roleType === "STUDENT" && (
          <div className="tab-button" style={{ marginBottom: 20 }}>
            <Tooltip title="Export">
              <Button className="options" onClick={handleExportStudent}>
                <img src={exportIcon} alt="Tải xuống Icon" />
              </Button>
            </Tooltip>
            <Input style={{maxWidth: 300}} type="file" name="file" onChange={(e) => handleChange(e)}></Input>
            <Tooltip title="Import">
              <Button
                type="primary"
                //onClick={handleUpload}
                disabled={!fileList}
                //loading={loadingImport}
              >
                <ImportOutlined />
              </Button>
            </Tooltip>
          </div>
        )}
        <Table
          scroll={{ y: 390 }}
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
          </div>
          <div className="exam-class-participant-right">
            <div>{`Học kỳ: ${record.semester}`}</div>
            <div>{`Phòng thi: ${record.roomName}`}</div>
          </div>
          <div className="exam-class-participant-right">
            <div>{`Ngày thi: ${record.date}`}</div>
            <div>{`Giờ thi: ${record.time}`}</div>
          </div>
          <div className="exam-class-participant-right">
            <div>
              Trạng thái:{" "}
              {resultData.length > 0 ? (
                <span style={{ fontSize: 16, fontWeight: 600 }}>Đã có điểm thi</span>
              ) : (
                <span style={{ fontSize: 16, fontWeight: 600, color: HUST_COLOR }}>Chưa có điểm thi</span>
              )}
            </div>
          </div>
        </div>
        <Tabs
          defaultActiveKey="STUDENT"
          items={tabsOptions}
          onChange={(key) => setRoleType(key)}
        />
      </div>
    </div>
  );
};

export default ExamClassDetail;
