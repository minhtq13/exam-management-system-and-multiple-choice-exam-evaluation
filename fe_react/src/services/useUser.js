import { useState } from "react";
import { getDetailInfo } from "./userService";
import useNotify from "../hooks/useNotify";

const useUser = () => {
  const notify = useNotify();
  const [userInfo, setUserInfo] = useState({});
  const [infoLoading, setInfoLoading] = useState(false);
  const getDetailUser = (payload = {}, code) => {
    setInfoLoading(true);
    getDetailInfo(
      code,
      payload,
      (res) => {
        setUserInfo(res.data);
        setInfoLoading(false);
      },
      (error) => {
        notify.error("Không thể lấy thông tin học phần");
      }
    );
  }
  return {userInfo, getDetailUser, infoLoading}
};
export default useUser;
