package com.elearning.elearning_support.services.test.impl;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import com.elearning.elearning_support.constants.message.errorKey.ErrorKey;
import com.elearning.elearning_support.constants.message.messageConst.MessageConst;
import com.elearning.elearning_support.constants.message.messageConst.MessageConst.Resources;
import com.elearning.elearning_support.dtos.examClass.IExamClassParticipantDTO;
import com.elearning.elearning_support.dtos.test.studentTestSet.StudentTestSetResultDTO;
import com.elearning.elearning_support.entities.exam_class.ExamClass;
import com.elearning.elearning_support.enums.examClass.UserExamClassRoleEnum;
import com.elearning.elearning_support.exceptions.exceptionFactory.ExceptionFactory;
import com.elearning.elearning_support.repositories.examClass.ExamClassRepository;
import com.elearning.elearning_support.repositories.test.test_set.StudentTestSetRepository;
import com.elearning.elearning_support.repositories.test.test_set.TestSetRepository;
import com.elearning.elearning_support.services.test.StudentTestSetService;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class StudentTestSetServiceImpl implements StudentTestSetService {

    private final StudentTestSetRepository studentTestSetRepository;

    private final ExamClassRepository examClassRepository;

    private final ExceptionFactory exceptionFactory;

    private final TestSetRepository testSetRepository;

    @Override
    public List<StudentTestSetResultDTO> getListStudentTestSetResult(String examClassCode) {
        // Check examClass exists
        ExamClass examClass = examClassRepository.findByCodeAndIsEnabled(examClassCode, Boolean.TRUE).orElseThrow(
            () -> exceptionFactory.resourceNotFoundException(MessageConst.ExamClass.NOT_FOUND, MessageConst.RESOURCE_NOT_FOUND,
                Resources.EXAM_CLASS,
                ErrorKey.ExamClass.CODE, examClassCode));

        // exam_class studentId
        Set<Long> studentIdsInExClass = examClassRepository.getListExamClassParticipant(examClass.getId(),
            UserExamClassRoleEnum.STUDENT.getType()).stream().map(
            IExamClassParticipantDTO::getId).collect(Collectors.toSet());
        // test_set ids used
        Set<Long> testSetIdsInTest = testSetRepository.getListTestSetIdByTestId(examClass.getTestId());

        // Get student test results
        return studentTestSetRepository.getStudentTestSetResult(studentIdsInExClass, testSetIdsInTest).stream()
            .map(item -> new StudentTestSetResultDTO(item, examClass.getId(), examClass.getCode())).collect(
                Collectors.toList());
    }
}
