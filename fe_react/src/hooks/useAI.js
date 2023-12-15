import { useState } from "react";
import { getModelAIService, resetTableResultService, saveTableResultService } from "../services/aiServices";
import useNotify from "./useNotify";

const useAI = () => {
  const notify = useNotify();
  const [resultAI, setResultAI] = useState([]);
  const [tempFileCode, setTempFileCode] = useState();
  const [loading, setLoading] = useState(false);

  const getModelAI = (examClassCode, payload) => {
    setLoading(true);
    getModelAIService(
      examClassCode,
      payload,
      (res) => {
        setLoading(false);
        setResultAI(res.data.previews);
        setTempFileCode(res.data.tmpFileCode);
      },
      (err) => {
        console.log(err)
        setLoading(false);
        if (err.response.status === 404) {
          notify.warning(err.response.data.message || "Không tìm thấy dữ liệu");
        }
        if (err.response.status === 500) {
          notify.warning("Không tìm thấy dữ liệu về mã đề thi!");
        }
      }
    );
  };
  const resetTableResult = (payload) => {
    resetTableResultService(
      tempFileCode,
      payload,
      (res) => {
        notify.success("Đã xóa dữ liệu của bảng thành công!");
      },
      (err) => {
        notify.warning("Không tìm thấy dữ liệu");
      }
    );
  }
  const saveTableResult = (payload) => {
    saveTableResultService(
      tempFileCode,
      payload,
      (res) => {
        notify.success("Lưu kết quả chấm thành công!");
      },
      (err) => {
        notify.warning("Lưu kết quả chấm thất bại!");
      }
    );
  }

  return {
    resultAI,
    setResultAI,
    tempFileCode,
    getModelAI,
    resetTableResult,
    saveTableResult,
    loading,
  };
};

export default useAI;
