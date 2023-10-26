package com.demo.app.service;

import com.demo.app.dto.testset.TestSetDetailResponse;
import com.demo.app.dto.testset.TestSetUpdateRequest;
import jakarta.transaction.Transactional;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.List;

public interface TestSetService {

    @Transactional
    List<String> createTestSetFromTest(int testId, Integer testSetQuantity) throws InterruptedException;

    TestSetDetailResponse getTestSetDetail(Integer testId, String testNo);

    void updateTestSet(Integer testSetId, TestSetUpdateRequest request);

    ByteArrayInputStream exportTestSetToWord(Integer testId, String testNo) throws IOException;
}
