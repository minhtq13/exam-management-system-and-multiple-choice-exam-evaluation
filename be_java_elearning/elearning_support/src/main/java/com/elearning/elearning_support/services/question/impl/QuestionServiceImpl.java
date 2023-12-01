package com.elearning.elearning_support.services.question.impl;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Random;
import java.util.Set;
import java.util.stream.Collectors;
import org.apache.commons.beanutils.BeanUtils;
import org.apache.commons.math3.util.Pair;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.ObjectUtils;
import org.springframework.web.multipart.MultipartFile;
import com.elearning.elearning_support.constants.FileConstants.Extension.Excel;
import com.elearning.elearning_support.constants.message.errorKey.ErrorKey;
import com.elearning.elearning_support.constants.message.messageConst.MessageConst;
import com.elearning.elearning_support.constants.message.messageConst.MessageConst.FileAttach;
import com.elearning.elearning_support.constants.message.messageConst.MessageConst.Resources;
import com.elearning.elearning_support.dtos.answer.AnswerReqDTO;
import com.elearning.elearning_support.dtos.chapter.ISubjectChapterDTO;
import com.elearning.elearning_support.dtos.common.ICommonIdCode;
import com.elearning.elearning_support.dtos.fileAttach.importFile.ImportResponseDTO;
import com.elearning.elearning_support.dtos.fileAttach.importFile.RowErrorDTO;
import com.elearning.elearning_support.dtos.question.IQuestionDetailsDTO;
import com.elearning.elearning_support.dtos.question.QuestionDetailsDTO;
import com.elearning.elearning_support.dtos.question.QuestionListCreateDTO;
import com.elearning.elearning_support.dtos.question.QuestionListDTO;
import com.elearning.elearning_support.dtos.question.QuestionUpdateDTO;
import com.elearning.elearning_support.dtos.question.importQuestion.ImportQuestionValidatorDTO;
import com.elearning.elearning_support.dtos.question.importQuestion.QuestionImportDTO;
import com.elearning.elearning_support.entities.answer.Answer;
import com.elearning.elearning_support.entities.question.Question;
import com.elearning.elearning_support.enums.importFile.ImportResponseEnum;
import com.elearning.elearning_support.enums.importFile.QuestionImportFieldMapping;
import com.elearning.elearning_support.enums.question.QuestionLevelEnum;
import com.elearning.elearning_support.exceptions.exceptionFactory.ExceptionFactory;
import com.elearning.elearning_support.repositories.answer.AnswerRepository;
import com.elearning.elearning_support.repositories.chapter.ChapterRepository;
import com.elearning.elearning_support.repositories.question.QuestionRepository;
import com.elearning.elearning_support.repositories.subject.SubjectRepository;
import com.elearning.elearning_support.services.question.QuestionService;
import com.elearning.elearning_support.utils.StringUtils;
import com.elearning.elearning_support.utils.auth.AuthUtils;
import com.elearning.elearning_support.utils.excelFile.ExcelFileUtils;
import com.elearning.elearning_support.utils.file.FileUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class QuestionServiceImpl implements QuestionService {

    private final QuestionRepository questionRepository;

    private final AnswerRepository answerRepository;

    private final ExceptionFactory exceptionFactory;

    private final SubjectRepository subjectRepository;

    private final ChapterRepository chapterRepository;

    @Transactional
    @Override
    public void createListQuestion(QuestionListCreateDTO createDTO) {
        // Tạo các list để lưu question
        List<Question> lstQuestion = new ArrayList<>();
        createDTO.getLstQuestion().forEach(questionDTO -> {
            Question question = Question.builder()
                .imageIds(questionDTO.getLstImageId())
                .level(questionDTO.getLevel().getLevel())
                .chapterId(createDTO.getChapterId())
                .content(questionDTO.getContent())
                .code(generateQuestionCode())
                .isEnabled(Boolean.TRUE)
                .build();
            question.setCreatedAt(new Date());
            question.setCreatedBy(AuthUtils.getCurrentUserId());
            // Save question
            lstQuestion.add(question);
            // Tạo các answer của question
            question.setLstAnswer(questionDTO.getLstAnswer().stream().map(Answer::new).collect(Collectors.toList()));
        });
        // save question
        questionRepository.saveAll(lstQuestion);
    }

    @Transactional
    @Override
    public void updateQuestion(Long questionId, QuestionUpdateDTO updateDTO) {
        Question question = questionRepository.findById(questionId).orElseThrow(
            () -> exceptionFactory.resourceExistedException(MessageConst.Question.NOT_FOUND, Resources.QUESTION, MessageConst.RESOURCE_NOT_FOUND,
                ErrorKey.Question.ID, String.valueOf(questionId)));
        // Set thông tin cập nhất question
        question.setContent(updateDTO.getContent());
        question.setLevel(updateDTO.getLevel().getLevel());
        question.setModifiedAt(new Date());
        question.setModifiedBy(AuthUtils.getCurrentUserId());
        // update images
        if (Objects.nonNull(updateDTO.getLstImageId())) {
            question.setImageIds(updateDTO.getLstImageId());
        }

        //xoá tất cả các answer của question hiện tại
        answerRepository.deleteAllByQuestionId(questionId);
        // Lưu list answer mới
        List<Answer> lstUpdatedAnswer = updateDTO.getLstAnswer().stream().map(Answer::new).collect(Collectors.toList());
        question.setLstAnswer(lstUpdatedAnswer);
        questionRepository.save(question);
    }

    @Override
    public List<QuestionListDTO> getListQuestion(Long subjectId, String subjectCode, Set<Long> chapterIds, String chapterCode,
        QuestionLevelEnum level) {
        return questionRepository.getListQuestion(subjectId, subjectCode, chapterIds, chapterCode, level.getLevel()).stream()
            .map(QuestionListDTO::new).collect(
                Collectors.toList());
    }

    @Override
    public ImportResponseDTO importQuestion(MultipartFile fileImport) {
        Long currentUserId = AuthUtils.getCurrentUserId();
        // Tạo response mặc định
        ImportResponseDTO response = new ImportResponseDTO();
        response.setStatus(ImportResponseEnum.SUCCESS.getStatus());
        response.setMessage(ImportResponseEnum.SUCCESS.getMessage());

        // Đọc file và import dữ liệu
        try {
            // Validate file sơ bộ
            FileUtils.validateUploadFile(fileImport, Arrays.asList(Excel.XLS, Excel.XLSX));

            // Tạo workbook để đọc file import
            XSSFWorkbook inputWorkbook = new XSSFWorkbook(fileImport.getInputStream());
            XSSFSheet inputSheet = inputWorkbook.getSheetAt(0);
            if (Objects.isNull(inputSheet)) {
                throw exceptionFactory.fileUploadException(FileAttach.FILE_EXCEL_EMPTY_SHEET_ERROR, Resources.FILE_ATTACHED,
                    MessageConst.UPLOAD_FAILED);
            }

            // Map info validators
            Map<String, Long> mapSubjectCodeId = subjectRepository.getAllSubjectIdCode().stream()
                .collect(Collectors.toMap(ICommonIdCode::getCode, ICommonIdCode::getId));
            Map<Pair<Long, Integer>, Long> mapSubjectChapters = new HashMap<>();
            List<ISubjectChapterDTO> lstSubjectChapterMappings = chapterRepository.getAllSubjectChapterMappings();
            lstSubjectChapterMappings.forEach(
                mapping -> mapSubjectChapters.put(Pair.create(mapping.getSubjectId(), mapping.getChapterNo()), mapping.getChapterId()));
            ImportQuestionValidatorDTO validatorDTO = new ImportQuestionValidatorDTO(mapSubjectCodeId, mapSubjectChapters);

            // Tạo các map field
            Map<Integer, String> mapIndexColumnKey = new HashMap<>();
            // questions save to db
            List<Question> lstQuestions = new ArrayList<>();

            // Duyệt file input
            Iterator<Row> rowIterator = inputSheet.rowIterator();
            int numberOfColumns = QuestionImportFieldMapping.values().length;
            while (rowIterator.hasNext()) {
                Row currentRow = rowIterator.next();
                boolean isEmptyRow = true;
                if (currentRow.getRowNum() == 0) { // header row
                    for (Cell cell : currentRow) {
                        mapIndexColumnKey.put(cell.getColumnIndex(), ExcelFileUtils.getStringCellValue(cell));
                    }
                    // Validate thừa thiếu/cột
                    if (currentRow.getLastCellNum() < numberOfColumns) {
                        throw exceptionFactory.fileUploadException(FileAttach.FILE_EXCEL_MISSING_COLUMN_NUMBER_ERROR, Resources.FILE_ATTACHED,
                            MessageConst.UPLOAD_FAILED);
                    }
                    if (currentRow.getLastCellNum() > numberOfColumns) {
                        throw exceptionFactory.fileUploadException(FileAttach.FILE_EXCEL_MISSING_COLUMN_NUMBER_ERROR, Resources.FILE_ATTACHED,
                            MessageConst.UPLOAD_FAILED);
                    }
                    continue;
                }
                // Duyệt các cell trong row
                QuestionImportDTO importDTO = new QuestionImportDTO();
                for (Cell cell : currentRow) {
                    String columnKey = mapIndexColumnKey.get(cell.getColumnIndex());
                    String objectFieldKey = QuestionImportFieldMapping.getObjectFieldByColumnKey(columnKey);
                    String cellValue = ExcelFileUtils.getStringCellValue(cell);
                    if (!ObjectUtils.isEmpty(cellValue)) {
                        isEmptyRow = false;
                    }
                    if (!ObjectUtils.isEmpty(objectFieldKey)) {
                        BeanUtils.setProperty(importDTO, objectFieldKey, cellValue);
                    }
                }
                // Validate và mapping vào entity
                List<String> causeList = new ArrayList<>();
                validateImportQuestion(importDTO, validatorDTO, causeList);
                if (!isEmptyRow) {
                    if (ObjectUtils.isEmpty(causeList)) {
                        // create new question
                        Question newQuestion = new Question();
                        newQuestion.setContent(importDTO.getContent());
                        Long subjectId = mapSubjectCodeId.get(importDTO.getSubjectCode());
                        Long chapterId = mapSubjectChapters.get(Pair.create(subjectId, importDTO.getChapterNo()));
                        newQuestion.setChapterId(chapterId);
                        newQuestion.setCode(generateQuestionCode());
                        newQuestion.setLevel(QuestionLevelEnum.getQuestionLevelByName(importDTO.getLevelRaw()).getLevel());
                        newQuestion.setCreatedBy(currentUserId);
                        newQuestion.setCreatedAt(new Date());
                        // create new answers (default has 4 answers/question)
                        List<Answer> lstAnswer = new ArrayList<>();
                        Set<Integer> correctAnswerNo = StringUtils.convertStrIntegerToSet(String.format("{%s}", importDTO.getCorrectAnswers()));
                        // Set answers
                        lstAnswer.add(new Answer(new AnswerReqDTO(importDTO.getFirstAnswer(), correctAnswerNo.contains(1), null)));
                        lstAnswer.add(new Answer(new AnswerReqDTO(importDTO.getSecondAnswer(), correctAnswerNo.contains(2), null)));
                        lstAnswer.add(new Answer(new AnswerReqDTO(importDTO.getThirdAnswer(), correctAnswerNo.contains(3), null)));
                        lstAnswer.add(new Answer(new AnswerReqDTO(importDTO.getFourthAnswer(), correctAnswerNo.contains(4), null)));
                        newQuestion.setLstAnswer(lstAnswer);
                        // Add question to list
                        lstQuestions.add(newQuestion);
                    } else {
                        response.getErrorRows().add(new RowErrorDTO(currentRow.getRowNum() + 1, importDTO, causeList));
                        response.setMessage(ImportResponseEnum.EXIST_INVALID_DATA.getMessage());
                        response.setStatus(ImportResponseEnum.EXIST_INVALID_DATA.getStatus());
                    }
                }
            }
            questionRepository.saveAll(lstQuestions);
            // save list entity
            inputWorkbook.close();
            // Set status and message response
            return response;
        } catch (IOException ioException) {
            response.setMessage(ImportResponseEnum.IO_ERROR.getMessage());
            response.setStatus(ImportResponseEnum.IO_ERROR.getStatus());
        } catch (Exception exception) {
            exception.printStackTrace();
            response.setMessage(ImportResponseEnum.UNKNOWN_ERROR.getMessage());
            response.setStatus(ImportResponseEnum.UNKNOWN_ERROR.getStatus());
            log.error(MessageConst.EXCEPTION_LOG_FORMAT, exception.getMessage(), exception.getCause());
        }
        return null;
    }

    /**
     * Validate question import
     */
    private void validateImportQuestion(QuestionImportDTO importDTO, ImportQuestionValidatorDTO validatorDTO, List<String> causeList) {
        // Validate level
        if (Objects.isNull(QuestionLevelEnum.getQuestionLevelByName(importDTO.getLevelRaw()))) {
            causeList.add("Invalid question level");
        }
        // Validate subjectCode
        String notFoundMessage = "Not found ";
        List<String> errorFields = new ArrayList<>();
        if (Objects.isNull(validatorDTO.getMapSubjectCodeId().get(importDTO.getSubjectCode()))) {
            errorFields.add("subjectCode");
        } else {
            Long subjectId = validatorDTO.getMapSubjectCodeId().get(importDTO.getSubjectCode());
            if (!validatorDTO.getMapSubjectChapters().containsKey(Pair.create(subjectId, Integer.valueOf(importDTO.getChapterNo())))) {
                errorFields.add("chapterNo");
            }
        }
        if (!errorFields.isEmpty()) {
            causeList.add(notFoundMessage + String.join(",", errorFields));
        }

        // Validate correct answers
        try {
            // Validate correct answer
            if (ObjectUtils.isEmpty(importDTO.getCorrectAnswers())) {
                causeList.add("Missing correctAnswers");
            }
        } catch (NumberFormatException exception) {
            causeList.add("Invalid correctAnswers");
        }
    }

    @Override
    public QuestionDetailsDTO getQuestionDetails(Long questionId) {
        IQuestionDetailsDTO questionDetails = questionRepository.getQuestionDetails(questionId);
        if (Objects.isNull(questionDetails)) {
            throw exceptionFactory.resourceExistedException(MessageConst.Question.NOT_FOUND, Resources.QUESTION, MessageConst.RESOURCE_NOT_FOUND,
                ErrorKey.Question.ID, String.valueOf(questionId));
        }
        return new QuestionDetailsDTO(questionDetails);
    }

    /**
     * Generate question code
     */
    private String generateQuestionCode() {
        String baseCode = "Q";
        Random random = new Random();
        String generatedCode = baseCode + (random.nextInt(900000) + 100000);
        while (questionRepository.existsByCode(generatedCode)) {
            generatedCode = baseCode + (random.nextInt(900000) + 100000);
        }
        return generatedCode;
    }
}
