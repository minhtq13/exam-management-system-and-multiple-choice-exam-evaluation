package com.elearning.elearning_support.services.test.impl;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;
import org.apache.commons.math3.util.Pair;
import org.springframework.stereotype.Service;
import com.elearning.elearning_support.constants.message.errorKey.ErrorKey;
import com.elearning.elearning_support.constants.message.messageConst.MessageConst;
import com.elearning.elearning_support.constants.message.messageConst.MessageConst.Resources;
import com.elearning.elearning_support.dtos.CustomInputStreamResource;
import com.elearning.elearning_support.dtos.examClass.IExamClassParticipantDTO;
import com.elearning.elearning_support.dtos.test.studentTestSet.IStudentTestSetResultDTO;
import com.elearning.elearning_support.dtos.test.studentTestSet.StudentTestSetResultDTO;
import com.elearning.elearning_support.entities.exam_class.ExamClass;
import com.elearning.elearning_support.enums.examClass.UserExamClassRoleEnum;
import com.elearning.elearning_support.exceptions.exceptionFactory.ExceptionFactory;
import com.elearning.elearning_support.repositories.examClass.ExamClassRepository;
import com.elearning.elearning_support.repositories.test.test_set.StudentTestSetRepository;
import com.elearning.elearning_support.repositories.test.test_set.TestSetRepository;
import com.elearning.elearning_support.services.test.StudentTestSetService;
import com.elearning.elearning_support.utils.excelFile.ExcelFileUtils;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class StudentTestSetServiceImpl implements StudentTestSetService {

    private final StudentTestSetRepository studentTestSetRepository;

    private final ExamClassRepository examClassRepository;

    private final ExceptionFactory exceptionFactory;

    private final TestSetRepository testSetRepository;

    private final ExcelFileUtils excelFileUtils;

    @Override
    public List<StudentTestSetResultDTO> getListStudentTestSetResult(String examClassCode) {
        // Check examClass exists
        ExamClass examClass = examClassRepository.findByCodeAndIsEnabled(examClassCode, Boolean.TRUE).orElseThrow(
            () -> exceptionFactory.resourceNotFoundException(MessageConst.ExamClass.NOT_FOUND, MessageConst.RESOURCE_NOT_FOUND,
                Resources.EXAM_CLASS,
                ErrorKey.ExamClass.CODE, examClassCode));

        // exam_class studentId
        List<IExamClassParticipantDTO> examClassParticipants = examClassRepository.getListExamClassParticipant(examClass.getId(),
            UserExamClassRoleEnum.STUDENT.getType());
        Set<Long> studentIdsInExClass = examClassParticipants.stream().map(IExamClassParticipantDTO::getId).collect(Collectors.toSet());
        // test_set ids used
        Set<Long> testSetIdsInTest = testSetRepository.getListTestSetIdByTestId(examClass.getTestId());

        // Get student test results
        return studentTestSetRepository.getStudentTestSetResult(studentIdsInExClass, testSetIdsInTest).stream()
            .map(item -> new StudentTestSetResultDTO(item, examClass.getId(), examClass.getCode())).collect(
                Collectors.toList());
    }

    @Override
    public CustomInputStreamResource exportStudentTestSetResult(String examClassCode) throws IOException {
        String fileName = String.format("ExamResult_%s_%s.xlsx", examClassCode, LocalDateTime.now());
        ExamClass examClass = examClassRepository.findByCodeAndIsEnabled(examClassCode, Boolean.TRUE).orElseThrow(
            () -> exceptionFactory.resourceNotFoundException(MessageConst.ExamClass.NOT_FOUND, MessageConst.RESOURCE_NOT_FOUND,
                Resources.EXAM_CLASS, ErrorKey.ExamClass.CODE, examClassCode));

        // exam_class studentId
        List<IExamClassParticipantDTO> examClassParticipants = examClassRepository.getListExamClassParticipant(examClass.getId(),
            UserExamClassRoleEnum.STUDENT.getType());
        Set<Long> studentIdsInExClass = examClassParticipants.stream().map(IExamClassParticipantDTO::getId).collect(Collectors.toSet());
        // test_set ids used
        Set<Long> testSetIdsInTest = testSetRepository.getListTestSetIdByTestId(examClass.getTestId());

        // Get map student test results
        Map<Long, IStudentTestSetResultDTO> mapResult = new LinkedHashMap<>();
        List<IStudentTestSetResultDTO> lstHandledResults = studentTestSetRepository.getStudentTestSetResult(studentIdsInExClass,
            testSetIdsInTest);
        lstHandledResults.forEach(item -> mapResult.put(item.getStudentId(), item));
        // add to result
        List<StudentTestSetResultDTO> results = examClassParticipants.stream().map(participant -> {
            IStudentTestSetResultDTO studentResult = mapResult.get(participant.getId());
            if (Objects.nonNull(studentResult)) {
                return new StudentTestSetResultDTO(studentResult, examClass.getId(), examClass.getCode());
            } else {
                return new StudentTestSetResultDTO(participant.getId(), participant.getName(), participant.getCode());
            }
        }).collect(Collectors.toList());

        // map structure
        Map<Integer, Pair<String, String>> mapStructure = new LinkedHashMap<>();
        mapStructure.put(1, Pair.create("Tên thí sinh", "getStudentName"));
        mapStructure.put(2, Pair.create("MSSV", "getStudentCode"));
        mapStructure.put(3, Pair.create("Mã lớp thi", "getExamClassCode"));
        mapStructure.put(4, Pair.create("Mã đề thi", "getTestSetCode"));
        mapStructure.put(5, Pair.create("Số câu trong đề", "getNumTestSetQuestions"));
        mapStructure.put(6, Pair.create("Số câu đúng", "getNumCorrectAnswers"));
        mapStructure.put(7, Pair.create("Tổng điểm", "getTotalPoints"));
        return new CustomInputStreamResource(fileName, excelFileUtils.createWorkbook(results, mapStructure, examClassCode));
    }
}
