import { useState } from "react";
import { getQuestionService } from "../services/questionServices";
import useNotify from "./useNotify";

const useQuestions = () => {
	const [allQuestions, setAllQuestions] = useState([]);
	const [quesLoading, setQuesLoading] = useState(false);
	const notify = useNotify();
	const getAllQuestions = (payload) => {
		setQuesLoading(true);
		getQuestionService(
			payload.subjectId,
			payload.subjectCode,
			payload.chapterCode,
			payload.chapterIds && payload.chapterIds.length > 0
				? payload.chapterIds.join(",")
				: null,
			payload.level,
			(res) => {
				setAllQuestions(res.data);
				console.log(
					payload.chapterId && payload.chapterId.length > 0
						? payload.chapterId.join(",")
						: null
				);
				setQuesLoading(false);
			},
			(error) => {
				notify.error("Chưa chọn môn học để hiển thị câu hỏi!");
				setQuesLoading(true);
			}
		);
	};
	return { allQuestions, getAllQuestions, quesLoading };
};
export default useQuestions;
