export const BASE_URL =
	"http://localhost:8088/e-learning";

export const apiPath = {
	// Authentication
	login: BASE_URL + "/api/auth/login",
	profile: BASE_URL + "/api/auth/profile",
	refreshToken: BASE_URL + "/api/auth/token/refresh",
	// Student
	allStudents: BASE_URL + "/api/user/student/list",
	pageStudent: BASE_URL + "/api/user/student/page",
	updateStudent: BASE_URL + "/api/student/update",
	addStudent: BASE_URL + "/api/student/add",
	deleteStudent: BASE_URL + "/api/student/disable",
	exportStudents: BASE_URL + "api/student/export",
	// AI
	automaticScoring: BASE_URL + "/api/student-test/auto/read",
	//Teacher:
	allTeachers: BASE_URL + "/api/user/teacher/list",
	pageTeacher: BASE_URL + "/api/user/teacher/page",
	updateTeacher: BASE_URL + "/api/teacher/update",
	addTeacher: BASE_URL + "/api/teacher/add",
	deleteTeacher: BASE_URL + "/api/teacher/disable",
	exportStudent: BASE_URL + "/api/teacher/export",
	//Subject:
	allSubjects: BASE_URL + "/api/subject/list",
	getSubjectByCode: BASE_URL + "/api/subject/detail",
	updateSubject: BASE_URL + "/api/subject/",
	addSubject: BASE_URL + "/api/subject",
	deleteSubject: BASE_URL + "/api/subject/disable",
	//Chapter:
	disableChapter: BASE_URL + "/api/chapter/disable",
	updateChapter: BASE_URL + "/api/chapter",
	addChapter: BASE_URL + "/api/chapter",
	// TODO: CHECK URL
	addChapters: BASE_URL + "/api/v1",
	//Question:
	addQuestion: BASE_URL + "/api/question",
	getQuestionbyCode: BASE_URL + "/api/question",
	deleteQuestion: BASE_URL + "/api/question/disable",
	updateQuestion: BASE_URL + "/api/question",
	getQuestionDetail: BASE_URL + "/api/question/detail",
	//Test:
	testRandomCreate: BASE_URL + "/api/test/create/random",
	testCreate: BASE_URL + "/api/test/create",
	allTest: BASE_URL + "/api/test",
	deleteTest: BASE_URL + "/api/test/disable",
	//Test-set:
	testSetCreate: BASE_URL + "/api/test-set/generate",
	testSetDetail: BASE_URL + "/api/test-set/detail",
	//Exam-class:
	examClassCreate: BASE_URL + "/api/exam-class",
	pageExamClasses: BASE_URL + "/api/exam-class/page",
	examClassDetail: BASE_URL + "/api/exam-class/detail",
	disableExamClass: BASE_URL + "/api/exam-class/disable",
	updateExamClass: BASE_URL + "/api/exam-class",
	getParticipant: BASE_URL + "/api/exam-class/participant/list",
	//combo box
	comboQuestion: BASE_URL + "/api/combobox/subject",
	comboChapter: BASE_URL + "/api/combobox/subject/chapter",
	comboSemester: BASE_URL + "/api/combobox/semester",
	// user
	createUser: BASE_URL + "/api/user",
	updateUser: BASE_URL + "/api/user",
	infoUser: BASE_URL + "/api/user",
};
