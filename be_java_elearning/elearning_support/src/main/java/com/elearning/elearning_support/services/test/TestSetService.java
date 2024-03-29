package com.elearning.elearning_support.services.test;

import java.io.IOException;
import java.util.List;
import org.springframework.core.io.InputStreamResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.elearning.elearning_support.dtos.CustomInputStreamResource;
import com.elearning.elearning_support.dtos.fileAttach.FileAttachDTO;
import com.elearning.elearning_support.dtos.studentTestSet.StudentHandledTestDTO;
import com.elearning.elearning_support.dtos.test.studentTestSet.HandledImagesDeleteDTO;
import com.elearning.elearning_support.dtos.test.test_set.ScoringPreviewResDTO;
import com.elearning.elearning_support.dtos.test.test_set.TestSetCreateDTO;
import com.elearning.elearning_support.dtos.test.test_set.TestSetDetailDTO;
import com.elearning.elearning_support.dtos.test.test_set.TestSetGenerateReqDTO;
import com.elearning.elearning_support.dtos.test.test_set.TestSetPreviewDTO;
import com.elearning.elearning_support.dtos.test.test_set.TestSetSearchReqDTO;
import com.elearning.elearning_support.dtos.test.test_set.TestSetUpdateDTO;

@Service
public interface TestSetService {

    /**
     * Gen bộ đề thi tự động
     */
    List<TestSetPreviewDTO> generateTestSet(TestSetGenerateReqDTO generateReqDTO);

    /**
     *
     */
    TestSetPreviewDTO createTestSet(TestSetCreateDTO createDTO);

    /**
     * Chi tiết đề thi
     */
    TestSetDetailDTO getTestSetDetail(TestSetSearchReqDTO searchReqDTO);

    /**
     * Export file word đề thi
     */
    InputStreamResource exportTestSet(TestSetSearchReqDTO searchReqDTO) throws IOException;


    /**
     * Export file word đề thi từ nội dung HTML
     */
    CustomInputStreamResource exportTestSetFromHtml(MultipartFile fileHtml);

    /**
     *
     */
    void updateTestSet(TestSetUpdateDTO updateDTO);
    /**
     *  ======================== TEST SET SCORING SERVICES ====================
     */
    ScoringPreviewResDTO scoreStudentTestSet(String examClassCode, List<StudentHandledTestDTO> handledTestSets);

    /**
     * Process answered sheets and score by exClassCode
     */
    ScoringPreviewResDTO scoreExamClassTestSet(String examClassCode);

    /**
     * Upload handled answer sheet's images
     */
    void uploadStudentHandledAnswerSheet(String examClassCode, MultipartFile[] handledFiles) throws IOException;


    /**
     * Delete handled answer sheet's images in exam class folder
     */
    void deleteImagesInClassFolder(HandledImagesDeleteDTO deleteDTO) throws IOException;

    /**
     * Get list file uploaded in exam class folder
     */
    List<FileAttachDTO> getListFileInExClassFolder(String examClassCode);


    /**
     * Save scored results
     */
    void saveScoringResults(String tempFileCode, String option);

}
