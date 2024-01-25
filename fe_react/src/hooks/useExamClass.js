import { useState } from "react";
import useNotify from "./useNotify";
import {
	getExamClassDetailService,
	getPagingClassesService,
	getParticipantServices,
	getExamClassResultService,
} from "../services/examClassServices";
const useExamClasses = () => {
	const notify = useNotify();
	const [allExamClasses, setAllExamClasses] = useState([]);
	const [tableLoading, setTableLoading] = useState(true);
	const [pagination, setPagination] = useState({});
	const [examClassInfo, setExamClassInfo] = useState({});
	const [infoLoading, setInfoLoading] = useState(true);
	const [participants, setParticipants] = useState([]);
	const [partiLoading, setPartiLoading] = useState(true);
	const [resultLoading, setResultLoading] = useState(false);
	const [resultData, setResultData] = useState([]);
	const [dataPieChart, setPieDataChart] = useState([]);
	const [dataColumnChart, setColumnDataChart] = useState([]);

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
						err.response.data.message ||
							"No information in database"
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

	const getParticipants = (classId, roleType) => {
		setPartiLoading(true);
		getParticipantServices(
			classId,
			roleType,
			(res) => {
				setPartiLoading(false);
				setParticipants(res.data);
			},
			(error) => {
				notify.error("Không thể lấy danh sách người tham gia!");
				setPartiLoading(false);
			}
		);
	};

	const getResult = (examClassCode, param) => {
		setResultLoading(true);
		getExamClassResultService(
			examClassCode,
			param,
			(res) => {
				setResultData(res.data.results);
				setResultLoading(false);
				setColumnDataChart(res.data.columnChart)
				setPieDataChart(res.data.pieChart)
			},
			(error) => {
				notify.error("Không thể lấy kết quả thi!");
				setResultLoading(false);
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
		getParticipants,
		participants,
		partiLoading,
		getResult,
		resultLoading,
		resultData,
		dataPieChart, 
		dataColumnChart
	};
};

export default useExamClasses;
