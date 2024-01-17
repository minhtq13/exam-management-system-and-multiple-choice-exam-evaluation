import { useEffect, useState } from "react";
import useQuestions from "../../../hooks/useQuestion"

const TestSetCreateManual = ({ testId }) => {
  const initialParam = {
    subjectId: null,
    subjectCode: null,
    chapterCode: null,
    chapterIds: [],
    search: null,
    level: "ALL",
    testId: testId
  };
  const { getAllQuestions, quesLoading, allQuestions } = useQuestions();
  const [param, setParam] = useState(initialParam);
  const [initialValues, setInitialValues] = useState([]);
  const [lstPreview, setLstPreview] = useState([]);
  useEffect(() => {
    getAllQuestions(param);
  }, [param]);
  console.log(allQuestions)
  return (
    <div className="test-set-create-manual">
      <div className="manual-fill"></div>
      <div className="manual-preview"></div>
    </div>
  )
}
export default TestSetCreateManual;
