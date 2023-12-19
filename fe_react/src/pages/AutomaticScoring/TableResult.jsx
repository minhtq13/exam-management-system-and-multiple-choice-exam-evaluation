/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { Table } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import { generateRandomSixDigitNumber } from "../../utils/tools";
import ViewImage from "./ViewImage";

const TableResult = ({ resultAI }) => {
  const [testCodeFilter, setTestCodeFilter] = useState([]);
  const numberAnswer = 60;
  const columnsAnswer = [];
  for (var i = 0; i < numberAnswer; i++) {
    columnsAnswer.push({
      title: `Câu ${i + 1}`,
      dataIndex: `answer${i + 1}`,
      width: 100,
      align: "center",
    });
  }
  const columnsInfo = [
    {
      title: "TT",
      width: 50,
      align: "center",
      dataIndex: "stt",
      key: "stt",
      fixed: "left",
    },
    {
      title: "MLT",
      width: 80,
      align: "center",
      dataIndex: "examClassCode",
      key: "examClassCode",
      fixed: "left",
    },
    {
      title: "MSSV",
      width: 100,
      align: "center",
      dataIndex: "studentCode",
      key: "studentCode",
      fixed: "left",
    },
    {
      title: "MĐT",
      width: 80,
      align: "center",
      dataIndex: "testCode",
      key: "testCode",
      fixed: "left",
      filters: testCodeFilter,
      filterSearch: true,
      onFilter: (value, record) => {
        return record.testCode === value;
      },
    },
  ];
  const columnsMark = [
    {
      title: "Điểm",
      key: "totalScore",
      dataIndex: "totalScore",
      fixed: "right",
      align: "center",
      width: 100,
    },
    {
      title: "Chi tiết",
      key: "imgHandle",
      dataIndex: "imgHandle",
      fixed: "right",
      align: "center",
      width: 150,
      render: (text, record) => {
        return <ViewImage dataArray={resultAI} index={record.stt} />;
      },
    },
  ];
  const columnsMerged = [...columnsInfo, ...columnsAnswer];
  const columns = [...columnsMerged, ...columnsMark];

  const [dataTable, setDataTable] = useState([]);

  useEffect(() => {
    if (resultAI) {
      const listTestCode = resultAI.reduce((acc, item, index) => {
        const existingIndex = acc.findIndex((el) => el.value === item.testCode);
        if (existingIndex === -1) {
          acc.push({ text: item.testCode, value: item.testCode });
        }
        return acc;
      }, []);

      const newDataTable = resultAI.map((item, key) => {
        const formatDataTable = {
          stt: key + 1,
          examClassCode: item.examClassCode,
          studentCode: item.studentCode,
          testCode: item.testCode,
          key: generateRandomSixDigitNumber(),
          totalScore: item.totalScore,
        };
        for (let j = 0; j < numberAnswer; j++) {
          formatDataTable[`answer${j + 1}`] = item.details[j].selectedAnswers;
        }
        return formatDataTable;
      });
      setTestCodeFilter(listTestCode);
      setDataTable(newDataTable);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resultAI]);
  const [pageSize, setPageSize] = useState(10);
  const renderTable = useMemo(() => {
    return (
      <Table
        className="table-ai"
        columns={columns}
        dataSource={dataTable}
        scroll={{ x: 1500, y: 487 }}
        size="middle"
        pagination={{
          pageSize: pageSize,
          total: dataTable.length,
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
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataTable, pageSize]);
  return <div className="table-result-component">{renderTable}</div>;
};

export default TableResult;
