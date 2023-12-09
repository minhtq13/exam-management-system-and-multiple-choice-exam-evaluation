/* eslint-disable jsx-a11y/anchor-is-valid */
import { Table } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import { generateRandomSixDigitNumber } from "../../utils/tools";

const TableResult = ({ resultAI }) => {
  const numberAnswer = 60
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
      title: "STT",
      width: 60,
      align: "center",
      dataIndex: "stt",
      key: "stt",
      fixed: "left",
    },
    {
      title: "Mã lớp thi",
      width: 100,
      align: "center",
      dataIndex: "examClassCode",
      key: "examClassCode",
      fixed: "left",
    },
    {
      title: "Số báo danh",
      width: 150,
      align: "center",
      dataIndex: "studentCode",
      key: "studentCode",
      fixed: "left",
    },
    {
      title: "Mã đề thi",
      width: 100,
      align: "center",
      dataIndex: "testCode",
      key: "testCode",
      fixed: "left",
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
  ];
  const columnsMerged = [...columnsInfo, ...columnsAnswer];
  const columns = [...columnsMerged, ...columnsMark];

  const [dataArray, setDataArray] = useState([]);

  useEffect(() => {
    if (resultAI) {
      const newDataArray = resultAI.map((item, key) => {
        const formatObj = {
          stt: key + 1,
          examClassCode: item.examClassCode,
          studentCode: item.studentCode,
          testCode: item.testCode,
          key: generateRandomSixDigitNumber(),
          totalScore: item.totalScore
        };
        for (let j = 0; j < numberAnswer; j++) {
          formatObj[`answer${j + 1}`] = item.details[j].selectedAnswers;
        }
        return formatObj;
      });
      setDataArray(newDataArray);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resultAI]);
  // const [tableParams, setTableParams] = useState({
  //   pagination: {
  //     current: 1,
  //     pageSize: 10,
  //   },
  // });
  // const handleTableChange = (pagination, filters, sorter) => {
  //   setTableParams({
  //     pagination,
  //     filters,
  //     ...sorter,
  //   });

  //   if (pagination.pageSize !== tableParams.pagination?.pageSize) {
  //     setDataArray([]);
  //   }
  // };

  const renderTable = useMemo(() => {
    return (
      <Table
        // expandable={{
        //   expandedRowRender: (record) => (
        //     <p
        //       style={{
        //         margin: 0,
        //       }}
        //     >
        //       {record.description}
        //     </p>
        //   ),
        //   rowExpandable: (record) => record.isExpandable !== "Not Expandable",
        // }}
        className="table-ai"
        columns={columns}
        dataSource={dataArray}
        scroll={{
          x: 1500,
          y: 600,
        }}
        // pagination={tableParams.pagination}
        // onChange={handleTableChange}
      />
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataArray]);

  return <div className="table-result-component">{renderTable}</div>;
};

export default TableResult;
