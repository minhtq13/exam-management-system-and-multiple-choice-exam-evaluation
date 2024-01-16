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
  // const dataFake = {
  //   "tmpFileCode": "1TMP1705387802414",
  //   "previews": [
  //     {
  //       "studentCode": "58674546",
  //       "examClassCode": "247193",
  //       "testSetCode": "227",
  //       "handledScoredImg": "https://res.cloudinary.com/app20222-cloudinary/image/upload/v1705387795/handled_test1_yb8bgd.jpg",
  //       "originalImgFileName": "test1.jpg",
  //       "originalImg": "http://127.0.0.1:8088/e-learning/public/shared/data/AnsweredSheets/128244/test1.jpg",
  //       "numTestSetQuestions": 5,
  //       "numMarkedAnswers": 58,
  //       "numCorrectAnswers": 0,
  //       "numWrongAnswers": 5,
  //       "totalScore": 0,
  //       "details": [
  //         {
  //           "questionNo": 1,
  //           "selectedAnswers": "AC",
  //           "correctAnswers": ""
  //         },
  //         {
  //           "questionNo": 2,
  //           "selectedAnswers": "ACD",
  //           "correctAnswers": ""
  //         },
  //         {
  //           "questionNo": 3,
  //           "selectedAnswers": "AB",
  //           "correctAnswers": "C"
  //         },
  //         {
  //           "questionNo": 4,
  //           "selectedAnswers": "BD",
  //           "correctAnswers": ""
  //         },
  //         {
  //           "questionNo": 5,
  //           "selectedAnswers": "",
  //           "correctAnswers": "D"
  //         },
  //         {
  //           "questionNo": 6,
  //           "selectedAnswers": "B",
  //           "correctAnswers": null
  //         },
  //         {
  //           "questionNo": 7,
  //           "selectedAnswers": "A",
  //           "correctAnswers": null
  //         },
  //         {
  //           "questionNo": 8,
  //           "selectedAnswers": "",
  //           "correctAnswers": null
  //         },
  //         {
  //           "questionNo": 9,
  //           "selectedAnswers": "BD",
  //           "correctAnswers": null
  //         },
  //         {
  //           "questionNo": 10,
  //           "selectedAnswers": "AC",
  //           "correctAnswers": null
  //         },
  //         {
  //           "questionNo": 11,
  //           "selectedAnswers": "ACD",
  //           "correctAnswers": null
  //         },
  //         {
  //           "questionNo": 12,
  //           "selectedAnswers": "BD",
  //           "correctAnswers": null
  //         },
  //         {
  //           "questionNo": 13,
  //           "selectedAnswers": "A",
  //           "correctAnswers": null
  //         },
  //         {
  //           "questionNo": 14,
  //           "selectedAnswers": "AC",
  //           "correctAnswers": null
  //         },
  //         {
  //           "questionNo": 15,
  //           "selectedAnswers": "C",
  //           "correctAnswers": null
  //         },
  //         {
  //           "questionNo": 16,
  //           "selectedAnswers": "CD",
  //           "correctAnswers": null
  //         },
  //         {
  //           "questionNo": 17,
  //           "selectedAnswers": "BD",
  //           "correctAnswers": null
  //         },
  //         {
  //           "questionNo": 18,
  //           "selectedAnswers": "C",
  //           "correctAnswers": null
  //         },
  //         {
  //           "questionNo": 19,
  //           "selectedAnswers": "D",
  //           "correctAnswers": null
  //         },
  //         {
  //           "questionNo": 20,
  //           "selectedAnswers": "AC",
  //           "correctAnswers": null
  //         },
  //         {
  //           "questionNo": 21,
  //           "selectedAnswers": "BD",
  //           "correctAnswers": null
  //         },
  //         {
  //           "questionNo": 22,
  //           "selectedAnswers": "AC",
  //           "correctAnswers": null
  //         },
  //         {
  //           "questionNo": 23,
  //           "selectedAnswers": "D",
  //           "correctAnswers": null
  //         },
  //         {
  //           "questionNo": 24,
  //           "selectedAnswers": "BC",
  //           "correctAnswers": null
  //         },
  //         {
  //           "questionNo": 25,
  //           "selectedAnswers": "BD",
  //           "correctAnswers": null
  //         },
  //         {
  //           "questionNo": 26,
  //           "selectedAnswers": "ACD",
  //           "correctAnswers": null
  //         },
  //         {
  //           "questionNo": 27,
  //           "selectedAnswers": "AC",
  //           "correctAnswers": null
  //         },
  //         {
  //           "questionNo": 28,
  //           "selectedAnswers": "B",
  //           "correctAnswers": null
  //         },
  //         {
  //           "questionNo": 29,
  //           "selectedAnswers": "A",
  //           "correctAnswers": null
  //         },
  //         {
  //           "questionNo": 30,
  //           "selectedAnswers": "C",
  //           "correctAnswers": null
  //         },
  //         {
  //           "questionNo": 31,
  //           "selectedAnswers": "ACD",
  //           "correctAnswers": null
  //         },
  //         {
  //           "questionNo": 32,
  //           "selectedAnswers": "C",
  //           "correctAnswers": null
  //         },
  //         {
  //           "questionNo": 33,
  //           "selectedAnswers": "ACD",
  //           "correctAnswers": null
  //         },
  //         {
  //           "questionNo": 34,
  //           "selectedAnswers": "B",
  //           "correctAnswers": null
  //         },
  //         {
  //           "questionNo": 35,
  //           "selectedAnswers": "B",
  //           "correctAnswers": null
  //         },
  //         {
  //           "questionNo": 36,
  //           "selectedAnswers": "AD",
  //           "correctAnswers": null
  //         },
  //         {
  //           "questionNo": 37,
  //           "selectedAnswers": "ACD",
  //           "correctAnswers": null
  //         },
  //         {
  //           "questionNo": 38,
  //           "selectedAnswers": "AC",
  //           "correctAnswers": null
  //         },
  //         {
  //           "questionNo": 39,
  //           "selectedAnswers": "BD",
  //           "correctAnswers": null
  //         },
  //         {
  //           "questionNo": 40,
  //           "selectedAnswers": "A",
  //           "correctAnswers": null
  //         },
  //         {
  //           "questionNo": 41,
  //           "selectedAnswers": "BD",
  //           "correctAnswers": null
  //         },
  //         {
  //           "questionNo": 42,
  //           "selectedAnswers": "ACD",
  //           "correctAnswers": null
  //         },
  //         {
  //           "questionNo": 43,
  //           "selectedAnswers": "AC",
  //           "correctAnswers": null
  //         },
  //         {
  //           "questionNo": 44,
  //           "selectedAnswers": "D",
  //           "correctAnswers": null
  //         },
  //         {
  //           "questionNo": 45,
  //           "selectedAnswers": "B",
  //           "correctAnswers": null
  //         },
  //         {
  //           "questionNo": 46,
  //           "selectedAnswers": "AB",
  //           "correctAnswers": null
  //         },
  //         {
  //           "questionNo": 47,
  //           "selectedAnswers": "A",
  //           "correctAnswers": null
  //         },
  //         {
  //           "questionNo": 48,
  //           "selectedAnswers": "C",
  //           "correctAnswers": null
  //         },
  //         {
  //           "questionNo": 49,
  //           "selectedAnswers": "ACD",
  //           "correctAnswers": null
  //         },
  //         {
  //           "questionNo": 50,
  //           "selectedAnswers": "B",
  //           "correctAnswers": null
  //         },
  //         {
  //           "questionNo": 51,
  //           "selectedAnswers": "A",
  //           "correctAnswers": null
  //         },
  //         {
  //           "questionNo": 52,
  //           "selectedAnswers": "D",
  //           "correctAnswers": null
  //         },
  //         {
  //           "questionNo": 53,
  //           "selectedAnswers": "BD",
  //           "correctAnswers": null
  //         },
  //         {
  //           "questionNo": 54,
  //           "selectedAnswers": "AB",
  //           "correctAnswers": null
  //         },
  //         {
  //           "questionNo": 55,
  //           "selectedAnswers": "AC",
  //           "correctAnswers": null
  //         },
  //         {
  //           "questionNo": 56,
  //           "selectedAnswers": "CD",
  //           "correctAnswers": null
  //         },
  //         {
  //           "questionNo": 57,
  //           "selectedAnswers": "AB",
  //           "correctAnswers": null
  //         },
  //         {
  //           "questionNo": 58,
  //           "selectedAnswers": "AC",
  //           "correctAnswers": null
  //         },
  //         {
  //           "questionNo": 59,
  //           "selectedAnswers": "B",
  //           "correctAnswers": null
  //         },
  //         {
  //           "questionNo": 60,
  //           "selectedAnswers": "ACD",
  //           "correctAnswers": null
  //         }
  //       ],
  //       "processedAt": "16/01/24 13:49:56"
  //     },
  //     {
  //       "studentCode": "58674546",
  //       "examClassCode": "247193",
  //       "testSetCode": "724",
  //       "handledScoredImg": "https://res.cloudinary.com/app20222-cloudinary/image/upload/v1705387798/handled_test2_i62daz.jpg",
  //       "originalImgFileName": "test2.jpg",
  //       "originalImg": "http://127.0.0.1:8088/e-learning/public/shared/data/AnsweredSheets/128244/test2.jpg",
  //       "numTestSetQuestions": 5,
  //       "numMarkedAnswers": 58,
  //       "numCorrectAnswers": 0,
  //       "numWrongAnswers": 5,
  //       "totalScore": 0,
  //       "details": [
  //         {
  //           "questionNo": 1,
  //           "selectedAnswers": "AC",
  //           "correctAnswers": "B"
  //         },
  //         {
  //           "questionNo": 2,
  //           "selectedAnswers": "ACD",
  //           "correctAnswers": ""
  //         },
  //         {
  //           "questionNo": 3,
  //           "selectedAnswers": "AB",
  //           "correctAnswers": "B"
  //         },
  //         {
  //           "questionNo": 4,
  //           "selectedAnswers": "BD",
  //           "correctAnswers": ""
  //         },
  //         {
  //           "questionNo": 5,
  //           "selectedAnswers": "",
  //           "correctAnswers": "C"
  //         },
  //         {
  //           "questionNo": 6,
  //           "selectedAnswers": "B",
  //           "correctAnswers": null
  //         },
  //         {
  //           "questionNo": 7,
  //           "selectedAnswers": "A",
  //           "correctAnswers": null
  //         },
  //         {
  //           "questionNo": 8,
  //           "selectedAnswers": "",
  //           "correctAnswers": null
  //         },
  //         {
  //           "questionNo": 9,
  //           "selectedAnswers": "BD",
  //           "correctAnswers": null
  //         },
  //         {
  //           "questionNo": 10,
  //           "selectedAnswers": "AC",
  //           "correctAnswers": null
  //         },
  //         {
  //           "questionNo": 11,
  //           "selectedAnswers": "ACD",
  //           "correctAnswers": null
  //         },
  //         {
  //           "questionNo": 12,
  //           "selectedAnswers": "BD",
  //           "correctAnswers": null
  //         },
  //         {
  //           "questionNo": 13,
  //           "selectedAnswers": "A",
  //           "correctAnswers": null
  //         },
  //         {
  //           "questionNo": 14,
  //           "selectedAnswers": "AC",
  //           "correctAnswers": null
  //         },
  //         {
  //           "questionNo": 15,
  //           "selectedAnswers": "C",
  //           "correctAnswers": null
  //         },
  //         {
  //           "questionNo": 16,
  //           "selectedAnswers": "CD",
  //           "correctAnswers": null
  //         },
  //         {
  //           "questionNo": 17,
  //           "selectedAnswers": "BD",
  //           "correctAnswers": null
  //         },
  //         {
  //           "questionNo": 18,
  //           "selectedAnswers": "C",
  //           "correctAnswers": null
  //         },
  //         {
  //           "questionNo": 19,
  //           "selectedAnswers": "D",
  //           "correctAnswers": null
  //         },
  //         {
  //           "questionNo": 20,
  //           "selectedAnswers": "AC",
  //           "correctAnswers": null
  //         },
  //         {
  //           "questionNo": 21,
  //           "selectedAnswers": "BD",
  //           "correctAnswers": null
  //         },
  //         {
  //           "questionNo": 22,
  //           "selectedAnswers": "AC",
  //           "correctAnswers": null
  //         },
  //         {
  //           "questionNo": 23,
  //           "selectedAnswers": "D",
  //           "correctAnswers": null
  //         },
  //         {
  //           "questionNo": 24,
  //           "selectedAnswers": "BC",
  //           "correctAnswers": null
  //         },
  //         {
  //           "questionNo": 25,
  //           "selectedAnswers": "BD",
  //           "correctAnswers": null
  //         },
  //         {
  //           "questionNo": 26,
  //           "selectedAnswers": "ACD",
  //           "correctAnswers": null
  //         },
  //         {
  //           "questionNo": 27,
  //           "selectedAnswers": "AC",
  //           "correctAnswers": null
  //         },
  //         {
  //           "questionNo": 28,
  //           "selectedAnswers": "B",
  //           "correctAnswers": null
  //         },
  //         {
  //           "questionNo": 29,
  //           "selectedAnswers": "A",
  //           "correctAnswers": null
  //         },
  //         {
  //           "questionNo": 30,
  //           "selectedAnswers": "C",
  //           "correctAnswers": null
  //         },
  //         {
  //           "questionNo": 31,
  //           "selectedAnswers": "ACD",
  //           "correctAnswers": null
  //         },
  //         {
  //           "questionNo": 32,
  //           "selectedAnswers": "C",
  //           "correctAnswers": null
  //         },
  //         {
  //           "questionNo": 33,
  //           "selectedAnswers": "ACD",
  //           "correctAnswers": null
  //         },
  //         {
  //           "questionNo": 34,
  //           "selectedAnswers": "B",
  //           "correctAnswers": null
  //         },
  //         {
  //           "questionNo": 35,
  //           "selectedAnswers": "B",
  //           "correctAnswers": null
  //         },
  //         {
  //           "questionNo": 36,
  //           "selectedAnswers": "AD",
  //           "correctAnswers": null
  //         },
  //         {
  //           "questionNo": 37,
  //           "selectedAnswers": "ACD",
  //           "correctAnswers": null
  //         },
  //         {
  //           "questionNo": 38,
  //           "selectedAnswers": "AC",
  //           "correctAnswers": null
  //         },
  //         {
  //           "questionNo": 39,
  //           "selectedAnswers": "BD",
  //           "correctAnswers": null
  //         },
  //         {
  //           "questionNo": 40,
  //           "selectedAnswers": "A",
  //           "correctAnswers": null
  //         },
  //         {
  //           "questionNo": 41,
  //           "selectedAnswers": "BD",
  //           "correctAnswers": null
  //         },
  //         {
  //           "questionNo": 42,
  //           "selectedAnswers": "ACD",
  //           "correctAnswers": null
  //         },
  //         {
  //           "questionNo": 43,
  //           "selectedAnswers": "AC",
  //           "correctAnswers": null
  //         },
  //         {
  //           "questionNo": 44,
  //           "selectedAnswers": "D",
  //           "correctAnswers": null
  //         },
  //         {
  //           "questionNo": 45,
  //           "selectedAnswers": "B",
  //           "correctAnswers": null
  //         },
  //         {
  //           "questionNo": 46,
  //           "selectedAnswers": "AB",
  //           "correctAnswers": null
  //         },
  //         {
  //           "questionNo": 47,
  //           "selectedAnswers": "A",
  //           "correctAnswers": null
  //         },
  //         {
  //           "questionNo": 48,
  //           "selectedAnswers": "C",
  //           "correctAnswers": null
  //         },
  //         {
  //           "questionNo": 49,
  //           "selectedAnswers": "ACD",
  //           "correctAnswers": null
  //         },
  //         {
  //           "questionNo": 50,
  //           "selectedAnswers": "B",
  //           "correctAnswers": null
  //         },
  //         {
  //           "questionNo": 51,
  //           "selectedAnswers": "A",
  //           "correctAnswers": null
  //         },
  //         {
  //           "questionNo": 52,
  //           "selectedAnswers": "D",
  //           "correctAnswers": null
  //         },
  //         {
  //           "questionNo": 53,
  //           "selectedAnswers": "BD",
  //           "correctAnswers": null
  //         },
  //         {
  //           "questionNo": 54,
  //           "selectedAnswers": "AB",
  //           "correctAnswers": null
  //         },
  //         {
  //           "questionNo": 55,
  //           "selectedAnswers": "AC",
  //           "correctAnswers": null
  //         },
  //         {
  //           "questionNo": 56,
  //           "selectedAnswers": "CD",
  //           "correctAnswers": null
  //         },
  //         {
  //           "questionNo": 57,
  //           "selectedAnswers": "AB",
  //           "correctAnswers": null
  //         },
  //         {
  //           "questionNo": 58,
  //           "selectedAnswers": "AC",
  //           "correctAnswers": null
  //         },
  //         {
  //           "questionNo": 59,
  //           "selectedAnswers": "B",
  //           "correctAnswers": null
  //         },
  //         {
  //           "questionNo": 60,
  //           "selectedAnswers": "ACD",
  //           "correctAnswers": null
  //         }
  //       ],
  //       "processedAt": "16/01/24 13:49:59"
  //     },
  //   ],
  //   mayBeWrong: [
  //     "bb20.jpg", "test1.jpg", "Kiểm tra lại nhãn ABC, câu 20, ảnh test2.jpg, xác suất 0.6", "Kiểm tra lại nhãn BD, câu 25, ảnh test3.jpg, xác suất 0.7"
  //   ]
  // }
  

  const getModelAI = (examClassCode, payload) => {
    setLoading(true);
    getModelAIService(
      examClassCode,
      payload,
      (res) => {
        setLoading(false);
        setResultAI(res.data.previews);
        setTempFileCode(res.data.tmpFileCode);
        setMayBeWrong([])
      },
      (err) => {
        console.log(err)
        setLoading(false);
        if (err.response.data.code === "error.test.set.not.found") {
          notify.warning("Không có mã đề thi trong cơ sở dữ liệu!");
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
