import { useState } from "react";
import { getModelAIService } from "../services/aiServices";
import useNotify from "./useNotify";

const useAI = () => {
  const notify = useNotify();
  const [resultAI, setResultAI] = useState();
  const [loading, setLoading] = useState(false);

  const getModelAI = (examClassCode, payload) => {
    setLoading(true);
    getModelAIService(
      examClassCode,
      payload,
      (res) => {
        setLoading(false);
        setResultAI(res.data.previews);
      },
      (err) => {
        console.log(err)
        setLoading(false);
        if (err.response.status === 404) {
          notify.warning(err.response.data.message || "Không tìm thấy dữ liệu");
        }
      }
    );
  };

  return {
    resultAI,
    getModelAI,
    loading,
  };
};

export default useAI;
