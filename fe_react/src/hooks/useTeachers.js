import { useState } from "react";
import useNotify from "./useNotify";
import { getAllTeachersService, getPagingTeachersService } from "../services/teachersServices";

const useTeachers = () => {
  const notify = useNotify();
  const [allTeachers, setAllTeachers] = useState([]);
  const [tableLoading, setTableLoading] = useState(true);
	const [pagination, setPagination] = useState({})

  const getAllTeachers = (params) => {
    setTableLoading(true);
    getPagingTeachersService(
      params.name,
      params.code,
			params.page,
			params.size,
			params.sort,
      (res) => {
        setAllTeachers(res.data.content);
				setPagination({current: res.data.pageable.pageNumber + 1, pageSize: res.data.pageable.pageSize, total: res.data.totalElements})
        setTableLoading(false);
      },
      (err) => {
        setTableLoading(true);
        if (err.response.status === 401) {
          notify.warning(err.response.data.message || "Permission denied");
        }
        if (err.response.status === 404) {
          notify.warning(
            err.response.data.message || "No information in database"
          );
        }
      }
    );
  };

  return {
    allTeachers,
    getAllTeachers,
    tableLoading,
    pagination
  };
};

export default useTeachers;
