import { useState } from "react";
import useNotify from "./useNotify";
import {
	getTestsService,
	testSetDetailService,
	updateTestSetService,
} from "../services/testServices";

const useTest = () => {
	const notify = useNotify();
	const [allTest, setAllTest] = useState([]);
	const [tableLoading, setTableLoading] = useState(true);
	const [pagination, setPagination] = useState({});
	const [testSetDetail, setTestSetDetail] = useState({});
	const [detailLoading, setDetailLoading] = useState(false);
	const [editLoading, setEditLoading] = useState(false);

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
		setEditLoading(true);
		updateTestSetService(
			param,
			(res) => {
				setEditLoading(false);
				notify.success("Cập nhật đề thi thành công!");
			},
			(error) => {
				setEditLoading(false);
				notify.error("Lỗi cập nhật đề thi!");
			}
		);
	};

	const getTestSetDetail = (param) => {
		setDetailLoading(true);
		testSetDetailService(
			param,
			(res) => {
				setTestSetDetail(res.data);
				setDetailLoading(false);
			},
			(error) => {
				notify.error("Không thể lấy thông tin đề thi!");
			}
		);
	};
	return {
		allTest,
		tableLoading,
		getAllTests,
		pagination,
		updateTestSet,
		getTestSetDetail,
		testSetDetail,
		detailLoading,
		editLoading,
	};
};
export default useTest;
