package com.elearning.elearning_support.services.test;

import java.io.IOException;
import org.springframework.core.io.InputStreamResource;
import org.springframework.stereotype.Service;
import com.elearning.elearning_support.dtos.test.test_set.TestSetDetailDTO;
import com.elearning.elearning_support.dtos.test.test_set.TestSetGenerateReqDTO;
import com.elearning.elearning_support.dtos.test.test_set.TestSetSearchReqDTO;

@Service
public interface TestSetService {

    void generateTestSet(TestSetGenerateReqDTO generateReqDTO);

    /**
     * Chi tiết đề thi
     */
    TestSetDetailDTO getTestSetDetail(TestSetSearchReqDTO searchReqDTO);

    /**
     * Export file word đề thi
     */
    InputStreamResource exportTestSet(TestSetSearchReqDTO searchReqDTO) throws IOException;

}
