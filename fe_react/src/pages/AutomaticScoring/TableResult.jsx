/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { Table } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import { generateRandomSixDigitNumber } from "../../utils/tools";
import ViewImage from "./ViewImage";

const TableResult = ({ resultAI }) => {
 

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
      title: "SDB",
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
        return (
          <ViewImage dataArray={dataArray} index={record.stt}/>
        );
      },
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
          totalScore: item.totalScore,
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
      <div>
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
      </div>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataArray]);
  const [pageSize, setPageSize] = useState(10);

  return (
    <div className="table-result-component">
      <Table
          className="table-ai"
          columns={columns}
          dataSource={dataArray}
          scroll={{
            x: 1500,
            y: 600,
          }}
          pagination = {{
            // Thuộc tính của pagination
            pageSize: pageSize,
            total: dataArray.length,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50", "100"],
						showQuickJumper: true,
            onChange: (page, pageSize) => {
              console.log('Page:', page, 'Page Size:', pageSize);
            },
            onShowSizeChange: (current, size) => {
              setPageSize(size)
              
              console.log('Current Page:', current, 'Page Size:', size);
            },
          }}
        />
    </div>
  );
};

export default TableResult;
