import { useState } from "react";
import {
	getComboChapService,
	getComboExamClassService,
	getComboSemesterServices,
	getComboStudentServices,
	getComboSubService,
	getComboTeacherServices,
	getComboTestService,
} from "../services/comboServices";
import useNotify from "./useNotify";
const useCombo = () => {
	const [allSubjects, setAllSubjects] = useState([]);
	const [allChapters, setAllChapters] = useState([]);
	const [subLoading, setSubLoading] = useState(false);
	const [chapterLoading, setChapterLoading] = useState(false);
	const [allSemester, setAllSemester] = useState([]);
	const [semesterLoading, setSemesterLoading] = useState(false);
	const [allStudent, setAllStudent] = useState([]);
	const [studentLoading, setStudentLoading] = useState(false);
	const [allTeacher, setAllTeacher] = useState([]);
	const [teacherLoading, setTeacherLoading] = useState(false);
	const [allTest, setAllTest] = useState([]);
	const [testLoading, setTestLoading] = useState(false);
	const [examClass, setExamClass] = useState([]);
	const [examClassLoading, setExamClassLoading] = useState(false);
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
				setSubLoading(false);
				notify.error("Chưa chọn môn học để hiển thị câu hỏi!");
			}
		);
	};
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
				setChapterLoading(false);
				notify.error("Không thể lấy danh sách các chương!");
			}
		);
	};
	const getAllSemesters = (payload) => {
		setSemesterLoading(true);
		getComboSemesterServices(
			payload.search,
			(res) => {
				setAllSemester(res.data);
				setSemesterLoading(false);
			},
			(error) => {
				setSemesterLoading(false);
				notify.error("Không thể lấy danh sách kỳ học!");
			}
		);
	};

	const getAllStudent = (payload) => {
		setStudentLoading(true);
		getComboStudentServices(
			payload.studentName,
			payload.studentCode,
			(res) => {
				setAllStudent(res.data);
				setStudentLoading(false);
			},
			(error) => {
				setStudentLoading(false);
				notify.error("Không thể lấy danh sách sinh viên!");
			}
		);
	};

	const getAllTeacher = (payload) => {
		setTeacherLoading(true);
		getComboTeacherServices(
			payload.teacherName,
			payload.teacherCode,
			(res) => {
				setAllTeacher(res.data);
				setTeacherLoading(false);
			},
			(error) => {
				setTeacherLoading(false);
				notify.error("Không thể lấy danh sách giảng viên!");
			}
		);
	};
	const getAllTest = (payload) => {
		setTestLoading(true);
		getComboTestService(
			payload.testName,
			payload.testCode,
			(res) => {
				setAllTest(res.data);
				setTestLoading(false);
			},
			(error) => {
				notify.error("Không thể lấy danh sách kỳ thi!");
			}
		);
	};
	const getAllExamClass = (semesterId, subjectId, payload) => {
		setExamClassLoading(true);
		getComboExamClassService(
			semesterId,
			subjectId,
			payload,
			(res) => {
				setExamClass(res.data);
				setExamClassLoading(false);
			},
			(error) => {
				notify.error("Không thể lấy danh sách lớp thi!");
			}
		);
	};
	
	return {
		subLoading,
		chapterLoading,
		allSubjects,
		getAllSubjects,
		allChapters,
		getAllChapters,
		getAllSemesters,
		allSemester,
		semesterLoading,
		getAllStudent,
		studentLoading,
		teacherLoading,
		allStudent,
		allTeacher,
		getAllTeacher,
		getAllTest,
		testLoading,
		allTest,
		getAllExamClass,
		examClass,
		examClassLoading
	};
};
export default useCombo;
