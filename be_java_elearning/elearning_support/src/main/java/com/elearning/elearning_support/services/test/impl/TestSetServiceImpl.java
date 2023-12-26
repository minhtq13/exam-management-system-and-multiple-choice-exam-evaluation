package com.elearning.elearning_support.services.test.impl;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.Arrays;
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
import org.apache.commons.compress.utils.FileNameUtils;
import org.apache.commons.lang3.ObjectUtils;

import org.apache.commons.lang3.RandomStringUtils;
import org.apache.commons.math3.util.Pair;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.InputStreamResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import com.aspose.words.Document;
import com.aspose.words.SaveFormat;
import com.elearning.elearning_support.constants.FileConstants.Extension.Image;
import com.elearning.elearning_support.constants.SystemConstants;
import com.elearning.elearning_support.constants.message.errorKey.ErrorKey.User;
import com.elearning.elearning_support.constants.message.messageConst.MessageConst.UserExamClass;
import com.elearning.elearning_support.dtos.CustomInputStreamResource;
import com.elearning.elearning_support.dtos.examClass.IExamClassParticipantDTO;
import com.elearning.elearning_support.dtos.fileAttach.FileAttachDTO;
import com.elearning.elearning_support.dtos.fileAttach.FileUploadResDTO;
import com.elearning.elearning_support.dtos.test.studentTestSet.HandledImagesDeleteDTO;
import com.elearning.elearning_support.dtos.test.test_set.ITestSetScoringDTO;
import com.elearning.elearning_support.dtos.test.test_set.ScoringPreviewItemDTO;
import com.elearning.elearning_support.dtos.test.test_set.ScoringPreviewResDTO;
import com.elearning.elearning_support.dtos.test.test_set.TestSetPreviewDTO;
import com.elearning.elearning_support.entities.exam_class.ExamClass;
import com.elearning.elearning_support.entities.studentTest.StudentTestSet;
import com.elearning.elearning_support.entities.studentTest.StudentTestSetDetail;
import com.elearning.elearning_support.enums.examClass.UserExamClassRoleEnum;
import com.elearning.elearning_support.enums.file_attach.FileTypeEnum;
import com.elearning.elearning_support.exceptions.BadRequestException;
import com.elearning.elearning_support.repositories.examClass.ExamClassRepository;
import com.elearning.elearning_support.repositories.test.test_set.StudentTestSetRepository;
import com.elearning.elearning_support.repositories.users.UserRepository;
import com.elearning.elearning_support.services.fileAttach.FileAttachService;
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

    public static final String ANSWERED_SHEETS = "AnsweredSheets";

    public static final String SCORED_SHEETS = "ScoredSheets";

    public static final String FILE_TEMP_SCORED_RESULTS_DATA = "temp_results_%s.json";

    @Value("${app.root-domain}")
    private String rootDomain;

    private static final int MAX_NUM_ANSWERS_PER_QUESTION = 6;

    private final TestSetRepository testSetRepository;

    private final TestRepository testRepository;

    private final ExceptionFactory exceptionFactory;

    private final QuestionRepository questionRepository;

    private final TestSetQuestionRepository testSetQuestionRepository;

    private final StudentTestSetRepository studentTestSetRepository;

    private final ExamClassRepository examClassRepository;

    private final FileAttachService fileAttachService;

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
                .totalPoint(test.getTotalPoint())
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
            mapDTO.setTotalPoint(test.getTotalPoint());
            // Trộn các câu hỏi ở mức độ dễ
            int numberEasyQuestion = Math.min(genTestConfig.getNumEasyQuestion(), lstEasyQuestion.size());
            if (numberEasyQuestion > 0) {
                Collections.shuffle(lstEasyQuestion);
                mapDTO.getLstQuestionAnswer().addAll(lstEasyQuestion.subList(0, numberEasyQuestion));
            }
            // Trộn các câu hỏi mức trung bình
            Collections.shuffle(lstEasyQuestion);
            int numberMediumQuestion = Math.min(genTestConfig.getNumMediumQuestion(), lstMediumQuestion.size());
            if (numberMediumQuestion > 0) {
                Collections.shuffle(lstMediumQuestion);
                mapDTO.getLstQuestionAnswer().addAll(lstMediumQuestion.subList(0, numberMediumQuestion));
            }

            // Trộn các câu hỏi mức trung bình
            Collections.shuffle(lstEasyQuestion);
            int numberHardQuestion = Math.min(genTestConfig.getNumHardQuestion(), lstHardQuestion.size());
            if (numberHardQuestion > 0) {
                Collections.shuffle(lstHardQuestion);
                mapDTO.getLstQuestionAnswer().addAll(lstHardQuestion.subList(0, numberHardQuestion));
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
                    .questionMark(calculateQuestionMark(mapDTO.getTotalPoint(), mapDTO.getLstQuestionAnswer().size()))
                    .lstAnswer(randomTestQuestionAnswer(questionAnswer.getLstAnswerId()))
                    .build());
            }
        }
        testSetQuestionRepository.saveAll(lstTestSetQuestion);
        return lstTestSet.stream()
            .map(testSet -> new TestSetPreviewDTO(testSet.getId(), testSet.getCode(), testSet.getTestNo(), testSet.getTestId()))
            .collect(Collectors.toList());
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

    @Override
    public CustomInputStreamResource exportTestSetFromHtml(MultipartFile fileHtml) {
        try {
            Document document = new Document(new ByteArrayInputStream(fileHtml.getBytes()));
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            document.save(outputStream, SaveFormat.DOCX);
            outputStream.close();
            return new CustomInputStreamResource(FileNameUtils.getBaseName(fileHtml.getOriginalFilename()) + ".docx",
                new InputStreamResource(new ByteArrayInputStream(outputStream.toByteArray())));
        } catch (Exception exception) {
            log.error(MessageConst.EXCEPTION_LOG_FORMAT, exception.getMessage(), exception.getCause());
        }
        return new CustomInputStreamResource();
    }

    @Transactional
    @Override
    public void updateTestSet(TestSetUpdateDTO updateDTO) {
        TestSet testSet = testSetRepository.findByIdAndIsEnabled(updateDTO.getTestSetId(), Boolean.TRUE)
            .orElseThrow(() -> exceptionFactory.resourceNotFoundException(MessageConst.TestSet.NOT_FOUND, MessageConst.RESOURCE_NOT_FOUND, Resources.TEST_SET,
                ErrorKey.TestSet.ID, String.valueOf(updateDTO.getTestSetId())));
        // Xoá các bản ghi testSetQuestion hiện tại và lưu mới
        testSetQuestionRepository.deleteAllByTestSetId(updateDTO.getTestSetId());

        // Lưu các bản ghi mới
        Integer numOfQuestion = updateDTO.getQuestions().size();
        List<TestSetQuestion> lstNewTestSetQuestion = updateDTO.getQuestions().stream()
            .map(question -> new TestSetQuestion(updateDTO.getTestSetId(), calculateQuestionMark(testSet.getTotalPoint(), numOfQuestion),
                question))
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
    public ScoringPreviewResDTO scoreExamClassTestSet(String examClassCode) {
        callAIModelProcessing(examClassCode);
        return scoreStudentTestSet(examClassCode, loadListStudentScoredSheets(examClassCode));
    }


    @Transactional
    @Override
    public ScoringPreviewResDTO scoreStudentTestSet(String examClassCode, List<StudentHandledTestDTO> handledTestSets) {
        long startTimeMillis = System.currentTimeMillis();
        log.info("============== STARTED SCORING HANDLED ANSWER SHEET AT {} =================", startTimeMillis);
        Long currentUserId = AuthUtils.getCurrentUserId();
        // find -> student, test-set
        // Map exam_class + testCode -> testSetId
        Map<Pair<String, String>, ITestSetScoringDTO> mapGeneralHandledData = new HashMap<>();
        //Sử dụng logic chấm thi theo lớp
        //Set<String> examClassCodes = handledTestSets.stream().map(StudentHandledTestDTO::getExamClassCode).collect(Collectors.toSet());
        Set<String> testCodes = handledTestSets.stream().map(StudentHandledTestDTO::getTestSetCode).collect(Collectors.toSet());
        List<ITestSetScoringDTO> generalScoringData = testSetRepository.getTestSetGeneralScoringData(Collections.singleton(examClassCode), testCodes);
        generalScoringData.forEach(item -> mapGeneralHandledData.put(Pair.create(examClassCode, item.getTestSetCode()), item));

        // map studentCode -> studentId
        // get list student in exam class
        Long examClassId = ObjectUtils.isEmpty(generalScoringData) ? -1L : generalScoringData.get(0).getExamClassId();
        Map<String, Long> mapUserCodeId = examClassRepository.getListExamClassParticipant(examClassId, UserExamClassRoleEnum.STUDENT.getType())
            .stream().collect(Collectors.toMap(IExamClassParticipantDTO::getCode, IExamClassParticipantDTO::getId));

        //list student - test set
        List<StudentTestSet> lstStudentTestSet = new ArrayList<>();

        // map testSetId -> query test_set_question
        Map<Long, Set<ITestQuestionCorrectAnsDTO>> mapQueriedTestSetQuestions = new HashMap<>();
        List<ScoringPreviewItemDTO> lstScoringPreview = new ArrayList<>();
        for (StudentHandledTestDTO handledItem : handledTestSets) {
            // init map
            ITestSetScoringDTO handledData = mapGeneralHandledData.get(Pair.create(examClassCode, handledItem.getTestSetCode()));
            // if test_set_code not used in this test or ex_class
            if (Objects.isNull(handledData)) {
                throw exceptionFactory.resourceNotFoundException(MessageConst.TestSet.NOT_FOUND, MessageConst.RESOURCE_NOT_FOUND,
                    Resources.TEST_SET, ErrorKey.TestSet.CODE, handledItem.getTestSetCode());
            }
            // if the student_code is not in the exam_class
            Long studentId = mapUserCodeId.get(handledItem.getStudentCode());
            if (Objects.isNull(studentId)) {
                throw exceptionFactory.resourceNotFoundException(UserExamClass.STUDENT_NOT_FOUND, MessageConst.RESOURCE_NOT_FOUND,
                    Resources.USER_EXAM_CLASS, User.CODE, handledItem.getStudentCode());
            }
            Long testSetId = handledData.getTestSetId();

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
            int numCorrectAns = 0;
            int numNotMarkedQuestions = 0;
            double totalScore = 0.0;
            for (HandledAnswerDTO handledAnswer : handledItem.getAnswers()) {
                // Get selected answers and check if not marked
                Set<Integer> selectedAnsNo = TestUtils.getSelectedAnswerNo(handledAnswer.getSelectedAnswers());
                if (ObjectUtils.isEmpty(selectedAnsNo)) {
                    numNotMarkedQuestions++;
                }
                // Get correct answer of question in this test set
                ITestQuestionCorrectAnsDTO correctAnswerDTO = mapQuestionCorrectAns.get(handledAnswer.getQuestionNo());
                if (Objects.isNull(correctAnswerDTO)) {
                    continue;
                }
                Set<Integer> correctAnswerNo = StringUtils.convertStrIntegerToSet(correctAnswerDTO.getCorrectAnswerNo());
                handledAnswer.setCorrectAnswers(TestUtils.getSelectedAnswerChar(correctAnswerNo));
                // Create new studentTestSetDetails
                StudentTestSetDetail studentAnswerDetail = new StudentTestSetDetail();
                studentAnswerDetail.setTestSetQuestionId(correctAnswerDTO.getId());
                studentAnswerDetail.setSelectedAnswer(selectedAnsNo.toArray(Integer[]::new));
                studentAnswerDetail.setIsEnabled(Boolean.TRUE);
                studentAnswerDetail.setCreatedAt(new Date());
                studentAnswerDetail.setCreatedBy(currentUserId);
                if (!ObjectUtils.isEmpty(correctAnswerNo) && !ObjectUtils.isEmpty(selectedAnsNo) &&
                    CollectionUtils.containsAll(correctAnswerNo, selectedAnsNo)) {
                    studentAnswerDetail.setIsCorrected(Boolean.TRUE);
                    totalScore += correctAnswerDTO.getQuestionMark();
                    numCorrectAns++;
                } else {
                    studentAnswerDetail.setIsCorrected(Boolean.FALSE);
                }
                lstDetails.add(studentAnswerDetail);
            }

            // upload scored image
            String handledImgPath = handledItem.getHandledScoredImg();
            FileUploadResDTO handledUploadFile = new FileUploadResDTO();
            if(Objects.nonNull(handledImgPath)){
                handledUploadFile = fileAttachService.uploadFileToCloudinary(new File(handledItem.getHandledScoredImg()),
                    FileTypeEnum.IMAGE);
            }
            // create student test set
            studentTestSet.setHandedTestFile(handledUploadFile.getId());
            studentTestSet.setMarked(handledItem.getAnswers().size() - numNotMarkedQuestions);
            studentTestSet.setMarkerRate(((double) (studentTestSet.getMarked()) / (handledItem.getAnswers().size())) * 100.0);
            studentTestSet.setLstStudentTestSetDetail(lstDetails);
            lstStudentTestSet.add(studentTestSet);

            // create scoring preview for each handled answer-sheet
            ScoringPreviewItemDTO scoringPreviewItem = new ScoringPreviewItemDTO(handledItem);
            scoringPreviewItem.setNumTestSetQuestions(mapQueriedTestSetQuestions.size());
            scoringPreviewItem.setNumMarkedAnswers(handledItem.getAnswers().size() - numNotMarkedQuestions);
            scoringPreviewItem.setNumCorrectAnswers(numCorrectAns);
            scoringPreviewItem.setNumWrongAnswers(mapQueriedTestSetQuestions.size() - numCorrectAns);
            scoringPreviewItem.setTotalScore(totalScore);
            scoringPreviewItem.setHandledScoredImg(handledUploadFile.getFilePath());
            scoringPreviewItem.setOriginalImgFileName(handledItem.getOriginalImgFileName());
            scoringPreviewItem.setOriginalImg(
                String.format("%s%s/data/%s/%s/%s", rootDomain, SystemConstants.SHARED_DIR_SERVER_PATH, ANSWERED_SHEETS,
                    examClassCode, handledItem.getOriginalImgFileName()));
            lstScoringPreview.add(scoringPreviewItem);
        }

        // store temp data for saving later
        String tmpFileCode = null;
        try {
            tmpFileCode = String.format("%sTMP%s", AuthUtils.getCurrentUserId(), System.currentTimeMillis());
            File tempData = new File(
                SystemConstants.RESOURCE_PATH + FileUtils.DOCUMENTS_STORED_LOCATION + String.format(FILE_TEMP_SCORED_RESULTS_DATA, tmpFileCode));
            String data = ObjectMapperUtil.toJsonString(lstStudentTestSet);
            FileOutputStream fos = new FileOutputStream(tempData);
            fos.write(data.getBytes(StandardCharsets.UTF_8));
            fos.close();
        } catch (Exception exception) {
            log.error(MessageConst.EXCEPTION_LOG_FORMAT, exception.getMessage(), exception.getCause());
        }

        log.info("============== ENDED SCORING HANDLED ANSWER SHEET AFTER {} =================", System.currentTimeMillis() - startTimeMillis);
        return new ScoringPreviewResDTO(tmpFileCode, lstScoringPreview);
    }

    @Override
    public void uploadStudentHandledAnswerSheet(String examClassCode, MultipartFile[] handledFiles) throws IOException {
        // Check existed exam_class
        ExamClass examClass = examClassRepository.findByCodeAndIsEnabled(examClassCode, Boolean.TRUE)
            .orElseThrow(() -> exceptionFactory.resourceNotFoundException(MessageConst.ExamClass.NOT_FOUND, Resources.EXAM_CLASS,
                MessageConst.RESOURCE_NOT_FOUND, ErrorKey.ExamClass.CODE, String.valueOf(examClassCode)));

        // Check system os
        File sharedAppDataDir;
        String sharedAppDataPath = FileUtils.getSharedAppDirectoryPath();
        sharedAppDataDir = new File(sharedAppDataPath);
        if (!sharedAppDataDir.exists()) {
            log.info("Make sharedAppDataDir {}", sharedAppDataDir.mkdirs() ? "successfully" : "fail");
        }

        // upload handled answer sheet's images
        String examClassStoredPath = String.format("%s/%s/%s/", sharedAppDataPath, ANSWERED_SHEETS, examClass.getCode());
        File examClassStoredDir = new File(examClassStoredPath);
        if (examClassStoredDir.exists()) {
            // Delete old data before upload
            for (File item : Objects.requireNonNull(examClassStoredDir.listFiles())) {
                // Clear result folder only
                if (item.isDirectory()) {
                    org.apache.commons.io.FileUtils.cleanDirectory(item);
                }
            }
        } else {
            log.info("Make examClassStoredDir {}", examClassStoredDir.mkdirs() ? "successfully" : "fail");
        }
        // Write file to storage directory
        try {
            for (MultipartFile handledFile : handledFiles) {
                FileUtils.validateUploadFile(handledFile, Arrays.asList(Image.JPG, Image.PNG, Image.JPEG));
                FileUtils.covertMultipartToFile(examClassStoredPath, handledFile);
            }
        } catch (Exception exception) {
            log.error(MessageConst.EXCEPTION_LOG_FORMAT, exception.getMessage(), exception.getCause());
        }
    }

    @Override
    public void deleteImagesInClassFolder(HandledImagesDeleteDTO deleteDTO) throws IOException {
        String sharedAppDataPath = FileUtils.getSharedAppDirectoryPath();
        File examClassStoredDir = new File(String.format("%s/%s/%s/", sharedAppDataPath, ANSWERED_SHEETS, deleteDTO.getExamClassCode()));
        int numFileDeleted = 0;
        if (examClassStoredDir.exists()) {
            for (File item : Objects.requireNonNull(examClassStoredDir.listFiles())) {
                if (item.isFile() && deleteDTO.getLstFileName().contains(item.getName())) {
                    boolean isDeleted = item.delete();
                    numFileDeleted += (isDeleted ? 1 : 0);
                }
            }
            // if any files deleted -> clean result folders -> scoring again
            if(numFileDeleted > 0){
                for (File item : Objects.requireNonNull(examClassStoredDir.listFiles())) {
                    if (item.isDirectory()) {
                        org.apache.commons.io.FileUtils.cleanDirectory(item);
                    }
                }
            }
        }
    }

    @Override
    public List<FileAttachDTO> getListFileInExClassFolder(String examClassCode) {
        String sharedAppDataPath = FileUtils.getSharedAppDirectoryPath();
        File examClassStoredDir = new File(String.format("%s/%s/%s/", sharedAppDataPath, ANSWERED_SHEETS, examClassCode));
        List<FileAttachDTO> lstFileInFolder = new ArrayList<>();
        if (examClassStoredDir.exists()) {
            String serverPath = String.format("%s%s/data/%s/%s", rootDomain, SystemConstants.SHARED_DIR_SERVER_PATH, ANSWERED_SHEETS,
                examClassCode);
            for (File item : Objects.requireNonNull(examClassStoredDir.listFiles())) {
                if (item.isFile()) {
                    FileAttachDTO fileDTO = FileAttachDTO.builder()
                        .fileName(item.getName())
                        .filePath(String.format("%s/%s", serverPath, item.getName()))
                        .fileExt(FileNameUtils.getExtension(item.getName()))
                        .build();
                    lstFileInFolder.add(fileDTO);
                }
            }
        }
        return lstFileInFolder;
    }

    @Transactional
    @Override
    public void saveScoringResults(String tempFileCode, String option) {
        try {
            File tempDataFile = new File(
                SystemConstants.RESOURCE_PATH + FileUtils.DOCUMENTS_STORED_LOCATION +
                    String.format(FILE_TEMP_SCORED_RESULTS_DATA, tempFileCode));
            if (!tempDataFile.exists()) {
                throw exceptionFactory.resourceNotFoundException(MessageConst.RESOURCE_NOT_FOUND, MessageConst.RESOURCE_NOT_FOUND,
                    "tempScoringResults", "tempFileCode", tempFileCode);
            }
            if (Objects.equals(option, "SAVE")) {
                String json = org.apache.commons.io.FileUtils.readFileToString(tempDataFile, StandardCharsets.UTF_8);
                List<StudentTestSet> results = ObjectMapperUtil.listMapper(json, StudentTestSet.class);
                studentTestSetRepository.saveAll(results);
                boolean deletedFile = tempDataFile.delete();
            } else if (Objects.equals(option, "DELETE")) {
                boolean deletedFile = tempDataFile.delete();
            } else {
                throw new BadRequestException("option invalid", "option", "option");
            }
        } catch (Exception exception) {
            log.error(MessageConst.EXCEPTION_LOG_FORMAT, exception.getMessage(), exception.getCause());
        }
    }

    /**
     * Load scored student's answer sheets from shared folder
     */
    private List<StudentHandledTestDTO> loadListStudentScoredSheets(String exClassCode) {
        List<StudentHandledTestDTO> lstScoredData = new ArrayList<>();
        File scoredSheetsDir;
        String sharedAppDataPath = FileUtils.getSharedAppDirectoryPath();
        scoredSheetsDir = new File(String.format("%s/%s/%s/%s", sharedAppDataPath, ANSWERED_SHEETS, exClassCode, SCORED_SHEETS));
        if (scoredSheetsDir.exists() && scoredSheetsDir.isDirectory()) {
            for (File scoredDataFile : Objects.requireNonNull(scoredSheetsDir.listFiles())) {
                try {
                    String jsonData = org.apache.commons.io.FileUtils.readFileToString(scoredDataFile, "UTF-8");
                    StudentHandledTestDTO scoredData = ObjectMapperUtil.objectMapper(jsonData, StudentHandledTestDTO.class);
                    if (Objects.nonNull(scoredData)) {
                        lstScoredData.add(scoredData);
                    }
                } catch (IOException e) {
                    log.error(MessageConst.EXCEPTION_LOG_FORMAT, e.getMessage(), e.getCause());
                }
            }
        }
        return lstScoredData;
    }

    /**
     * Call Python AI model to process input images
     */
    private void callAIModelProcessing(String examClassCode) {
        try {
            ProcessBuilder processBuilder = new ProcessBuilder();
            processBuilder.redirectErrorStream(true);
            String[] commands;
            String sharedAppAISrc;
            if (SystemConstants.IS_WINDOWS) {
                sharedAppAISrc = SystemConstants.WINDOWS_SHARED_DIR + "/source/elearning-support-system/be_python";
                commands = new String[]{"cmd.exe", "/c", String.format("python main.py %s", examClassCode)};
            } else {
                sharedAppAISrc = SystemConstants.LINUX_SHARED_DIR + "/source/elearning-support-system/be_python";
                commands = new String[]{"sh", "-c", String.format("python main.py %s", examClassCode)};
            }
            processBuilder.command(commands);
            // point directory to python src (create and clone before using)
            processBuilder.directory(new File(sharedAppAISrc));
            Process aiProcess = processBuilder.start();
            aiProcess.supportsNormalTermination();
            BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(aiProcess.getInputStream()));
            long currentTimeMillis = System.currentTimeMillis();
            log.info("========== AI PROCESS STARTED ========");
            String logLine;
            while ((logLine = bufferedReader.readLine()) != null) {
                System.out.println(logLine);
            }
            log.info("========= AI PROCESS ENDED AFTER : {} ms ==========", System.currentTimeMillis() - currentTimeMillis);
        } catch (Exception exception) {
            log.error(MessageConst.EXCEPTION_LOG_FORMAT, exception.getMessage(), exception.getCause());
        }
    }
}
