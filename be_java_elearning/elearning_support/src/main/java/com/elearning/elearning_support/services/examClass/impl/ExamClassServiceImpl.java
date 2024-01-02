package com.elearning.elearning_support.services.examClass.impl;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;
import org.apache.commons.math3.util.Pair;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.ObjectUtils;
import com.elearning.elearning_support.constants.message.errorKey.ErrorKey;
import com.elearning.elearning_support.constants.message.messageConst.MessageConst;
import com.elearning.elearning_support.constants.message.messageConst.MessageConst.Resources;
import com.elearning.elearning_support.dtos.CustomInputStreamResource;
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
import com.elearning.elearning_support.services.examClass.ExamClassService;
import com.elearning.elearning_support.services.test.TestService;
import com.elearning.elearning_support.utils.auth.AuthUtils;
import com.elearning.elearning_support.utils.excelFile.ExcelFileUtils;
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

    private final ExcelFileUtils excelFileUtils;

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

        // Tạo exam_class
        ExamClass newExamClass = new ExamClass();
        BeanUtils.copyProperties(createDTO, newExamClass);
        newExamClass.setTestId(test.getId());
        newExamClass.setSubjectId(test.getSubjectId());
        newExamClass.setSemesterId(test.getSemesterId());
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

        // delete current user-exam class
        userExamClassRepository.deleteAllByExamClassId(id);
        List<UserExamClass> lstUserExamClass = new ArrayList<>();
        updateDTO.getLstStudentId().forEach(item -> lstUserExamClass.add(new UserExamClass(item, id, UserExamClassRoleEnum.STUDENT.getType())));
        updateDTO.getLstSupervisorId().forEach(item -> lstUserExamClass.add(new UserExamClass(item, id, UserExamClassRoleEnum.STUDENT.getType())));
        userExamClassRepository.saveAll(lstUserExamClass);
    }

    @Override
    public Page<ICommonExamClassDTO> getPageExamClass(String code, Long semesterId, Long subjectId, Long testId, Pageable pageable) {
        return examClassRepository.getPageExamClass(code, semesterId, subjectId, testId, pageable);
    }

    @Override
    public CustomInputStreamResource exportListExamClass(Long semesterId, Long testId) throws IOException {
        List<ICommonExamClassDTO> lstExamClass = examClassRepository.getListExamClass("", semesterId, -1L, testId);
        String fileName = String.format("ExamClass_%s.xlsx", LocalDateTime.now());
        String sheetName = "exam_class";
        if (!ObjectUtils.isEmpty(lstExamClass)) {
            fileName = String.format("ExamClass_%s_%s_%s.xlsx", lstExamClass.get(0).getSemester(), lstExamClass.get(0).getTestName(),
                LocalDateTime.now());
            sheetName = fileName;
        }
        Map<Integer, Pair<String, String>> structure = new LinkedHashMap<>();
        structure.put(1, Pair.create("Mã lớp thi", "getCode"));
        structure.put(2, Pair.create("Kỳ thi", "getTestName"));
        structure.put(3, Pair.create("Phòng thi", "getRoomName"));
        structure.put(4, Pair.create("Kỳ học", "getSemester"));
        structure.put(5, Pair.create("Môn thi", "getSubjectTitle"));
        structure.put(6, Pair.create("Ngày thi", "getExamineDate"));
        structure.put(7, Pair.create("Thời gian thi", "getExamineTime"));
        structure.put(8, Pair.create("Số lượng thí sinh", "getNumberOfStudents"));
        return new CustomInputStreamResource(fileName, excelFileUtils.createWorkbook(lstExamClass, structure, sheetName));
    }

    @Override
    public IExamClassDetailDTO getExamClassDetail(Long id) {
        IExamClassDetailDTO examClassDetails = examClassRepository.getDetailExamClass(id);
        if (Objects.isNull(examClassDetails)) {
            throw exceptionFactory.resourceNotFoundException(MessageConst.ExamClass.NOT_FOUND, Resources.EXAM_CLASS,
                MessageConst.RESOURCE_NOT_FOUND, ErrorKey.ExamClass.ID, String.valueOf(id));
        }
        return examClassDetails;
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

    @Override
    public CustomInputStreamResource exportExamClassParticipant(Long examClassId, UserExamClassRoleEnum roleType) throws IOException {
        List<IExamClassParticipantDTO> participants = examClassRepository.getListExamClassParticipant(examClassId, roleType.getType());
        // Create export structure
        String sheetName = ObjectUtils.isEmpty(participants) ? "result" : participants.get(0).getExamClassCode();
        Map<Integer, Pair<String, String>> structure = new LinkedHashMap<>();
        structure.put(1, Pair.create("Họ tên", "getName"));
        structure.put(2, Pair.create("Mã", "getCode"));
        structure.put(3, Pair.create("Vai trò trong lớp thi", "getRoleName"));
        structure.put(4, Pair.create("Mã lớp thi", "getExamClassCode"));
        String exportObject = roleType == UserExamClassRoleEnum.STUDENT ? "student" : "supervisor";
        String fileName = String.format("ExamClass_%s_%s.xlsx", exportObject, LocalDateTime.now());
        return new CustomInputStreamResource(fileName, excelFileUtils.createWorkbook(participants, structure, sheetName));
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
