import axios from "axios";
import { BASE_URL } from "../config/apiPath";
import useNotify from "./useNotify";
import { useState } from "react";

const useImportExport = () => {
  const notify = useNotify();
	const [loadingExport, setLoadingExport] = useState(false);
	const [loadingImport, setLoadingImport] = useState(false);

	const importList = (file, object) => {
		setLoadingImport(true)
		axios.post(`${BASE_URL}/api/user/${object}/import`, file)
			.then((response) => {
				console.log(response)
				notify.success("Tải file thành công!");
				setLoadingImport(false)
			})
			.catch((error) => {
				console.log(error)
				notify.error("Lỗi tải file!");
				setLoadingImport(false)
			});
	}
  
  const exportList = (params, object) => {
		// object = "student" or "teacher" 
		axios({
			url: `${BASE_URL}/api/user/${object}/export`, 
			method: "GET",
			responseType: "blob", 
			params
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
				console.log(error)
				notify.error("Lỗi tải file!");
			});
  }
	const exportTestList = (params, object) => {
		// object = "test-set"
		setLoadingExport(true)
		axios({
			url: `${BASE_URL}/api/${object}/export`, 
			method: "POST",
			responseType: "blob", 
			params
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
				setLoadingExport(false)
			})
			.catch((error) => {
				console.log(error)
				notify.error("Lỗi tải file!");
				setLoadingExport(false)
			});
  }
  return { importList, loadingImport, exportList, loadingExport, exportTestList }
}
export default useImportExport;