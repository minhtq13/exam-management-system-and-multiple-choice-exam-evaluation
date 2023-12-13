export const BASE_URL = "http://localhost:8088/e-learning/api";

export const apiPath = {
	// Authentication
	login: BASE_URL + "/auth/login",
	profile: BASE_URL + "/auth/profile",
	refreshToken: BASE_URL + "/auth/token/refresh",
	// Student
	allStudents: BASE_URL + "/user/student/list",
	pageStudent: BASE_URL + "/user/student/page",
	updateStudent: BASE_URL + "/student/update",
	addStudent: BASE_URL + "/student/add",
	deleteStudent: BASE_URL + "/student/disable",
	exportStudents: BASE_URL + "/student/export",
	// AI
	automaticScoring: BASE_URL + "/test-set/scoring",
	resetTableResult: BASE_URL + "/test-set/scoring/result",
	//Teacher:
	allTeachers: BASE_URL + "/user/teacher/list",
	pageTeacher: BASE_URL + "/user/teacher/page",
	updateTeacher: BASE_URL + "/teacher/update",
	addTeacher: BASE_URL + "/teacher/add",
	deleteTeacher: BASE_URL + "/teacher/disable",
	exportStudent: BASE_URL + "/teacher/export",
	//Subject:
	allSubjects: BASE_URL + "/subject/list",
	getSubjectByCode: BASE_URL + "/subject/detail",
	updateSubject: BASE_URL + "/subject/",
	addSubject: BASE_URL + "/subject",
	deleteSubject: BASE_URL + "/subject/disable",
	//Chapter:
	disableChapter: BASE_URL + "/chapter/disable",
	updateChapter: BASE_URL + "/chapter",
	addChapter: BASE_URL + "/chapter",
	// TODO: CHECK URL
	addChapters: BASE_URL + "/v1",
	//Question:
	addQuestion: BASE_URL + "/question",
	getQuestionbyCode: BASE_URL + "/question",
	deleteQuestion: BASE_URL + "/question",
	updateQuestion: BASE_URL + "/question",
	getQuestionDetail: BASE_URL + "/question/detail",
	//Test:
	testRandomCreate: BASE_URL + "/test/create/random",
	testCreate: BASE_URL + "/test/create",
	allTest: BASE_URL + "/test",
	deleteTest: BASE_URL + "/test/disable",
	//Test-set:
	testSetCreate: BASE_URL + "/test-set/generate",
	testSetDetail: BASE_URL + "/test-set/detail",
	updateTestSet: BASE_URL + "/test-set",
	//Exam-class:
	examClassCreate: BASE_URL + "/exam-class",
	pageExamClasses: BASE_URL + "/exam-class/page",
	examClassDetail: BASE_URL + "/exam-class/detail",
	disableExamClass: BASE_URL + "/exam-class/disable",
	updateExamClass: BASE_URL + "/exam-class",
	getParticipant: BASE_URL + "/exam-class/participant/list",
	getExamClassResult: BASE_URL + "/std-test-set/result",
	//combo box
	comboQuestion: BASE_URL + "/combobox/subject",
	comboChapter: BASE_URL + "/combobox/subject/chapter",
	comboSemester: BASE_URL + "/combobox/semester",
	comboStudent: BASE_URL + "/combobox/user/student",
	comboTeacher: BASE_URL + "/combobox/user/teacher",
	// user
	createUser: BASE_URL + "/user",
	updateUser: BASE_URL + "/user",
	infoUser: BASE_URL + "/user",
};
