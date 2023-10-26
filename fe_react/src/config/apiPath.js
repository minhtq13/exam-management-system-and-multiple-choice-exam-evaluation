// export const BASE_URL = "https://61fe8c59a58a4e00173c98cc.mockapi.io";
export const BASE_URL = "http://localhost:8000";

export const apiPath = {
	// Authentication
	login: BASE_URL + "/api/v1/auth/signin",
	register: BASE_URL + "/api/v1/auth/signup",
	refreshToken: BASE_URL + "/api/v1/auth/refresh-token",
	// Student
	allStudents: BASE_URL + "/api/v1/student/list",
	updateStudent: BASE_URL + "/api/v1/student/update",
	addStudent: BASE_URL + "/api/v1/student/add",
	deleteStudent: BASE_URL + "/api/v1/student/disable",
	exportStudents: BASE_URL + "api/v1/student/export",
	// AI
	automaticScoring: BASE_URL + "/api/v1/student-test/auto/read",
	//Teacher:
	allTeachers: BASE_URL + "/api/v1/teacher/list",
	updateTeacher: BASE_URL + "/api/v1/teacher/update",
	addTeacher: BASE_URL + "/api/v1/teacher/add",
	deleteTeacher: BASE_URL + "/api/v1/teacher/disable",
	exportStudent: BASE_URL + "/api/v1/teacher/export",
	//Subject:
	allSubjects: BASE_URL + "/api/v1/subject/chapters",
	getSubjectByCode: BASE_URL + "/api/v1/subject",
	updateSubject: BASE_URL + "/api/v1/subject/update",
	addSubject: BASE_URL + "/api/v1/subject/add",
	deleteSubject: BASE_URL + "/api/v1/subject/disable",
	//Chapter:
	disableChapter: BASE_URL + "/api/v1/chapter/disable",
	addChapters: BASE_URL + "/api/v1",
	//Question:
	addQuestion: BASE_URL + "/api/v1/question/adds",
	getQuestionbyCode: BASE_URL + "/api/v1/question/list",
	deleteQuestion: BASE_URL + "/api/v1/question/disable",
	updateQuestion: BASE_URL + "/api/v1/question/update",
	//Test:
	testRandomCreate: BASE_URL + "/api/v1/test/create/random",
	testCreate: BASE_URL + "/api/v1/test/create",
	allTest: BASE_URL + "/api/v1/test/list",
	deleteTest: BASE_URL + "/api/v1/test/disable",
	//Test-set:
	testSetCreate: BASE_URL + "/api/v1/test-set",
	testSetDetail: BASE_URL + "/api/v1/test-set/detail",
	//Exam-class:
	examClassCreate: BASE_URL + "/api/v1/class/create",
	allExamClasses: BASE_URL + "/api/v1/class/list",
	examClassDetail: BASE_URL + "/api/v1/class/detail",
	disableExamClass: BASE_URL + "/api/v1/class/disable",
};
