import { useState } from "react";
import useNotify from "./useNotify";
import { getAllClassesService } from "../services/examClassServices";
const useExamClasses = () => {
	const notify = useNotify();
	const [allExamClasses, setAllExamClasses] = useState([]);
	const [tableLoading, setTableLoading] = useState(true);

	const getAllExamClasses = (payload = {}) => {
		setTableLoading(true);
		getAllClassesService(
			payload,
			(res) => {
				setAllExamClasses(res.data);
				setTableLoading(false);
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

	return {
		allExamClasses,
		getAllExamClasses,
		tableLoading,
	};
};

export default useExamClasses;
