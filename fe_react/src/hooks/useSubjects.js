import { useState } from "react";
import {
  getAllSubjectsService,
  getChaptersService,
  getSubjectByCodeService
} from "../services/subjectsService";
import useNotify from "./useNotify";

const useSubjects = () => {
  const notify = useNotify();
  const [allSubjects, setAllSubjects] = useState([]);
  const [tableLoading, setTableLoading] = useState(true);
  const [subjectInfo, setSubjectInfo] = useState({});
  const [infoLoading, setInfoLoading] = useState(true);
  const [allChapters, setAllChapters] = useState([]);
  const [chapterLoading, setChapterLoading] = useState(false);

  const getAllSubjects = (payload = {}) => {
    setTableLoading(true);
    getAllSubjectsService(
      payload,
      (res) => {
        setAllSubjects(res.data);
        setTableLoading(false);
      },
      (err) => {
        setTableLoading(false);
        if (err.response.status === 401) {
          notify.warning(err.response.data.message || "Permission denied");
        }
        if (err.response.status === 404) {
          notify.warning(
            err.response.data.message || "No information in database"
          );
        }
      }
    );
  };
  const getSubjectByCode = (payload = {}, code) => {
    setInfoLoading(true);
    getSubjectByCodeService(
      code,
      payload,
      (res) => {
        setSubjectInfo(res.data);
        setInfoLoading(false);
      },
      (error) => {
        notify.error("Không thể lấy thông tin học phần");
      }
    );
  }
  const getAllChapters = (payload = {}, code) => {
    setChapterLoading(true);
    getChaptersService(
      code,
      payload,
      (res) => {
        setAllChapters(res.data);
        setChapterLoading(false);
      },
      (err) => {
        setChapterLoading(false);
        if (err.response.status === 401) {
          notify.warning(err.response.data.message || "Permission denied");
        }
        if (err.response.status === 404) {
          notify.warning(
            err.response.data.message || "No information in database"
          );
        }
      }
    );
  };
  return {
    allSubjects,
    getAllSubjects,
    tableLoading,
    subjectInfo,
    getSubjectByCode,
    infoLoading,
    allChapters,
    chapterLoading,
    getAllChapters
  };
};

export default useSubjects;
