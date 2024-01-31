/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { Button, List, Modal, Select, Space, Spin, Table } from "antd";
import React, { useEffect, useState } from "react";
import { AiFillEye } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import addIcon from "../../../assets/images/svg/add-icon.svg";
import deleteIcon from "../../../assets/images/svg/delete-icon.svg";
import deletePopUpIcon from "../../../assets/images/svg/delete-popup-icon.svg";
import ModalPopup from "../../../components/ModalPopup/ModalPopup";
import TestPreview from "../../../components/TestPreview/TestPreview";
import { appPath } from "../../../config/appPath";
import useCombo from "../../../hooks/useCombo";
import useImportExport from "../../../hooks/useImportExport";
import useNotify from "../../../hooks/useNotify";
import useTest from "../../../hooks/useTest";
import { setSelectedItem } from "../../../redux/slices/appSlice";
import { deleteTestService, testSetDetailService } from "../../../services/testServices";
import "./TestList.scss";
import { customPaginationText, downloadTestPdf } from "../../../utils/tools";
import { HUST_COLOR } from "../../../utils/constant";
import ActionButton from "../../../components/ActionButton/ActionButton";
import { setDetailTest } from "../../../utils/storage";
const TestList = () => {
  const [deleteDisable, setDeleteDisable] = useState(true);
  const { allTest, getAllTests, tableLoading, pagination } = useTest();
  const { subLoading, allSubjects, getAllSubjects, allSemester, semesterLoading, getAllSemesters } =
    useCombo();
  const initialParam = { jectId: null, semesterId: null, page: 0, size: 10 };
  const { loadingExport } = useImportExport();
  const [deleteKey, setDeleteKey] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [openModalPreview, setOpenModalPreview] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [testDetail, setTestDetail] = useState({});
  const [testNo, setTestNo] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [testItem, setTestItem] = useState({});
  const [testSetNos, setTestSetNos] = useState([]);
  const [param, setParam] = useState(initialParam);
  const handleCreate = (record) => {
    setDetailTest(record);
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
      title: "Học kỳ",
      dataIndex: "semester",
      key: "semester",
      align: "center",
      width: "12%",
    },
    {
      title: "Học phần",
      dataIndex: "subjectName",
      key: "subjectName",
      width: "22%",
    },
    {
      title: "Số câu hỏi",
      dataIndex: "questionQuantity",
      key: "questionQuantity",
      width: "8%",
      align: "center"
    },
    {
      title: "Thời gian làm bài",
      dataIndex: "duration",
      key: "duration",
      width: "12%",
      align: "center",
      render: (text) => (text ? `${text} phút` : ""),
    },
    {
      title: "Số bộ đề",
      dataIndex: "numberOfTestSet",
      key: "numberOfTestSet",
      width: "10%",
      align: "center",
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      width: "10%",
    },
    {
      title: "Ngày sửa đổi",
      dataIndex: "modifiedAt",
      key: "modifiedAt",
      width: "10%",
    },
    {
      title: "Thao tác",
      key: "action",
      align: "center",
      render: (_, record) => (
        <>
          <Space size="middle" style={{ display: "flex", alignItems: "center", cursor: "pointer", justifyContent: "center" }}>
            <ActionButton icon="view-test-set" handleClick={() => {
              setTestItem(record);
              setTestSetNos(
                record.lstTestSetCode && record.lstTestSetCode.length > 0
                  ? record.lstTestSetCode.split(",")
                  : []
              );
              setOpenModal(true);
            }} />
            <ActionButton icon="create-test-set" handleClick={() => handleCreate(record)} />
          </Space>
        </>
      ),
    },
  ];
  const dataFetch = allTest?.map((obj, index) => ({
    key: (index + 1).toString(),
    questionQuantity: obj.questionQuantity,
    semester: obj.semester,
    subjectName: obj.subjectName,
    createdAt: obj.createdAt?.split(" ")[0],
    modifiedAt: obj.modifiedAt?.split(" ")[0],
    duration: obj.duration,
    id: obj.id,
    testSetNos: obj.testSetNos,
    lstTestSetCode: obj.lstTestSetCode,
    numberOfTestSet: obj.lstTestSetCode !== null ? obj.lstTestSetCode.split(",").length : 0,
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
    selections: [Table.SELECTION_ALL, Table.SELECTION_NONE],
  };
  const handleClickAddTest = () => {
    navigate("/test-create");
  };
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

  const handleView = (item) => {
    setTestNo(item);
    setOpenModalPreview(true);
    setViewLoading(true);
    testSetDetailService(
      { testId: testItem.id ?? null, code: item },
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

  const handleEdit = () => {
    navigate(`${appPath.testEdit}/${testItem.id}/${testNo}`);
  };

  return (
    <div className="test-list">
      <div className="header-test-list">
        <p>Danh sách đề thi</p>
      </div>
      <div className="test-list-wrapper">
        <div className="search-filter-button">
          <div className="test-subject-semester">
            <div className="test-select test-select-semester">
              <span className="select-label">Học kỳ:</span>
              <Select
                allowClear
                showSearch
                placeholder="Kỳ thi"
                optionFilterProp="children"
                filterOption={(input, option) => (option?.label ?? "").includes(input)}
                optionLabelProp="label"
                options={semesterOptions}
                onChange={semsOnChange}
                loading={semesterLoading}
              />
            </div>
            <div className="test-select">
              <span className="select-label">Học phần:</span>
              <Select
                allowClear
                showSearch
                placeholder="Chọn học phần"
                optionFilterProp="children"
                filterOption={(input, option) => (option?.label ?? "").includes(input)}
                optionLabelProp="label"
                options={subjectOptions}
                onChange={subjectOnChange}
                loading={subLoading}
                style={{ minWidth: "260px", maxWidth: "260px" }}
              />
            </div>
          </div>
          <div className="block-button">
            {/* <ModalPopup
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
              ok={"Đồng ý"}
              onAccept={handleDelete}
            /> */}
            <Button className="options" onClick={handleClickAddTest}>
              <img src={addIcon} alt="Add Icon" />
              Thêm đề thi
            </Button>
          </div>
        </div>

        <Table
          scroll={{ y: 396 }}
          size="small"
          className="test-list-table"
          columns={columns}
          dataSource={dataFetch}
          // rowSelection={rowSelection}
          onRow={onRow}
          loading={tableLoading}
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
                trong <strong>{total}</strong> đề thi
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
          className="list-test-modal"
          open={openModal}
          title="Danh sách mã đề"
          onOk={() => setOpenModal(false)}
          onCancel={() => setOpenModal(false)}
          maskClosable={true}
          centered={true}
          footer={[
               <Button
               key="back"
               type="primary"
               onClick={() => setOpenModal(false)}
             >
               OK
             </Button>,
          ]}
        >
          <List
            itemLayout="horizontal"
            className="test-set-list"
            dataSource={testSetNos ?? []}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <div key="list-view" className="preview" onClick={() => handleView(item)}>
                    <div className="preview-text">Xem</div>
                    <AiFillEye color={HUST_COLOR} />
                  </div>,
                ]}
              >
                <List.Item.Meta title={`Mã đề thi: ${item}`}></List.Item.Meta>
              </List.Item>
            )}
          />
          <Modal
            className="test-list-preview"
            open={openModalPreview}
            okText="Tải xuống"
            onOk={() => {
              downloadTestPdf(questions, testDetail, testNo);
            }}
            footer={[
              <Button key="update" type="primary" onClick={handleEdit}>
                Cập nhật
              </Button>,
              <Button
                key="submit"
                type="primary"
                onClick={() => {
                  downloadTestPdf(questions, testDetail, testNo);
                }}
              >
                Tải xuống
              </Button>,
                 <Button
                 key="back"
                 onClick={() => setOpenModalPreview(false)}
               >
                 Đóng
               </Button>,
            ]}
            onCancel={() => setOpenModalPreview(false)}
            maskClosable={true}
            centered={true}
            style={{
              height: "80vh",
              width: "70vw",
            }}
            okButtonProps={{ loading: loadingExport }}
          >
            <Spin tip="Đang tải..." spinning={viewLoading}>
              <TestPreview questions={questions} testDetail={testDetail} testNo={testNo} />
            </Spin>
          </Modal>
        </Modal>
      </div>
    </div>
  );
};
export default TestList;
