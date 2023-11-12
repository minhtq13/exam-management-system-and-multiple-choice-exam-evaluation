import { useState } from "react";
import { getPagingStudentsService } from "../services/studentsService";
import useNotify from "./useNotify";

const useStudents = () => {
	const notify = useNotify();
	const [allStudents, setAllStudents] = useState([]);
	const [tableLoading, setTableLoading] = useState(true);
	const [pagination, setPagination] = useState({});

	const getAllStudents = (params) => {
		setTableLoading(true);
		getPagingStudentsService(
			params.name,
			params.code,
			params.page,
			params.size,
			params.sort,
			(res) => {
				setAllStudents(res.data.content);
				setPagination({current: res.data.pageable.pageNumber + 1, pageSize: res.data.pageable.pageSize, total: res.data.totalElements})
				setTableLoading(false);
			},
			(err)=> {
				setTableLoading(false);
				if (err.response.status === 401) {
					notify.warning(
						err.response.data.message || "Permission denied"
					);
				}
				if (err.response.status === 404) {
					notify.warning(
						err.response.data.message ||
							"No information in database"
					);
				}
			}
		);
	};

	return {
		allStudents,
		getAllStudents,
		tableLoading,
		pagination
	};
};

export default useStudents;
