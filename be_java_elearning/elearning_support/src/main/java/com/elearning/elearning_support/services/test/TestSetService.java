package com.elearning.elearning_support.services.test;

import java.io.IOException;
import java.util.List;
import org.springframework.core.io.InputStreamResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.elearning.elearning_support.dtos.studentTestSet.ScoredStudentTestResDTO;
import com.elearning.elearning_support.dtos.studentTestSet.StudentHandledTestDTO;
import com.elearning.elearning_support.dtos.test.test_set.TestSetDetailDTO;
import com.elearning.elearning_support.dtos.test.test_set.TestSetGenerateReqDTO;
import com.elearning.elearning_support.dtos.test.test_set.TestSetPreviewDTO;
import com.elearning.elearning_support.dtos.test.test_set.TestSetSearchReqDTO;
import com.elearning.elearning_support.dtos.test.test_set.TestSetUpdateDTO;

@Service
public interface TestSetService {

    List<TestSetPreviewDTO> generateTestSet(TestSetGenerateReqDTO generateReqDTO);

    /**
     * Chi tiết đề thi
     */
    TestSetDetailDTO getTestSetDetail(TestSetSearchReqDTO searchReqDTO);

    /**
     * Export file word đề thi
     */
    InputStreamResource exportTestSet(TestSetSearchReqDTO searchReqDTO) throws IOException;

    /**
     *
     */
    void updateTestSet(TestSetUpdateDTO updateDTO);

    /**
     *  ======================== TEST SET SCORING SERVICES ====================
     */
    void scoreStudentTestSet(List<StudentHandledTestDTO> handledTestSets);

    /**
     * Upload handled answer sheet's images
     */
    void uploadStudentHandledAnswerSheet(Long examClassId, MultipartFile[] handledFiles);

}
