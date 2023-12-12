import axios from "axios";
import { BASE_URL } from "../config/apiPath";
import useNotify from "./useNotify";
import { useState } from "react";
import { capitalizeFirstLetter } from "../utils/tools";

const useImportExport = () => {
	const notify = useNotify();
	const [loadingExport, setLoadingExport] = useState(false);
	const [loadingImport, setLoadingImport] = useState(false);

	const importList = (file, object, getdata, param) => {
		setLoadingImport(true);
		axios
			.post(`${BASE_URL}/api/user/${object}/import`, file)
			.then((response) => {
				notify.success("Tải file thành công!");
				setLoadingImport(false);
				getdata(param);
			})
			.catch((error) => {
				notify.error(
					capitalizeFirstLetter(error.response.data.message)
				);
				setLoadingImport(false);
			});
	};

	const exportList = (params, object) => {
		// object = "student" or "teacher"
		axios({
			url: `${BASE_URL}/api/user/${object}/export`,
			method: "GET",
			responseType: "blob",
			params,
		})
			.then((response) => {
				const url = window.URL.createObjectURL(
					new Blob([response.data])
				);
				const link = document.createElement("a");
				link.href = url;
				link.setAttribute("download", `${object}-${Date.now()}.xlsx`);
				document.body.appendChild(link);
				link.click();
			})
			.catch((error) => {
				notify.error(
					capitalizeFirstLetter(error.response.data.message)
				);
			});
	};
	const exportTestList = (params, nameFile) => {
		// object = "test-set"
		setLoadingExport(true);
		axios({
			url: `${BASE_URL}/api/test-set/export`,
			method: "POST",
			responseType: "blob",
			data: params,
		})
			.then((response) => {
				const url = window.URL.createObjectURL(
					new Blob([response.data])
				);
				const link = document.createElement("a");
				link.href = url;
				link.setAttribute(
					"download",
					`Test-${nameFile}-${Date.now()}.docx`
				);
				document.body.appendChild(link);
				link.click();
				setLoadingExport(false);
			})
			.catch((error) => {
				notify.error(
					capitalizeFirstLetter(error.response.data.message)
				);
				setLoadingExport(false);
			});
	};
	const exportExamClass = (params, object) => {
		// object = "exam-class"
		setLoadingExport(true);
		axios({
			url: `${BASE_URL}/api/${object}/export`,
			method: "GET",
			responseType: "blob",
			data: params,
		})
			.then((response) => {
				const url = window.URL.createObjectURL(
					new Blob([response.data])
				);
				const link = document.createElement("a");
				link.href = url;
				link.setAttribute("download", `${object}-${Date.now()}.xlsx`);
				document.body.appendChild(link);
				link.click();
				setLoadingExport(false);
				notify.success("Tải danh sách lớp thi thành công!");
			})
			.catch((error) => {
				notify.error("Lỗi tải danh sách lớp thi!");
				setLoadingExport(false);
			});
	};
	const exportExamClassStudent = (params, object, classId) => {
		// object = "exam-class"
		setLoadingExport(true);
		axios({
			url: `${BASE_URL}/api/${object}/export/${classId}?roleType=STUDENT`,
			method: "GET",
			responseType: "blob",
			data: params,
		})
			.then((response) => {
				const url = window.URL.createObjectURL(
					new Blob([response.data])
				);
				const link = document.createElement("a");
				link.href = url;
				link.setAttribute("download", `${object}-${Date.now()}.xlsx`);
				document.body.appendChild(link);
				link.click();
				setLoadingExport(false);
				notify.success("Tải danh sách sinh viên thành công!");
			})
			.catch((error) => {
				notify.error("Lỗi tải danh sách sinh viên!");
				setLoadingExport(false);
			});
	};
	return {
		importList,
		loadingImport,
		exportList,
		loadingExport,
		exportTestList,
		exportExamClass,
		exportExamClassStudent,
	};
};
export default useImportExport;
