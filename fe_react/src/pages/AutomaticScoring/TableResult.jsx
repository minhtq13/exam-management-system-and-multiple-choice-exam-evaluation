/* eslint-disable jsx-a11y/anchor-is-valid */
import { Table } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import { generateRandomSixDigitNumber } from "../../utils/tools";

const TableResult = ({ resultAI }) => {
  const columnsAnswer = [];
  for (var i = 0; i < 15; i++) {
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
      dataIndex: "classCode",
      key: "classCode",
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
      dataIndex: "testNo",
      key: "testNo",
      fixed: "left",
    },
  ];
  const columnsMark = [
    {
      title: "Điểm",
      key: "operation",
      fixed: "right",
      align: "center",
      width: 100,
      render: () => <a>10</a>,
    },
  ];
  const columnsMerged = [...columnsInfo, ...columnsAnswer];
  const columns = [...columnsMerged, ...columnsMark];

  const [dataArray, setDataArray] = useState([]); // Sử dụng state mới thay vì data

  useEffect(() => {
    if (resultAI) {
      const newDataArray = resultAI.map((item, key) => {
        const formatObj = {
          stt: key + 1,
          classCode: item.classCode,
          studentCode: item.studentCode,
          testNo: item.testNo,
          key: generateRandomSixDigitNumber(),
        };
        for (let j = 0; j < 15; j++) {
          formatObj[`answer${j + 1}`] = item.answers[j].isSelected;
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
