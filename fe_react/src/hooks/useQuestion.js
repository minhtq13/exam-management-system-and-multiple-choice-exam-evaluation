import { useState } from "react";
import {
	getQuestionDetailsService,
	getQuestionService,
} from "../services/questionServices";
import useNotify from "./useNotify";

const useQuestions = () => {
	const [allQuestions, setAllQuestions] = useState([]);
	const [quesLoading, setQuesLoading] = useState(false);
	const [questionInfo, setQuestionInfo] = useState({});
	const [infoLoading, setInfoLoading] = useState(true);
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
				setQuesLoading(false);
			},
			(error) => {
				notify.error("Chưa chọn môn học để hiển thị câu hỏi!");
				setQuesLoading(true);
			}
		);
	};

	const getQuestionDetail = (payload, questionId) => {
		setInfoLoading(true);
		getQuestionDetailsService(
			questionId,
			payload,
			(res) => {
				setQuestionInfo(res.data);
				setInfoLoading(false);
			},
			(error) => {
				setInfoLoading(false);
				notify.error("Không thể lấy thông tin câu hỏi!");
			}
		);
	};
	return {
		allQuestions,
		getAllQuestions,
		quesLoading,
		getQuestionDetail,
		questionInfo,
		infoLoading,
	};
};
export default useQuestions;
