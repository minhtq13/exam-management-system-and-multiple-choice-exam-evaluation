import AutomaticScoring from "../pages/AutomaticScoring/AutomaticScoring";
import AddBlog from "../pages/Blogs/AddBlog/AddBlog";
import AllBlogs from "../pages/Blogs/AllBlogs/AllBlogs";
import EditBlog from "../pages/Blogs/EditBlog/EditBlog";
import AdminDashboard from "../pages/Dashboard/AdminDashboard/AdminDashboard";
import StudentDashboard from "../pages/Dashboard/StudentDashboard/StudentDashboard";
import TeacherDashboard from "../pages/Dashboard/TeacherDashboard/TeacherDashboard";

import Home from "../pages/Home/Home";
import Library from "../pages/Library/Library";
import Login from "../pages/Login/Login";
import NotFound from "../pages/NotFound";
import AddQuestions from "../pages/Questions/AddQuestion/AddQuestions";
import Register from "../pages/Register/Register";
import StudentAdd from "../pages/Students/StudentAdd/StudentAdd";
import StudentEdit from "../pages/Students/StudentEdit/StudentEdit";
import StudentList from "../pages/Students/StudentList/StudentList";
import StudentView from "../pages/Students/StudentView/StudentView";
import SubjectAdd from "../pages/Subjects/SubjectAdd/SubjectAdd";
import SubjectEdit from "../pages/Subjects/SubjectEdit/SubjectEdit";
import SubjectList from "../pages/Subjects/SubjectList/SubjectList";
import SubjectView from "../pages/Subjects/SubjectView/SubjectView";
import TeacherAdd from "../pages/Teachers/TeacherAdd/TeacherAdd";
import TeacherEdit from "../pages/Teachers/TeacherEdit/TeacherEdit";
import TeacherList from "../pages/Teachers/TeacherList/TeacherList";
import TeacherView from "../pages/Teachers/TeacherView/TeacherView";
import TestCreate from "../pages/Test/TestCreate/TestCreate";
import TestList from "../pages/Test/TestList/TestList";
import TestSetCreate from "../pages/TestSet/TestSetCreate/TestSetCreate";
import TimeTable from "../pages/TimeTable/TimeTable";
import { appPath } from "./appPath";
import QuestionList from "../pages/Questions/QuestionList/QuestionList";
import QuestionEdit from "../pages/Questions/QuestionEdit/QuestionEdit";
import ExamClassList from "../pages/ExamClass/ExamClassList/ExamClassList";

const publicRoutes = [
	{ path: appPath.notFound, component: NotFound },
	{ path: appPath.default, component: Home },
	{ path: appPath.studentDashboard, component: StudentDashboard },
	{ path: appPath.teacherDashboard, component: TeacherDashboard },
	{ path: appPath.adminDashboard, component: AdminDashboard },
	//student
	{ path: appPath.studentAdd, component: StudentAdd },
	{ path: appPath.studentEdit, component: StudentEdit },
	{ path: appPath.studentEdit + "/:code", component: StudentEdit },
	{ path: appPath.studentList, component: StudentList },
	{ path: appPath.studentView, component: StudentView },
	//teacher
	{ path: appPath.teacherEdit, component: TeacherEdit },
	{ path: appPath.teacherEdit + "/:code", component: TeacherEdit },
	{ path: appPath.teacherList, component: TeacherList },
	{ path: appPath.teacherAdd, component: TeacherAdd },
	{ path: appPath.teacherView, component: TeacherView },
	//subject
	{ path: appPath.subjectEdit, component: SubjectEdit },
	{ path: appPath.subjectAdd, component: SubjectAdd },
	{ path: appPath.subjectList, component: SubjectList },
	{ path: appPath.subjectView, component: SubjectView },
	{ path: appPath.subjectView + "/:code", component: SubjectView },
	{ path: appPath.subjectEdit + "/:code", component: SubjectEdit },
	//exament: ExamList },
	{ path: appPath.automaticScoring, component: AutomaticScoring },
	{ path: appPath.library, component: Library },
	{ path: appPath.addBlog, component: AddBlog },
	{ path: appPath.allBlogs, component: AllBlogs },
	{ path: appPath.editBlog, component: EditBlog },
	{ path: appPath.timeTable, component: TimeTable },
	//question
	{ path: appPath.listQuestions, component: QuestionList },
	{ path: appPath.questionEdit, component: QuestionEdit },
	{ path: appPath.questionEdit + "/:id", component: QuestionEdit },
	{ path: appPath.addQuestions, component: AddQuestions },
	//test
	{ path: appPath.testList, component: TestList },
	{ path: appPath.testCreate, component: TestCreate },
	{ path: appPath.testSetCreate, component: TestSetCreate },
	{ path: appPath.testSetCreate + "/:testId", component: TestSetCreate },
	{
		path: appPath.login,
		component: Login,
		layout: "SignLayout",
		// isPrivateRouter: true,
	},
	{
		path: appPath.register,
		component: Register,
		layout: "SignLayout",
		// isPrivateRouter: true,
	},
	//exam class
	{ path: appPath.examClassList, component: ExamClassList },
	// private routes

	// { path: appPath.movieChair, component: MovieChair },
];

const privateRoutes = [];
export { privateRoutes, publicRoutes };
