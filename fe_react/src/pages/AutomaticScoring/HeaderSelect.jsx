import { Select, Space } from "antd";
import React, { useEffect, useState } from "react";
import iconArrow from "../../assets/images/svg/arrow-under-header.svg";
import useCombo from "../../hooks/useCombo";
import { useDispatch, useSelector } from "react-redux";
import { setExamClassCode } from "../../redux/slices/appSlice";
const { Option } = Select;

const HeaderSelect = () => {
  const { getAllSemesters, allSemester, allSubjects, getAllSubjects, getAllExamClass, examClass } =
    useCombo();
  const [semesterSelected, setSemesterSelected] = useState(null);
  const [subjectSelected, setSubjectSelected] = useState(null);
  const dispatch = useDispatch();
  const { examClassCode } = useSelector((state) => state.appReducer);
  useEffect(() => {
    getAllSemesters({});
    getAllSubjects("", "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (semesterSelected && subjectSelected) {
      getAllExamClass(semesterSelected, subjectSelected, {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [semesterSelected, subjectSelected]);

  const handleChangeSemestersSelect = (value) => {
    setSubjectSelected(null);
    setSemesterSelected(value);
    dispatch(setExamClassCode(null));
  };
  const handleChangeSubjectSelect = (value) => {
    dispatch(setExamClassCode(null));
    setSubjectSelected(value);
  };
  const handleChangeExamCodeSelect = (value) => {
    dispatch(setExamClassCode(value));
  };
  const filterSubject = (input, option) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  return (
    <div>
      <div className="block-select">
        <div className="info">
          {!semesterSelected || !subjectSelected || !examClassCode
            ? `Vui lòng nhập thông tin lớp thi để chấm điểm!`
            : ""}
        </div>
        <div className="block-button">
          <Space>
            <div className="detail-button">Học kỳ: </div>
            <Select
              optionLabelProp="label"
              suffixIcon={<img src={iconArrow} alt="" />}
              className="custom-select-antd"
              placeholder="Chọn học kỳ"
              onChange={handleChangeSemestersSelect}
              style={{ width: 200 }}
              value={semesterSelected}
            >
              {allSemester.map((item, index) => {
                return (
                  <Option value={item.id} label={item.name} key={index}>
                    <div className="d-flex item_DropBar dropdown-option">
                      <div className="dropdown-option-item text-14">{item.name}</div>
                    </div>
                  </Option>
                );
              })}
            </Select>
          </Space>

          <Space>
            <div className="detail-button">Học phần: </div>
            <Select
              optionLabelProp="label"
              onChange={handleChangeSubjectSelect}
              className="custom-select-antd"
              suffixIcon={<img src={iconArrow} alt="" />}
              style={{ width: 350 }}
              placeholder="Chọn học phần"
              showSearch
              filterOption={filterSubject}
              value={subjectSelected}
            >
              {allSubjects.map((item, index) => {
                return (
                  <Option value={item.id} label={item.name} key={index}>
                    <div className="d-flex item_DropBar dropdown-option">
                      <div className="dropdown-option-item text-14">{item.name}</div>
                    </div>
                  </Option>
                );
              })}
            </Select>
          </Space>
          <Space>
            <div className="detail-button">Mã lớp thi: </div>
            <Select
              optionLabelProp="label"
              onChange={handleChangeExamCodeSelect}
              className="custom-select-antd"
              suffixIcon={<img src={iconArrow} alt="" />}
              style={{ width: 300 }}
              placeholder="Chọn mã lớp thi để chấm"
              showSearch
              disabled={!semesterSelected || !subjectSelected}
              value={examClassCode}
            >
              {examClass.map((item, index) => {
                return (
                  <Option value={item.code} label={item.code} key={index}>
                    <div className="d-flex item_DropBar dropdown-option">
                      <div className="dropdown-option-item text-14">{item.code}</div>
                    </div>
                  </Option>
                );
              })}
            </Select>
          </Space>
        </div>
      </div>
    </div>
  );
};

export default HeaderSelect;
