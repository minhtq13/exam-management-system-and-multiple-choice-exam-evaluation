import { useState } from "react";
import useNotify from "./useNotify";
import {
  getExamClassDetailService,
  getPagingClassesService,
} from "../services/examClassServices";
const useExamClasses = () => {
  const notify = useNotify();
  const [allExamClasses, setAllExamClasses] = useState([]);
  const [tableLoading, setTableLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [examClassInfo, setExamClassInfo] = useState({});
  const [infoLoading, setInfoLoading] = useState(true);

  const getAllExamClasses = (payload) => {
    setTableLoading(true);
    getPagingClassesService(
      payload.code,
      payload.subjectId,
      payload.semesterId,
      payload.page,
      payload.size,
      payload.sort,
      (res) => {
        setAllExamClasses(res.data.content);
        setTableLoading(false);
        setPagination({
          current: res.data.pageable.pageNumber + 1,
          pageSize: res.data.pageable.pageSize,
          total: res.data.totalElements,
        });
      },
      (err) => {
        setTableLoading(true);
        if (err.response.status === 404) {
          notify.warning(
            err.response.data.message || "No information in database"
          );
        }
      }
    );
  };
  const getExamClassDetail = (payload = {}, classId) => {
    setInfoLoading(true);
    getExamClassDetailService(
      classId,
      payload,
      (res) => {
        setExamClassInfo(res.data);
        setInfoLoading(false);
      },
      (error) => {
        notify.error("Không thể lấy thông tin lớp thi!");
      }
    );
  };

  return {
    allExamClasses,
    getAllExamClasses,
    tableLoading,
    pagination,
    getExamClassDetail,
    examClassInfo,
    infoLoading,
  };
};

export default useExamClasses;
