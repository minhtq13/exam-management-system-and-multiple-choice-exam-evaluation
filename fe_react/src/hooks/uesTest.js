import {useState} from "react";
import useNotify from "./useNotify";
import { getTestsService } from "../services/testServices";

const useTest = () => {
  const notify = useNotify();
  const [allTest, setAllTest] = useState([]);
	const [tableLoading, setTableLoading] = useState(true);
  
  const getAllTests = (payload = {}) => {
    setTableLoading(true);
    getTestsService(
      payload,
      (res) => {
				setAllTest(res.data);
				setTableLoading(false);
			},
			(err) => {
				setTableLoading(true);
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
    )
  }
  return {allTest, tableLoading, getAllTests}
}
export default useTest;