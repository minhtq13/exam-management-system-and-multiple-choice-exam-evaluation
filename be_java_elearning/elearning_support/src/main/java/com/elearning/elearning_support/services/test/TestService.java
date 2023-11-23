package com.elearning.elearning_support.services.test;

import java.util.Date;
import java.util.List;
import org.springframework.stereotype.Service;
import com.elearning.elearning_support.dtos.test.ITestListDTO;
import com.elearning.elearning_support.dtos.test.TestReqDTO;
import com.elearning.elearning_support.entities.test.Test;
import com.elearning.elearning_support.enums.commons.StatusEnum;

@Service
public interface TestService {

    /**
     * Tạo test từ môn học/chương
     */
    Long createRandomTest(TestReqDTO createDTO);


    /**
     * Tạo test từ bộ câu hỏi chọn sẵn
     */
    Long createTest(TestReqDTO createDTO);


    /**
     * Cập nhật test
     */
    void updateTest(Long testId, TestReqDTO updateDTO);

    /**
     * Get list test
     */
    List<ITestListDTO> getListTest(Long subjectId, String subjectCode, Date startTime, Date endTime);

    /**
     * Switch test status
     */
    void switchTestStatus(Long testId, StatusEnum status);

    /**
     * find test by id and enabled
     */
    Test findTestById(Long testId);

    /**
     * check test existed by id and enabled
     */
    Boolean checkExistedById(Long testId);


}
