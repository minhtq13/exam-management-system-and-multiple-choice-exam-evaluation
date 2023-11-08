package com.elearning.elearning_support.services.test.impl;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.IntStream;
import org.apache.commons.lang3.ObjectUtils;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.core.io.InputStreamResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.elearning.elearning_support.constants.message.errorKey.ErrorKey;
import com.elearning.elearning_support.constants.message.messageConst.MessageConst;
import com.elearning.elearning_support.constants.message.messageConst.MessageConst.Resources;
import com.elearning.elearning_support.dtos.question.QuestionAnswerDTO;
import com.elearning.elearning_support.dtos.test.GenTestConfigDTO;
import com.elearning.elearning_support.dtos.test.test_question.TestQuestionAnswerResDTO;
import com.elearning.elearning_support.dtos.test.test_set.ITestSetResDTO;
import com.elearning.elearning_support.dtos.test.test_set.TestQuestionAnswer;
import com.elearning.elearning_support.dtos.test.test_set.TestSetDetailDTO;
import com.elearning.elearning_support.dtos.test.test_set.TestSetGenerateReqDTO;
import com.elearning.elearning_support.dtos.test.test_set.TestSetQuestionMapDTO;
import com.elearning.elearning_support.dtos.test.test_set.TestSetSearchReqDTO;
import com.elearning.elearning_support.dtos.test.test_set.TestSetUpdateDTO;
import com.elearning.elearning_support.entities.test.Test;
import com.elearning.elearning_support.entities.test.TestSet;
import com.elearning.elearning_support.entities.test.TestSetQuestion;
import com.elearning.elearning_support.enums.question.QuestionLevelEnum;
import com.elearning.elearning_support.exceptions.exceptionFactory.ExceptionFactory;
import com.elearning.elearning_support.repositories.question.QuestionRepository;
import com.elearning.elearning_support.repositories.test.TestRepository;
import com.elearning.elearning_support.repositories.test.test_set.TestSetQuestionRepository;
import com.elearning.elearning_support.repositories.test.test_set.TestSetRepository;
import com.elearning.elearning_support.services.test.TestSetService;
import com.elearning.elearning_support.utils.auth.AuthUtils;
import com.elearning.elearning_support.utils.object.ObjectMapperUtil;
import com.elearning.elearning_support.utils.word.WordUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class TestSetServiceImpl implements TestSetService {

    private static final int MAX_NUM_ANSWERS_PER_QUESTION = 6;

    private final TestSetRepository testSetRepository;

    private final TestRepository testRepository;

    private final ExceptionFactory exceptionFactory;

    private final QuestionRepository questionRepository;

    private final TestSetQuestionRepository testSetQuestionRepository;

    @Transactional
    @Override
    public void generateTestSet(TestSetGenerateReqDTO generateReqDTO) {
        Long currentUserId = AuthUtils.getCurrentUserId();
        Test test = testRepository.findByIdAndIsEnabled(generateReqDTO.getTestId(), Boolean.TRUE).orElseThrow(
            () -> exceptionFactory.resourceNotFoundException(MessageConst.Test.NOT_FOUND, MessageConst.RESOURCE_NOT_FOUND, Resources.TEST,
                ErrorKey.Test.ID, String.valueOf(generateReqDTO.getTestId()))
        );

        // Lấy cấu hình tạo đề thi
        GenTestConfigDTO genTestConfig = ObjectMapperUtil.objectMapper(test.getGenTestConfig(), GenTestConfigDTO.class);
        if (Objects.isNull(genTestConfig)) {
            return;
        }

        // Lấy các câu hỏi trong bộ câu hỏi của đề thi
        List<QuestionAnswerDTO> lstQuestionInTest = questionRepository.getListQuestionInTest(generateReqDTO.getTestId()).stream()
            .map(QuestionAnswerDTO::new).collect(Collectors.toList());
        // Lọc theo mức độ: dễ/trung bình/ khó
        List<QuestionAnswerDTO> lstEasyQuestion = lstQuestionInTest.stream().filter(question -> Objects.equals(question.getLevel(),
            QuestionLevelEnum.EASY.getLevel())).collect(Collectors.toList());
        List<QuestionAnswerDTO> lstMediumQuestion = lstQuestionInTest.stream().filter(question -> Objects.equals(question.getLevel(),
            QuestionLevelEnum.MEDIUM.getLevel())).collect(Collectors.toList());
        List<QuestionAnswerDTO> lstHardQuestion = lstQuestionInTest.stream().filter(question -> Objects.equals(question.getLevel(),
            QuestionLevelEnum.HARD.getLevel())).collect(Collectors.toList());

        // Tạo đề thi
        List<TestSet> lstTestSet = new ArrayList<>();
        List<String> lstTestCode = new ArrayList<>(randomTestSetCode(generateReqDTO.getNumOfTestSet()));
        for (int i = 0; i < generateReqDTO.getNumOfTestSet(); i++) {
            TestSet newTestSet = TestSet.builder()
                .testId(test.getId())
                .testNo(String.valueOf(i + 1))
                .code(lstTestCode.get(i))
                .isEnabled(Boolean.TRUE).build();
            newTestSet.setCreatedBy(currentUserId);
            newTestSet.setCreatedAt(new Date());
            lstTestSet.add(newTestSet);
        }
        // Tạo đề
        lstTestSet = testSetRepository.saveAll(lstTestSet);
        List<TestSetQuestion> lstTestSetQuestion = new ArrayList<>();
        List<TestSetQuestionMapDTO> lstMapTestQuestionDTO = new ArrayList<>();

        // Map TestSet và Question
        for (TestSet testSet : lstTestSet) {
            TestSetQuestionMapDTO mapDTO = new TestSetQuestionMapDTO();
            mapDTO.setTestSetId(testSet.getId());
            // Trộn các câu hỏi ở mức độ dễ
            int numberEasyQuestion = Math.min(genTestConfig.getNumEasyQuestion(), lstEasyQuestion.size());
            if (numberEasyQuestion > 0) {
                Collections.shuffle(lstEasyQuestion);
                mapDTO.getLstQuestionAnswer().addAll(lstEasyQuestion.subList(0, numberEasyQuestion - 1));
            }
            // Trộn các câu hỏi mức trung bình
            Collections.shuffle(lstEasyQuestion);
            int numberMediumQuestion = Math.min(genTestConfig.getNumMediumQuestion(), lstMediumQuestion.size());
            if (numberMediumQuestion > 0) {
                Collections.shuffle(lstMediumQuestion);
                mapDTO.getLstQuestionAnswer().addAll(lstMediumQuestion.subList(0, numberMediumQuestion - 1));
            }

            // Trộn các câu hỏi mức trung bình
            Collections.shuffle(lstEasyQuestion);
            int numberHardQuestion = Math.min(genTestConfig.getNumHardQuestion(), lstHardQuestion.size());
            if (numberHardQuestion > 0) {
                Collections.shuffle(lstHardQuestion);
                mapDTO.getLstQuestionAnswer().addAll(lstHardQuestion.subList(0, numberHardQuestion - 1));
            }
            lstMapTestQuestionDTO.add(mapDTO);
        }

        // convert sang entity để save vào db
        for (TestSetQuestionMapDTO mapDTO : lstMapTestQuestionDTO) {
            for (int i = 0; i < mapDTO.getLstQuestionAnswer().size(); i++) {
                QuestionAnswerDTO questionAnswer = mapDTO.getLstQuestionAnswer().get(i);
                lstTestSetQuestion.add(TestSetQuestion.builder()
                    .testSetId(mapDTO.getTestSetId())
                    .questionId(questionAnswer.getId())
                    .questionNo(i + 1)
                    .lstAnswer(randomTestQuestionAnswer(questionAnswer.getLstAnswerId()))
                    .build());
            }
        }
        testSetQuestionRepository.saveAll(lstTestSetQuestion);
    }


    @Override
    public TestSetDetailDTO getTestSetDetail(TestSetSearchReqDTO searchReqDTO) {
        // Lấy thông tin đề thi
        ITestSetResDTO testSetDetail = testSetRepository.getTestSetDetail(searchReqDTO.getTestId(), searchReqDTO.getCode());
        if (Objects.isNull(testSetDetail.getTestSetId())) {
            throw exceptionFactory.resourceNotFoundException(MessageConst.TestSet.NOT_FOUND, MessageConst.RESOURCE_NOT_FOUND, Resources.TEST_SET,
                ErrorKey.TestSet.TEST_ID_AND_CODE, String.valueOf(searchReqDTO.getTestId()), searchReqDTO.getCode());
        }
        // Lấy thông tin câu hỏi và đáp án trong đề;
        List<TestQuestionAnswerResDTO> lstQuestions = testSetRepository.getListTestSetQuestion(testSetDetail.getTestSetId()).stream()
            .map(TestQuestionAnswerResDTO::new).collect(Collectors.toList());
        return new TestSetDetailDTO(testSetDetail, lstQuestions);
    }

    @Override
    public InputStreamResource exportTestSet(TestSetSearchReqDTO searchReqDTO) {
        TestSetDetailDTO testSetDetail = getTestSetDetail(searchReqDTO);
        try {
            ByteArrayInputStream inputStream = WordUtils.exportTestToWord(testSetDetail);
            if (Objects.nonNull(inputStream)) {
                return new InputStreamResource(inputStream);
            }
        } catch (IOException e) {
            log.error("======= EXCEPTION: {0} CAUSE BY {} ========", e.getMessage(), e.getCause());
        }
        return null;
    }

    @Transactional
    @Override
    public void updateTestSet(TestSetUpdateDTO updateDTO) {
        if (!testSetRepository.existsByIdAndIsEnabled(updateDTO.getTestSetId(), Boolean.TRUE)) {
            throw exceptionFactory.resourceNotFoundException(MessageConst.TestSet.NOT_FOUND, MessageConst.RESOURCE_NOT_FOUND, Resources.TEST_SET,
                ErrorKey.TestSet.ID, String.valueOf(updateDTO.getTestSetId()));
        }
        // Xoá các bản ghi testSetQuestion hiện tại và lưu mới
        testSetQuestionRepository.deleteAllByTestSetId(updateDTO.getTestSetId());

        // Lưu các bản ghi mới
        List<TestSetQuestion> lstNewTestSetQuestion = updateDTO.getQuestions().stream()
            .map(question -> new TestSetQuestion(updateDTO.getTestSetId(), question))
            .collect(Collectors.toList());
        testSetQuestionRepository.saveAll(lstNewTestSetQuestion);
    }

    /**
     * Sinh tự động mã đề trong kỳ thi
     */
    private Set<String> randomTestSetCode(Integer length) {
        Set<String> lstRandomCode = new HashSet<>();
        do {
            lstRandomCode.add(RandomStringUtils.randomNumeric(3));
        } while (lstRandomCode.size() < length);
        return lstRandomCode;
    }

    /**
     * Random thứ tự đáp án 1 câu hỏi trong đề
     */
    private List<TestQuestionAnswer> randomTestQuestionAnswer(List<Long> lstAnswerId) {
        if (ObjectUtils.isEmpty(lstAnswerId)) {
            return new ArrayList<>();
        }
        List<TestQuestionAnswer> lstTestQuestionAnswer = new ArrayList<>();
        List<Integer> answerOrder = IntStream.range(1, Math.min(lstAnswerId.size(), MAX_NUM_ANSWERS_PER_QUESTION) + 1).boxed()
            .collect(Collectors.toList());
        Collections.shuffle(answerOrder);
        for (int i = 0; i < lstAnswerId.size(); i++) {
            lstTestQuestionAnswer.add(new TestQuestionAnswer(lstAnswerId.get(i), answerOrder.get(i)));
        }
        return lstTestQuestionAnswer;
    }

}
