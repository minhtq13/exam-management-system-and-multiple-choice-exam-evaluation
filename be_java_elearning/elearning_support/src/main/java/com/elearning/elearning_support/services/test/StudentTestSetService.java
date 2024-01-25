package com.elearning.elearning_support.services.test;

import java.io.IOException;
import org.springframework.stereotype.Service;
import com.elearning.elearning_support.dtos.CustomInputStreamResource;
import com.elearning.elearning_support.dtos.test.studentTestSet.ExamClassResultStatisticsDTO;

@Service
public interface StudentTestSetService {

    /**
     * Get student test results by examClassCode
     */
    ExamClassResultStatisticsDTO getListStudentTestSetResult(String examClassCode);

    /**
     * export student test results by examClassCode
     */
    CustomInputStreamResource exportStudentTestSetResult(String examClassCode) throws IOException;

}
