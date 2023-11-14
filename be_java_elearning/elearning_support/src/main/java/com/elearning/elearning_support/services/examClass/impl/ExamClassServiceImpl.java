package com.elearning.elearning_support.services.examClass.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Objects;
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
import com.elearning.elearning_support.dtos.examClass.ExamClassCreateDTO;
import com.elearning.elearning_support.dtos.examClass.ExamClassSaveReqDTO;
import com.elearning.elearning_support.dtos.examClass.ICommonExamClassDTO;
import com.elearning.elearning_support.dtos.examClass.IExamClassDetailDTO;
import com.elearning.elearning_support.dtos.examClass.IExamClassParticipantDTO;
import com.elearning.elearning_support.dtos.examClass.UserExamClassDTO;
import com.elearning.elearning_support.entities.exam_class.ExamClass;
import com.elearning.elearning_support.entities.exam_class.UserExamClass;
import com.elearning.elearning_support.entities.test.Test;
import com.elearning.elearning_support.enums.examClass.UserExamClassRoleEnum;
import com.elearning.elearning_support.exceptions.exceptionFactory.ExceptionFactory;
import com.elearning.elearning_support.repositories.examClass.ExamClassRepository;
import com.elearning.elearning_support.repositories.examClass.UserExamClassRepository;
import com.elearning.elearning_support.repositories.test.TestRepository;
import com.elearning.elearning_support.services.examClass.ExamClassService;
import com.elearning.elearning_support.services.test.TestService;
import com.elearning.elearning_support.utils.auth.AuthUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class ExamClassServiceImpl implements ExamClassService {

    private final ExamClassRepository examClassRepository;

    private final ExceptionFactory exceptionFactory;

    private final UserExamClassRepository userExamClassRepository;

    private final TestService testService;

    @Transactional
    @Override
    public Long createExamClass(ExamClassCreateDTO createDTO) {
        // Check exam_class code existed
        if (examClassRepository.existsByCode(createDTO.getCode())) {
            throw exceptionFactory.resourceExistedException(MessageConst.ExamClass.EXISTED_BY_CODE, Resources.EXAM_CLASS,
                MessageConst.RESOURCE_EXISTED,
                ErrorKey.ExamClass.CODE, createDTO.getCode());
        }
        Test test = testService.findTestById(createDTO.getTestId());

        // Tạo examclass
        ExamClass newExamClass = new ExamClass();
        BeanUtils.copyProperties(createDTO, newExamClass);
        newExamClass.setTestId(test.getId());
        newExamClass.setCreatedBy(AuthUtils.getCurrentUserId());
        newExamClass.setCreatedAt(new Date());
        newExamClass.setIsEnabled(Boolean.TRUE);
        newExamClass = examClassRepository.save(newExamClass);

        // save exam_class participants
        List<UserExamClass> lstParticipant = new ArrayList<>();
        final Long examClassId = newExamClass.getId();
        // Add students
        if (!ObjectUtils.isEmpty(createDTO.getLstStudentId())) {
            createDTO.getLstStudentId()
                .forEach(studentId -> lstParticipant.add(new UserExamClass(studentId, examClassId, UserExamClassRoleEnum.STUDENT.getType())));
        }
        // Add supervisors
        if (!ObjectUtils.isEmpty(createDTO.getLstSupervisorId())) {
            createDTO.getLstSupervisorId().forEach(
                supervisorId -> lstParticipant.add(new UserExamClass(supervisorId, examClassId, UserExamClassRoleEnum.SUPERVISOR.getType())));
        }
        userExamClassRepository.saveAll(lstParticipant);

        return newExamClass.getId();
    }

    @Transactional
    @Override
    public void updateExamClass(Long id, ExamClassSaveReqDTO updateDTO) {
        // Get exam class and test
        ExamClass examClass = findExamClassById(id);
        if (!Objects.equals(examClass.getTestId(), updateDTO.getTestId())) {
            testService.checkExistedById(updateDTO.getTestId());
        }
        // Update exam class
        BeanUtils.copyProperties(updateDTO, examClass);
        examClass.setModifiedAt(new Date());
        examClass.setModifiedBy(AuthUtils.getCurrentUserId());
        examClassRepository.save(examClass);
    }

    @Override
    public Page<ICommonExamClassDTO> getPageExamClass(String code, Long semesterId, Long subjectId, Long testId, Pageable pageable) {
        return examClassRepository.getPageExamClass(code, semesterId, subjectId, testId, pageable);
    }

    @Override
    public IExamClassDetailDTO getExamClassDetail(Long id) {
        return examClassRepository.getDetailExamClass(id);
    }

    @Transactional
    @Override
    public void updateParticipantToExamClass(UserExamClassDTO userExamClassDTO) {
        // delete all -> add new
        userExamClassRepository.deleteAllByExamClassId(userExamClassDTO.getExamClassId());
        List<UserExamClass> lstNewParticipant =
            userExamClassDTO.getLstParticipant().stream()
                .map(item -> new UserExamClass(item.getUserId(), userExamClassDTO.getExamClassId(), item.getRole().getType())).collect(Collectors.toList());
        userExamClassRepository.saveAll(lstNewParticipant);
    }

    @Override
    public List<IExamClassParticipantDTO> getListExamClassParticipant(Long examClassId, UserExamClassRoleEnum roleType) {
        return examClassRepository.getListExamClassParticipant(examClassId, roleType.getType());
    }

    /**
     * Find by id and enabled
     */
    private ExamClass findExamClassById(Long id) {
        return examClassRepository.findByIdAndIsEnabled(id, Boolean.TRUE)
            .orElseThrow(() -> exceptionFactory.resourceNotFoundException(MessageConst.ExamClass.NOT_FOUND, Resources.EXAM_CLASS,
                MessageConst.RESOURCE_NOT_FOUND, ErrorKey.ExamClass.ID, String.valueOf(id)));
    }
}
