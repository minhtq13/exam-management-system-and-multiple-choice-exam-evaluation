import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { appPath } from "../config/appPath";
import { getProfileUserService, loginAuthenticService } from "../services/accountServices";
import useNotify from "./useNotify";

const useAccount = () => {
  const [authenticResult, setAuthenticResult] = useState("");
  const [userInfo, setUserInfo] = useState({})
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const notify = useNotify();
  const authenticAction = (payload = {}) => {
    loginAuthenticService(
      payload,
      (res) => {
        setAuthenticResult(res.data.message);
        notify.success("Đăng nhập thành công!");
        navigate(appPath.default);
        setLoading(false);
      },
      (error) => {
        setAuthenticResult("error");
        setLoading(false);
      }
    );
  };
  const getProfileUser = (payload = {}) => {
    getProfileUserService(
      payload,
      (res) => {
        setUserInfo(res.data)
      },
      (error) => {
        console.log(error)
      }
    );
  };
  return { authenticResult, authenticAction, loading, setLoading, userInfo, getProfileUser };
};

export default useAccount;
