package com.elearning.elearning_support.services.test.impl;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
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
import com.elearning.elearning_support.dtos.common.CommonNameValueDTO;
import com.elearning.elearning_support.dtos.examClass.IExamClassParticipantDTO;
import com.elearning.elearning_support.dtos.test.studentTestSet.ExamClassResultStatisticsDTO;
import com.elearning.elearning_support.dtos.test.studentTestSet.IStudentTestSetResultDTO;
import com.elearning.elearning_support.dtos.test.studentTestSet.StudentTestSetResultDTO;
import com.elearning.elearning_support.entities.exam_class.ExamClass;
import com.elearning.elearning_support.enums.examClass.UserExamClassRoleEnum;
import com.elearning.elearning_support.exceptions.exceptionFactory.ExceptionFactory;
import com.elearning.elearning_support.repositories.examClass.ExamClassRepository;
import com.elearning.elearning_support.repositories.test.test_set.StudentTestSetRepository;
import com.elearning.elearning_support.repositories.test.test_set.TestSetRepository;
import com.elearning.elearning_support.services.test.StudentTestSetService;
import com.elearning.elearning_support.utils.CollectionUtils;
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
    public ExamClassResultStatisticsDTO getListStudentTestSetResult(String examClassCode) {
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
        List<StudentTestSetResultDTO> results = studentTestSetRepository.getStudentTestSetResult(studentIdsInExClass, testSetIdsInTest).stream()
            .map(item -> new StudentTestSetResultDTO(item, examClass.getId(), examClass.getCode())).collect(
                Collectors.toList());
        List<Double> studentResultPoints = results.stream().map(StudentTestSetResultDTO::getTotalPoints).sorted(Comparator.comparing(Double::doubleValue)).collect(
            Collectors.toList());

        // calculate pie chart
        List<Double> rangePoints = Arrays.asList(0.0, 3.0, 4.0, 5.5, 6.5, 7.0, 8.0, 8.5, 9.5, 10.0); // fixed
        List<CommonNameValueDTO> pieChart = new ArrayList<>();
        for (int idx = 0; idx < rangePoints.size() - 1; idx++) {
            final int currentIdx = idx;
            Long value = studentResultPoints.stream().filter(stdPoint -> {
                double roundedPoint = Math.round(stdPoint * 2) / 2.0;
                return roundedPoint >= rangePoints.get(currentIdx) && (
                    roundedPoint < rangePoints.get(currentIdx + 1) || (currentIdx + 1 == rangePoints.size() - 1));
            }).count();
            pieChart.add(
                new CommonNameValueDTO(String.format("%.1f - %.1f", rangePoints.get(currentIdx), rangePoints.get(currentIdx + 1)), value));
        }

        // calculate column chart
        double pointStep = 0.5;
        List<Double> gradePoints = CollectionUtils.generateDoubleSequenceWithStep(0.0, 10.0, pointStep);
        List<CommonNameValueDTO> columChart = new ArrayList<>();
        gradePoints.forEach(point -> {
            Long value = studentResultPoints.stream().filter(stdPoint -> Math.round(stdPoint * 2) / 2.0 == point).count();
            columChart.add(new CommonNameValueDTO(String.format("%.1f", point), value));
        });

        return new ExamClassResultStatisticsDTO(results, pieChart, columChart);
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
