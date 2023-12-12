import { useState } from "react";
import useNotify from "./useNotify";
import {
	getTestsService,
	updateTestSetService,
} from "../services/testServices";

const useTest = () => {
	const notify = useNotify();
	const [allTest, setAllTest] = useState([]);
	const [tableLoading, setTableLoading] = useState(true);
	const [pagination, setPagination] = useState({});

	const getAllTests = (param) => {
		setTableLoading(true);
		getTestsService(
			param.subjectId,
			param.semesterId,
			param.page,
			param.size,
			(res) => {
				setAllTest(res.data.content);
				setPagination({
					current: res.data.pageable.pageNumber + 1,
					pageSize: res.data.pageable.pageSize,
					total: res.data.totalElements,
				});
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

	const updateTestSet = (param) => {
		updateTestSetService(
			param,
			(res) => {
				notify.success("Cập nhật đề thi thành công!");
			},
			(error) => {
				notify.error("Lỗi cập nhật đề thi!");
			}
		);
	};
	return { allTest, tableLoading, getAllTests, pagination, updateTestSet };
};
export default useTest;
