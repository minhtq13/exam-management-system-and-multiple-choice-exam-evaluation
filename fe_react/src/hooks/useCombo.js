import { useState } from "react";
import useNotify from "./useNotify";
import {
	getComboChapService,
	getComboSemesterServices,
	getComboStudentServices,
	getComboSubService,
	getComboTeacherServices,
} from "../services/comboServices";
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
				notify.error("Chưa chọn môn học để hiển thị câu hỏi!");
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
				notify.error("Chưa chọn môn học để hiển thị câu hỏi!");
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
				notify.error("Không thể lấy danh sách giảng viên!");
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
	};
};
export default useCombo;
