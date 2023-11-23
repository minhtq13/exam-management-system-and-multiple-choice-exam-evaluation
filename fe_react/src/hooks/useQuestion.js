import { useState } from "react"
import { getQuestionService } from "../services/questionServices";
import useNotify from "./useNotify";

const useQuestions = () => {
  const [allQuestions, setAllQuestions] = useState([]);
  const notify = useNotify();
  const getAllQuestions = (payload) => {
    getQuestionService(
      payload.subjectId,
      payload.subjectCode,
      payload.chapterCode,
      payload.chapterIds && payload.chapterIds.length > 0 ? payload.chapterIds.join(",") : null,
      payload.level,
      (res) => {
        setAllQuestions(res.data);
        console.log(payload.chapterId && payload.chapterId.length > 0 ? payload.chapterId.join(",") : null)
      },
      (error) => {
        notify.error("Chưa chọn môn học để hiển thị câu hỏi!");
      }
    )
  }
  return {allQuestions, getAllQuestions}
} 
export default useQuestions;