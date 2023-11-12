import { getRequest} from "../api/apiCaller";
import { apiPath } from "../config/apiPath";

export const getComboSubService = async (subjectCode, subjectTitle, successCallback, errorCallback) => {
  const params = {
  };

  if (subjectCode) {
    params.subjectCode = subjectCode;
  }

  if (subjectTitle) {
    params.subjectTitle = subjectTitle;
  }

  const queryString = Object.entries(params)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join("&");

  const apiUrl = `${apiPath.comboQuestion}?${queryString}`;

  await getRequest(apiUrl, null, successCallback, errorCallback);
};
export const getComboChapService = async (subjectId, chapterCode, chapterTitle, successCallback, errorCallback) => {
  const params = { subjectId,
  };

  if (chapterCode) {
    params.chapterCode = chapterCode;
  }

  if (chapterTitle) {
    params.chapterTitle = chapterTitle;
  }

  const queryString = Object.entries(params)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join("&");

  const apiUrl = `${apiPath.comboChapter}?${queryString}`;

  await getRequest(apiUrl, null, successCallback, errorCallback);
};

