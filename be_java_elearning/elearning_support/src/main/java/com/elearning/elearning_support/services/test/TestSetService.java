package com.elearning.elearning_support.services.test;

import org.springframework.stereotype.Service;
import com.elearning.elearning_support.dtos.test.test_set.TestSetGenerateReqDTO;
import com.elearning.elearning_support.dtos.test.test_set.TestSetGenerateResDTO;

@Service
public interface TestSetService {

    void generateTestSet(TestSetGenerateReqDTO generateReqDTO);

}
