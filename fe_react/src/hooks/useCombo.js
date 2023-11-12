import { useState } from "react"
import useNotify from "./useNotify";
import { getComboChapService, getComboSubService } from "../services/comboServices";
const useCombo = () => {
  const [allSubjects, setAllSubjects] = useState([]);
  const [allChapters, setAllChapters] = useState([]);
  const [subLoading, setSubLoading] = useState(false);
  const [chapterLoading, setChapterLoading] = useState(false);

  const notify = useNotify();
  const getAllSubjects = (payload) => {
    setSubLoading(true);
    getComboSubService(
      payload.subjectCode,
      payload.subjectTitle,
      (res) => {
        setAllSubjects(res.data);
        setSubLoading(false);
      },
      (error) => {
        notify.error("Chưa chọn môn học để hiển thị câu hỏi!");
      }
    )
  }
  const getAllChapters = (payload) => {
    setChapterLoading(true);
    getComboChapService(
      payload.subjectId,
      payload.chapterCode,
      payload.chapterTitle,
      (res) => {
        setAllChapters(res.data);
        setChapterLoading(false);
      },
      (error) => {
        notify.error("Chưa chọn môn học để hiển thị câu hỏi!");
      }
    )
  }
  return {subLoading, chapterLoading, allSubjects, getAllSubjects, allChapters, getAllChapters}
} 
export default useCombo;