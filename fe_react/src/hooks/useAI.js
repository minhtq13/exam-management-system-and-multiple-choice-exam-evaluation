import { useState } from "react";
import { deleteImgInFolderService, getImgInFolderService, getModelAIService, resetTableResultService, saveTableResultService } from "../services/aiServices";
import useNotify from "./useNotify";
import { useDispatch } from "react-redux";
import { setRefreshTableImage } from "../redux/slices/refreshSlice";

const useAI = () => {
  const notify = useNotify();
  const dispatch = useDispatch()
  const [resultAI, setResultAI] = useState([]);
  const [tempFileCode, setTempFileCode] = useState();
  const [imgInFolder, setImgInFolder] = useState([]);
  const [mayBeWrong, setMayBeWrong] = useState([]);
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
        setMayBeWrong(res.data.warningMessages)
      },
      (err) => {
        console.log(err)
        setLoading(false);
        if (err.response.data.code === "error.test.set.not.found") {
          notify.warning("Không có mã đề thi trong cơ sở dữ liệu!");
        } else if (err.response.data.code === "error.student.exam.class.not_found") {
          notify.warning("Mã số sinh viên này không có trong lớp thi!");
        }
      }
    );
  };
  const resetTableResult = (payload, noti = true) => {
    resetTableResultService(
      tempFileCode,
      payload,
      (res) => {
        if (noti) {
          notify.success("Đã xóa dữ liệu của bảng thành công!");
        } else {
          console.log(res)
        }
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
  const getImgInFolder = (examClassCode, payload) => {
    getImgInFolderService(
      examClassCode,
      payload,
      (res) => {
        setImgInFolder(res.data)
      },
      (err) => {
        notify.warning("Không tìm thấy ảnh trong folder!");
      }
    );
  }
  const deleteImgInFolder = (payload) => {
    deleteImgInFolderService(
      payload,
      (res) => {
        notify.success("Xoá thành công!");
        dispatch(setRefreshTableImage(Date.now()))
      },
      (err) => {
        notify.warning("Xoá không thành công!");
      }
    );
  }

  return {
    resultAI,
    setResultAI,
    tempFileCode,
    getModelAI,
    mayBeWrong,
    resetTableResult,
    saveTableResult,
    getImgInFolder,
    imgInFolder,
    setImgInFolder,
    deleteImgInFolder,
    loading
  };
};

export default useAI;
