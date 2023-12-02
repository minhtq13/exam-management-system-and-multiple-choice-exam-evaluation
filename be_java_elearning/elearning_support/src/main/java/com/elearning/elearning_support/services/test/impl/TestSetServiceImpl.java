package com.elearning.elearning_support.services.test.impl;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.IOException;
import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.IntStream;
import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.ObjectUtils;
import org.apache.commons.lang3.RandomStringUtils;
import org.apache.commons.math3.util.Pair;
import org.springframework.core.io.InputStreamResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import com.elearning.elearning_support.constants.SystemConstants;
import com.elearning.elearning_support.dtos.common.ICommonIdCode;
import com.elearning.elearning_support.dtos.test.test_set.ITestSetScoringDTO;
import com.elearning.elearning_support.dtos.test.test_set.TestSetPreviewDTO;
import com.elearning.elearning_support.entities.exam_class.ExamClass;
import com.elearning.elearning_support.entities.studentTest.StudentTestSet;
import com.elearning.elearning_support.entities.studentTest.StudentTestSetDetail;
import com.elearning.elearning_support.enums.users.UserTypeEnum;
import com.elearning.elearning_support.repositories.examClass.ExamClassRepository;
import com.elearning.elearning_support.repositories.test.test_set.StudentTestSetRepository;
import com.elearning.elearning_support.repositories.users.UserRepository;
import com.elearning.elearning_support.utils.StringUtils;
import com.elearning.elearning_support.utils.file.FileUtils;
import com.elearning.elearning_support.utils.tests.TestUtils;
import com.elearning.elearning_support.constants.message.errorKey.ErrorKey;
import com.elearning.elearning_support.constants.message.messageConst.MessageConst;
import com.elearning.elearning_support.constants.message.messageConst.MessageConst.Resources;
import com.elearning.elearning_support.dtos.question.QuestionAnswerDTO;
import com.elearning.elearning_support.dtos.studentTestSet.HandledAnswerDTO;
import com.elearning.elearning_support.dtos.studentTestSet.StudentHandledTestDTO;
import com.elearning.elearning_support.dtos.test.GenTestConfigDTO;
import com.elearning.elearning_support.dtos.test.test_question.TestQuestionAnswerResDTO;
import com.elearning.elearning_support.dtos.test.test_set.ITestQuestionCorrectAnsDTO;
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

    private final UserRepository userRepository;

    private static final int MAX_NUM_ANSWERS_PER_QUESTION = 6;

    private final TestSetRepository testSetRepository;

    private final TestRepository testRepository;

    private final ExceptionFactory exceptionFactory;

    private final QuestionRepository questionRepository;

    private final TestSetQuestionRepository testSetQuestionRepository;

    private final StudentTestSetRepository studentTestSetRepository;

    private final ExamClassRepository examClassRepository;

    @Transactional
    @Override
    public List<TestSetPreviewDTO> generateTestSet(TestSetGenerateReqDTO generateReqDTO) {
        Long currentUserId = AuthUtils.getCurrentUserId();
        Test test = testRepository.findByIdAndIsEnabled(generateReqDTO.getTestId(), Boolean.TRUE).orElseThrow(
            () -> exceptionFactory.resourceNotFoundException(MessageConst.Test.NOT_FOUND, MessageConst.RESOURCE_NOT_FOUND, Resources.TEST,
                ErrorKey.Test.ID, String.valueOf(generateReqDTO.getTestId()))
        );

        // Lấy cấu hình tạo đề thi
        GenTestConfigDTO genTestConfig = ObjectMapperUtil.objectMapper(test.getGenTestConfig(), GenTestConfigDTO.class);
        if (Objects.isNull(genTestConfig)) {
            return null;
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
        List<String> lstTestCode = new ArrayList<>(randomTestSetCode(generateReqDTO.getTestId(), generateReqDTO.getNumOfTestSet()));
        for (int i = 0; i < generateReqDTO.getNumOfTestSet(); i++) {
            TestSet newTestSet = TestSet.builder()
                .testId(test.getId())
                .testNo(String.valueOf(i + 1))
                .code(lstTestCode.get(i))
                .questionMark(calculateQuestionMark(test.getTotalPoint(), test.getQuestionQuantity()))
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
        return lstTestSet.stream()
            .map(testSet -> new TestSetPreviewDTO(testSet.getId(), testSet.getCode(), testSet.getTestNo(), testSet.getTestId())).collect(
                Collectors.toList());
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
            .map(TestQuestionAnswerResDTO::new).sorted(Comparator.comparing(TestQuestionAnswerResDTO::getQuestionNo))
            .collect(Collectors.toList());
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
            log.error(MessageConst.EXCEPTION_LOG_FORMAT, e.getMessage(), e.getCause());
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
    private Set<String> randomTestSetCode(Long testId, Integer length) {
        Set<String> lstRandomCode = new HashSet<>();
        do {
            String newCode = RandomStringUtils.randomNumeric(3);
            if (!testSetRepository.existsByTestIdAndCode(testId, newCode)) {
                lstRandomCode.add(newCode);
            }
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

    private Double calculateQuestionMark(Integer totalPoint, Integer questionQuantity) {
        try {
            Double questionMark = (double) totalPoint / questionQuantity;
            return Double.parseDouble(new DecimalFormat("#.000000").format(questionMark));
        } catch (Exception e) {
            log.error("==== ERROR {0} ====", e.getCause());
            return null;
        }
    }


    /**
     * ======================== TEST SET SCORING SERVICES ====================
     */
    @Transactional
    @Override
    public void scoreStudentTestSet(List<StudentHandledTestDTO> handledTestSets) {
        Long currentUserId = AuthUtils.getCurrentUserId();
        // find -> student, test-set
        // Map exam_class + testCode -> testSetId
        Map<Pair<String, String>, ITestSetScoringDTO> mapGeneralHandledData = new HashMap<>();
        Set<String> examClassCodes = handledTestSets.stream().map(StudentHandledTestDTO::getExamClassCode).collect(Collectors.toSet());
        Set<String> testCodes = handledTestSets.stream().map(StudentHandledTestDTO::getTestCode).collect(Collectors.toSet());
        List<ITestSetScoringDTO> generalScoringData = testSetRepository.getTestSetGeneralScoringData(examClassCodes, testCodes);
        generalScoringData.forEach(item -> mapGeneralHandledData.put(Pair.create(item.getExamClassCode(), item.getTestCode()), item));

        // map studentCode -> studentId
        Set<String> lstStudentCode = handledTestSets.stream().map(StudentHandledTestDTO::getStudentCode).collect(Collectors.toSet());
        Map<String, Long> mapUserCodeId = userRepository.getListIdCodeByCodeAndUserType(lstStudentCode, UserTypeEnum.STUDENT.getType()).stream()
            .collect(Collectors.toMap(ICommonIdCode::getCode, ICommonIdCode::getId));

        // list student - test set
        List<StudentTestSet> lstStudentTestSet = new ArrayList<>();

        // map testSetId -> query test_set_question
        Map<Long, Set<ITestQuestionCorrectAnsDTO>> mapQueriedTestSetQuestions = new HashMap<>();
        for (StudentHandledTestDTO handledItem : handledTestSets) {
            // init map
            ITestSetScoringDTO handledData = mapGeneralHandledData.get(Pair.create(handledItem.getExamClassCode(), handledItem.getTestCode()));
            Long testSetId = handledData.getTestSetId();
            Long studentId = mapUserCodeId.get(handledItem.getStudentCode());

            // create a studentTestSet row
            StudentTestSet studentTestSet = new StudentTestSet(studentId, testSetId);
            studentTestSet.setCreatedAt(new Date());
            studentTestSet.setCreatedBy(currentUserId);
            studentTestSet.setIsEnabled(Boolean.TRUE);
            List<StudentTestSetDetail> lstDetails = new ArrayList<>();

            Map<Integer, ITestQuestionCorrectAnsDTO> mapQuestionCorrectAns = new HashMap<>();
            Set<ITestQuestionCorrectAnsDTO> correctAnswers = mapQueriedTestSetQuestions.get(testSetId);
            // Check if test set has queried
            if (Objects.isNull(correctAnswers)) {
                correctAnswers = testSetRepository.getListTestQuestionCorrectAns(testSetId);
                mapQueriedTestSetQuestions.put(testSetId, correctAnswers);
            }
            correctAnswers.forEach(item -> mapQuestionCorrectAns.put(item.getQuestionNo(), item));
            // scoring
//            int numCorrectAns = 0;
            int numNotMarkedQuestions = 0;
            for (HandledAnswerDTO handledAnswer : handledItem.getAnswers()) {
                // Get selected answers and check if not marked
                Set<Integer> selectedAnsNo = TestUtils.getSelectedAnswer(handledAnswer.getSelectedAnswers());
                if (ObjectUtils.isEmpty(selectedAnsNo)) {
                    numNotMarkedQuestions++;
                }
                // Get correct answer of question in this test set
                ITestQuestionCorrectAnsDTO correctAnswerDTO = mapQuestionCorrectAns.get(handledAnswer.getQuestionNo());
                if (Objects.isNull(correctAnswerDTO)) {
                    continue;
                }
                Set<Integer> correctAnswerNo = StringUtils.convertStrIntegerToSet(correctAnswerDTO.getCorrectAnswerNo());
                // Create new studentTestSetDetails
                StudentTestSetDetail studentAnswerDetail = new StudentTestSetDetail();
                studentAnswerDetail.setTestSetQuestionId(correctAnswerDTO.getId());
                studentAnswerDetail.setSelectedAnswer(selectedAnsNo.toArray(Integer[]::new));
                studentAnswerDetail.setIsEnabled(Boolean.TRUE);
                studentAnswerDetail.setCreatedAt(new Date());
                studentAnswerDetail.setCreatedBy(currentUserId);
                if (!ObjectUtils.isEmpty(correctAnswerNo) && CollectionUtils.containsAll(correctAnswerNo, selectedAnsNo)) {
                    studentAnswerDetail.setIsCorrected(Boolean.TRUE);
//                    numCorrectAns ++;
                } else {
                    studentAnswerDetail.setIsCorrected(Boolean.FALSE);
                }
                lstDetails.add(studentAnswerDetail);
            }
            studentTestSet.setMarked(handledItem.getAnswers().size() - numNotMarkedQuestions);
            studentTestSet.setMarkerRate(((double) (studentTestSet.getMarked()) / (handledItem.getAnswers().size())) * 100.0);
            studentTestSet.setLstStudentTestSetDetail(lstDetails);
            lstStudentTestSet.add(studentTestSet);
        }
        studentTestSetRepository.saveAll(lstStudentTestSet);
    }

    @Override
    public void uploadStudentHandledAnswerSheet(Long examClassId, MultipartFile[] handledFiles) {
        // Check existed exam_class
        ExamClass examClass = examClassRepository.findByIdAndIsEnabled(examClassId, Boolean.TRUE)
            .orElseThrow(() -> exceptionFactory.resourceNotFoundException(MessageConst.ExamClass.NOT_FOUND, Resources.EXAM_CLASS,
                MessageConst.RESOURCE_NOT_FOUND, ErrorKey.ExamClass.ID, String.valueOf(examClassId)));

        // Check system os
        boolean isWindows = System.getProperty("os.name").toLowerCase().contains("windows");
        File sharedAppDataDir;
        String sharedAppDataPath;
        if (isWindows) {
            sharedAppDataPath = SystemConstants.WINDOWS_SHARED_DIR;
            log.info("Windows's shared app data {}", SystemConstants.WINDOWS_SHARED_DIR);
        } else {
            sharedAppDataPath = SystemConstants.LINUX_SHARED_DIR;
            log.info("Linux's shared app data {}", SystemConstants.LINUX_SHARED_DIR);
        }
        sharedAppDataDir = new File(sharedAppDataPath);
        if (!sharedAppDataDir.exists()) {
            log.info("Make sharedAppDataDir {}", sharedAppDataDir.mkdirs() ? "successfully" : "fail");
        }

        // upload handled answer sheet's images
        String examClassStoredPath = String.format("%s/%s/%s/", sharedAppDataPath, "AnsweredSheets", examClass.getCode());
        File examClassStoredDir = new File(examClassStoredPath);
        if (!examClassStoredDir.exists()) {
            log.info("Make examClassStoredDir {}", examClassStoredDir.mkdirs() ? "successfully" : "fail");
        }
        // Write file to storage directory
        try {
            for (MultipartFile handledFile : handledFiles) {
                FileUtils.covertMultipartToFile(examClassStoredPath, handledFile);
            }
        } catch (Exception exception) {
            log.error(MessageConst.EXCEPTION_LOG_FORMAT, exception.getMessage(), exception.getCause());
        }
    }
}
