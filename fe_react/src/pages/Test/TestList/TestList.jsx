/* eslint-disable jsx-a11y/anchor-is-valid */
import { Button, List, Modal, Select, Space, Spin, Table } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import addIcon from "../../../assets/images/svg/add-icon.svg";
import deleteIcon from "../../../assets/images/svg/delete-icon.svg";
import deletePopUpIcon from "../../../assets/images/svg/delete-popup-icon.svg";
import { appPath } from "../../../config/appPath";
import useNotify from "../../../hooks/useNotify";
import { setSelectedItem } from "../../../redux/slices/appSlice";
import "./TestList.scss";
import ModalPopup from "../../../components/ModalPopup/ModalPopup";
import useTest from "../../../hooks/uesTest";
import {
  deleteTestService,
  testSetDetailService,
} from "../../../services/testServices";
import { AiFillEye } from "react-icons/ai";
import TestPreview from "../../../components/TestPreview/TestPreview";
import axios from "axios";
import useCombo from "../../../hooks/useCombo";
const TestList = () => {
  const [deleteDisable, setDeleteDisable] = useState(true);
  const { allTest, getAllTests, tableLoading } = useTest();
  const { subLoading, allSubjects, getAllSubjects } = useCombo();
  const [deleteKey, setDeleteKey] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [openModalPreview, setOpenModalPreview] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [testDetail, setTestDetail] = useState({});
  const [testNo, setTestNo] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [downLoading, setDownLoading] = useState(false);
  const [testItem, setTestItem] = useState({});
  const [testSetNos, setTestSetNos] = useState([]);
  const [param, setParam] = useState({ subjectId: null });
  const handleCreate = (record) => {
    console.log(record);
    navigate(`${appPath.testSetCreate}/${record.id}`);
  };
  useEffect(() => {
    getAllTests(param);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [param]);
  useEffect(() => {
    getAllSubjects({ subjectCode: null, subjectTitle: null });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const subjectOptions = allSubjects.map((item) => {
    return { value: item.id, label: item.name };
  });
  const subjectOnChange = (value) => {
    setParam({ subjectId: value });
  };
  const handleExport = (testId, testNo) => {
    setDownLoading(true);
    axios({
      url: `http://localhost:8088/e-learning/api/test-set/word/export/${testId}/${testNo}`, // Replace with your API endpoint
      method: "GET",
      responseType: "blob", // Set the response type to 'blob'
    })
      .then((response) => {
        // Create a download link
        setDownLoading(false);
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          `Test-${testDetail.testDay}-${testDetail.subjectCode}.docx`
        ); // Set the desired file name
        document.body.appendChild(link);
        link.click();
      })
      .catch((error) => {
        setDownLoading(false);
        notify.error("Lỗi tải file!");
        console.error("Lỗi tải file:", error);
      });
  };
  const notify = useNotify();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const onRow = (record) => {
    return {
      onClick: () => {
        dispatch(setSelectedItem(record));
      },
    };
  };
  const columns = [
    {
      title: "Học phần",
      dataIndex: "subjectName",
      key: "subjectName",
    },
    {
      title: "Số câu hỏi",
      dataIndex: "questionQuantity",
      key: "questionQuantity",
    },
    {
      title: "Thời gian làm bài",
      dataIndex: "duration",
      key: "duration",
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
    },
    {
      title: "Ngày sửa đổi",
      dataIndex: "modifiedAt",
      key: "modifiedAt",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <>
          <Space size="middle" style={{ cursor: "pointer" }}>
            <Button
              danger
              onClick={() => {
                setTestItem(record);
                console.log(record);
                setTestSetNos(record.lstTestSetCode.split(","));
                setOpenModal(true);
              }}
            >
              Xem bộ đề
            </Button>
            <Button onClick={() => handleCreate(record)}>Tạo bộ đề</Button>
          </Space>
        </>
      ),
    },
  ];
  const dataFetch = allTest?.map((obj, index) => ({
    key: (index + 1).toString(),
    questionQuantity: obj.questionQuantity,
    subjectName: obj.subjectName,
    createdAt: obj.createdAt,
    modifiedAt: obj.modifiedAt,
    duration: obj.duration,
    id: obj.id,
    testSetNos: obj.testSetNos,
    lstTestSetCode: obj.lstTestSetCode
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
  const handleClickAddTest = () => {
    navigate("/test-create");
  };
  // const handleEdit = (record) => {
  //   navigate(`${appPath.subjectView}/${record.code}`);
  // };
  const handleDelete = () => {
    deleteTestService(
      deleteKey,
      null,
      (res) => {
        notify.success("Xoá đề thi thành công!");
        getAllTests();
        setSelectedRowKeys([]);
      },
      (error) => {
        notify.error("Lỗi xoá đề thi!");
      }
    );
  };
  return (
    <div className="test-list">
      <div className="header-test-list">
        <p>Danh sách đề thi</p>
        <div className="block-button">
          <ModalPopup
            buttonOpenModal={
              <Button className="options" disabled={deleteDisable}>
                <img src={deleteIcon} alt="Delete Icon" />
                Xóa
              </Button>
            }
            title="Xóa đề thi"
            message={"Bạn chắc chắn muốn xóa đề thi này không? "}
            confirmMessage={"Thao tác này không thể hoàn tác"}
            icon={deletePopUpIcon}
            ok={"Ok"}
            onAccept={handleDelete}
          />
          <Button className="options" onClick={handleClickAddTest}>
            <img src={addIcon} alt="Add Icon" />
            Add Test
          </Button>
        </div>
      </div>
      <div className="test-list-wrapper">
        <div className="test-subject">
          <span className="select-label">Học phần:</span>
          <Select
            allowClear
            showSearch
            placeholder="Chọn môn học để hiển thị danh sách đề thi"
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.label ?? "").includes(input)
            }
            optionLabelProp="label"
            options={subjectOptions}
            onChange={subjectOnChange}
            loading={subLoading}
          />
        </div>
        <Table
          className="test-list-table"
          columns={columns}
          dataSource={dataFetch}
          rowSelection={rowSelection}
          pagination={{
            pageSize: 8,
          }}
          onRow={onRow}
          loading={tableLoading}
        />
        <Modal
          open={openModal}
          title="Danh sách mã đề"
          onOk={() => setOpenModal(false)}
          onCancel={() => setOpenModal(false)}
          maskClosable={true}
          style={{ height: "50vh", overflowY: "scroll" }}
          centered={true}
        >
          <List
            itemLayout="horizontal"
            className="test-set-list"
            dataSource={testSetNos}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <div
                    key="list-view"
                    className="preview"
                    onClick={() => {
                      setTestNo(item);
                      setOpenModalPreview(true);
                      setViewLoading(true);
                      testSetDetailService(
                        {testId: testItem.id ?? null, code: item},
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
                    }}
                  >
                    <div className="preview-text">Preview</div>
                    <AiFillEye color="#8c1515" />
                  </div>,
                ]}
              >
                <List.Item.Meta title={`Mã đề thi: ${item}`}></List.Item.Meta>
              </List.Item>
            )}
          />
        </Modal>
        <Modal
          open={openModalPreview}
          okText="Download"
          onOk={() => handleExport(testItem.id ? testItem.id : null, testNo)}
          onCancel={() => setOpenModalPreview(false)}
          maskClosable={true}
          centered={true}
          style={{ height: "80vh", overflowY: "scroll" }}
          width={"40vw"}
          okButtonProps={{ loading: downLoading }}
        >
          <Spin tip="Loading..." spinning={viewLoading}>
            <TestPreview
              questions={questions}
              testDetail={testDetail}
              testNo={testNo}
            />
          </Spin>
        </Modal>
      </div>
    </div>
  );
};
export default TestList;
