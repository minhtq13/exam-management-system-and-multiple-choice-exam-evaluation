import {useState} from "react";
import useNotify from "./useNotify";
import { getTestsService } from "../services/testServices";

const useTest = () => {
  const notify = useNotify();
  const [allTest, setAllTest] = useState([]);
	const [tableLoading, setTableLoading] = useState(true);
  
  const getAllTests = (param) => {
    setTableLoading(true);
    getTestsService(
      param.subjectId,
      (res) => {
				setAllTest(res.data);
				//setPagination({current: res.data.pageable.pageNumber + 1, pageSize: res.data.pageable.pageSize, total: res.data.totalElements})
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
    )
  }
  return {allTest, tableLoading, getAllTests}
}
export default useTest;