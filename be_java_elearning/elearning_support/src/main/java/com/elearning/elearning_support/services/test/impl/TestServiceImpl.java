package com.elearning.elearning_support.services.test.impl;

import java.text.DecimalFormat;
import java.util.Date;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.ObjectUtils;
import com.elearning.elearning_support.constants.message.errorKey.ErrorKey;
import com.elearning.elearning_support.constants.message.messageConst.MessageConst;
import com.elearning.elearning_support.constants.message.messageConst.MessageConst.Resources;
import com.elearning.elearning_support.dtos.test.TestDetailDTO;
import com.elearning.elearning_support.dtos.test.TestReqDTO;
import com.elearning.elearning_support.entities.chapter.Chapter;
import com.elearning.elearning_support.entities.subject.Subject;
import com.elearning.elearning_support.entities.test.Test;
import com.elearning.elearning_support.entities.test.TestQuestion;
import com.elearning.elearning_support.enums.commons.StatusEnum;
import com.elearning.elearning_support.exceptions.exceptionFactory.ExceptionFactory;
import com.elearning.elearning_support.repositories.question.QuestionRepository;
import com.elearning.elearning_support.repositories.test.TestRepository;
import com.elearning.elearning_support.repositories.test.test_question.TestQuestionRepository;
import com.elearning.elearning_support.services.subject.SubjectService;
import com.elearning.elearning_support.services.test.TestService;
import com.elearning.elearning_support.utils.auth.AuthUtils;
import com.elearning.elearning_support.utils.object.ObjectMapperUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class TestServiceImpl implements TestService {

    private final QuestionRepository questionRepository;

    private final TestQuestionRepository testQuestionRepository;

    private final SubjectService subjectService;

    private final ExceptionFactory exceptionFactory;
    private final TestRepository testRepository;

    @Transactional
    @Override
    public Long createRandomTest(TestReqDTO createDTO) {
        // Check môn học và chương
        Subject subject = subjectService.findById(createDTO.getSubjectId());

        // Check input chapterIds
        Set<Long> lstChapterIdInSubject = subject.getLstChapter().stream().map(Chapter::getId).collect(Collectors.toSet());
        if (!lstChapterIdInSubject.containsAll(createDTO.getChapterIds())) {
            throw exceptionFactory.resourceNotFoundException(MessageConst.Chapter.NOT_FOUND, MessageConst.RESOURCE_NOT_FOUND, Resources.CHAPTER,
                ErrorKey.Chapter.ID);
        }

        // Lấy các câu hỏi trong môn học và các chương đã chọn
        if (!ObjectUtils.isEmpty(createDTO.getChapterIds())) {
            lstChapterIdInSubject.removeIf(item -> !createDTO.getChapterIds().contains(item));
        }
        Set<Long> lstQuestionIdInChapters = questionRepository.getListQuestionIdByChapterIn(lstChapterIdInSubject);
        // Tạo test
        Test newTest = new Test();
        BeanUtils.copyProperties(createDTO, newTest);
        newTest.setGenTestConfig(ObjectMapperUtil.toJsonString(createDTO.getGenerateConfig()));
        newTest.setIsEnabled(Boolean.TRUE);
        newTest.setCreatedAt(new Date());
        newTest.setCreatedBy(AuthUtils.getCurrentUserId());
        Long testId = testRepository.save(newTest).getId();
        // Tạo test_question
        Double mark = calculateMark(createDTO.getTotalPoint(), createDTO.getQuestionQuantity());
        List<TestQuestion> lstNewTestQuestion = lstQuestionIdInChapters.stream().map(item -> new TestQuestion(testId, item, mark)).collect(
            Collectors.toList());
        testQuestionRepository.saveAll(lstNewTestQuestion);

        return testId;
    }

    @Transactional
    @Override
    public Long createTest(TestReqDTO createDTO) {
        Subject subject = subjectService.findById(createDTO.getSubjectId());

        Set<Long> lstChapterInSubject = subject.getLstChapter().stream().map(Chapter::getId).collect(Collectors.toSet());
        // Get all questions in a subject
        Set<Long> lstQuestionInSubject = questionRepository.getListQuestionIdByChapterIn(lstChapterInSubject);
        if (!lstQuestionInSubject.containsAll(createDTO.getQuestionIds())) {
            throw exceptionFactory.resourceNotFoundException(MessageConst.Question.NOT_FOUND, MessageConst.RESOURCE_NOT_FOUND,
                Resources.QUESTION,
                ErrorKey.Question.ID);
        }

        // Remove not be chosen question in request dto
        if (!ObjectUtils.isEmpty(createDTO.getQuestionIds())) {
            lstQuestionInSubject.removeIf(item -> !createDTO.getQuestionIds().contains(item));
        }
        // Tạo test
        Test newTest = new Test();
        BeanUtils.copyProperties(createDTO, newTest);
        newTest.setGenTestConfig(ObjectMapperUtil.toJsonString(createDTO.getGenerateConfig()));
        newTest.setIsEnabled(Boolean.TRUE);
        newTest.setCreatedAt(new Date());
        newTest.setCreatedBy(AuthUtils.getCurrentUserId());
        Long testId = testRepository.save(newTest).getId();
        // Tạo test_question
        Double mark = calculateMark(createDTO.getTotalPoint(), createDTO.getQuestionQuantity());
        List<TestQuestion> lstNewTestQuestion = lstQuestionInSubject.stream().map(item -> new TestQuestion(testId, item, mark)).collect(
            Collectors.toList());
        testQuestionRepository.saveAll(lstNewTestQuestion);

        return testId;
    }

    @Transactional
    @Override
    public void updateTest(Long testId, TestReqDTO updateDTO) {
        // Check test whether existed
        Test test = testRepository.findByIdAndIsEnabled(testId, Boolean.TRUE).orElseThrow(
            () -> exceptionFactory.resourceNotFoundException(MessageConst.Test.NOT_FOUND, MessageConst.RESOURCE_NOT_FOUND, Resources.TEST,
                ErrorKey.Test.ID, String.valueOf(testId))
        );
        // Update test info
        BeanUtils.copyProperties(updateDTO, test);
        test.setModifiedBy(AuthUtils.getCurrentUserId());
        test.setModifiedAt(new Date());
        test.setGenTestConfig(ObjectMapperUtil.toJsonString(updateDTO.getGenerateConfig()));
        testRepository.save(test);

        // Update test_question
        Set<Long> lstCurrentTestQuestionId = testQuestionRepository.findAllByTestId(testId).stream().map(TestQuestion::getQuestionId).collect(
            Collectors.toSet());
        // New question
        Double mark = calculateMark(updateDTO.getTotalPoint(), updateDTO.getQuestionQuantity());
        Set<Long> lstAddQuestionId = updateDTO.getQuestionIds().stream().filter(item -> !lstCurrentTestQuestionId.contains(item)).collect(
            Collectors.toSet());
        List<TestQuestion> lstNewTestQuestion = lstAddQuestionId.stream().map(item -> new TestQuestion(testId, item, mark)).collect(
            Collectors.toList());
        // Removed question
        Set<Long> lstRemovedQuestionId = lstCurrentTestQuestionId.stream().filter(item -> !updateDTO.getQuestionIds().contains(item)).collect(
            Collectors.toSet());

        // Perform transaction to DB
        testQuestionRepository.deleteAllByTestIdAndQuestionIdIn(test.getId(), lstRemovedQuestionId);
        testQuestionRepository.saveAll(lstNewTestQuestion);
    }

    @Override
    public Page<TestDetailDTO> getListTest(Long subjectId, String subjectCode, Date startTime, Date endTime, Long semesterId,
        String semesterCode, Pageable pageable) {
        return testRepository.getListTest(subjectId, subjectCode, startTime, endTime, semesterId, semesterCode, pageable)
            .map(TestDetailDTO::new);
    }

    @Override
    public Test findTestById(Long testId) {
        return testRepository.findByIdAndIsEnabled(testId, Boolean.TRUE)
            .orElseThrow(() -> exceptionFactory.resourceNotFoundException(MessageConst.Test.NOT_FOUND, Resources.TEST, MessageConst.RESOURCE_NOT_FOUND,
                    ErrorKey.Test.ID, String.valueOf(testId)));
    }

    @Override
    public Boolean checkExistedById(Long testId) {
        if (!testRepository.existsByIdAndIsEnabled(testId, Boolean.TRUE)) {
            throw exceptionFactory.resourceNotFoundException(MessageConst.Test.NOT_FOUND, Resources.TEST, MessageConst.RESOURCE_NOT_FOUND,
                ErrorKey.Test.ID, String.valueOf(testId));
        }
        return Boolean.TRUE;
    }

    @Override
    public void switchTestStatus(Long testId, StatusEnum statusEnum) {
        Boolean newStatus = Objects.equals(statusEnum, StatusEnum.ENABLED) ? Boolean.TRUE : Boolean.FALSE;
        testRepository.switchTestStatus(testId, newStatus);
    }

    private Double calculateMark(Integer totalPoint, Integer questionQuantity) {
        try {
            Double questionMark = (double) totalPoint / questionQuantity;
            return Double.parseDouble(new DecimalFormat("#.000000").format(questionMark));
        } catch (Exception e) {
            log.error("==== ERROR {0} ====", e.getCause());
            return null;
        }
    }
}
