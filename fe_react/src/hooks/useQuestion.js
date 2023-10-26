import { useState } from "react"
import { getQuestionByCodeService } from "../services/questionServices";
import useNotify from "./useNotify";

const useQuestions = () => {
  const [allQuestions, setAllQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const notify = useNotify();
  const getAllQuestions = (payload={}, code) => {
    setLoading(true);
    getQuestionByCodeService(
      code,
      payload,
      (res) => {
        setAllQuestions(res.data);
        setLoading(false);
      },
      (error) => {
        notify.error("Chưa chọn môn học để hiển thị câu hỏi!");
      }
    )
  }
  return {allQuestions, loading, getAllQuestions, setLoading}
} 
export default useQuestions;