package com.elearning.elearning_support.services.examClass.impl;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;
import org.apache.commons.math3.util.Pair;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.ObjectUtils;
import org.springframework.web.multipart.MultipartFile;
import com.elearning.elearning_support.constants.FileConstants.Extension.Excel;
import com.elearning.elearning_support.constants.RoleConstants;
import com.elearning.elearning_support.constants.message.errorKey.ErrorKey;
import com.elearning.elearning_support.constants.message.messageConst.MessageConst;
import com.elearning.elearning_support.constants.message.messageConst.MessageConst.FileAttach;
import com.elearning.elearning_support.constants.message.messageConst.MessageConst.Resources;
import com.elearning.elearning_support.dtos.CustomInputStreamResource;
import com.elearning.elearning_support.dtos.examClass.ExamClassCreateDTO;
import com.elearning.elearning_support.dtos.examClass.ExamClassSaveReqDTO;
import com.elearning.elearning_support.dtos.examClass.ICommonExamClassDTO;
import com.elearning.elearning_support.dtos.examClass.IExamClassDetailDTO;
import com.elearning.elearning_support.dtos.examClass.IExamClassParticipantDTO;
import com.elearning.elearning_support.dtos.examClass.UserExamClassDTO;
import com.elearning.elearning_support.dtos.fileAttach.importFile.ImportResponseDTO;
import com.elearning.elearning_support.dtos.fileAttach.importFile.RowErrorDTO;
import com.elearning.elearning_support.dtos.users.ImportUserValidatorDTO;
import com.elearning.elearning_support.dtos.users.importUser.ValidatedImportUserDTO;
import com.elearning.elearning_support.dtos.users.student.StudentImportDTO;
import com.elearning.elearning_support.entities.exam_class.ExamClass;
import com.elearning.elearning_support.entities.exam_class.UserExamClass;
import com.elearning.elearning_support.entities.test.Test;
import com.elearning.elearning_support.entities.users.User;
import com.elearning.elearning_support.entities.users.UserRole;
import com.elearning.elearning_support.enums.examClass.UserExamClassRoleEnum;
import com.elearning.elearning_support.enums.importFile.ImportResponseEnum;
import com.elearning.elearning_support.enums.importFile.StudentImportFieldMapping;
import com.elearning.elearning_support.enums.users.UserTypeEnum;
import com.elearning.elearning_support.exceptions.exceptionFactory.ExceptionFactory;
import com.elearning.elearning_support.repositories.examClass.ExamClassRepository;
import com.elearning.elearning_support.repositories.examClass.UserExamClassRepository;
import com.elearning.elearning_support.repositories.users.UserRepository;
import com.elearning.elearning_support.repositories.users.UserRoleRepository;
import com.elearning.elearning_support.services.examClass.ExamClassService;
import com.elearning.elearning_support.services.test.TestService;
import com.elearning.elearning_support.services.users.UserService;
import com.elearning.elearning_support.utils.auth.AuthUtils;
import com.elearning.elearning_support.utils.excelFile.ExcelFileUtils;
import com.elearning.elearning_support.utils.file.FileUtils;
import com.elearning.elearning_support.utils.object.ObjectMapperUtil;
import com.elearning.elearning_support.utils.object.ObjectUtil;
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

    private final UserRoleRepository userRoleRepository;

    private final UserRepository userRepository;

    private final UserService userService;

    private final PasswordEncoder passwordEncoder;

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
        updateDTO.getLstSupervisorId().forEach(item -> lstUserExamClass.add(new UserExamClass(item, id, UserExamClassRoleEnum.SUPERVISOR.getType())));
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

    //TODO: review logic and implement
    @Transactional
    @Override
    public Set<Long> importStudentExamClass(Long examClassId, MultipartFile fileImport) throws IOException {
        // check existed exam class
        ExamClass examClass = findExamClassById(examClassId);
        Set<Long> lstExamClassParticipantIds = examClassRepository.getListExamClassParticipantId(examClass.getId(), UserExamClassRoleEnum.STUDENT.getType());
        // Tạo response mặc định
        ImportResponseDTO response = new ImportResponseDTO();
        response.setStatus(ImportResponseEnum.SUCCESS.getStatus());
        response.setMessage(ImportResponseEnum.SUCCESS.getMessage());
        XSSFWorkbook inputWorkbook = null;
        // Đọc file và import dữ liệu
        try {
            // Validate file sơ bộ
            FileUtils.validateUploadFile(fileImport, Arrays.asList(Excel.XLS, Excel.XLSX));

            // Tạo workbook để đọc file import
            inputWorkbook = new XSSFWorkbook(fileImport.getInputStream());
            XSSFSheet inputSheet = inputWorkbook.getSheetAt(0);
            if (Objects.isNull(inputSheet)) {
                throw exceptionFactory.fileUploadException(FileAttach.FILE_EXCEL_EMPTY_SHEET_ERROR, Resources.FILE_ATTACHED,
                    MessageConst.UPLOAD_FAILED);
            }

            // Validators
            ImportUserValidatorDTO validatorDTO = new ImportUserValidatorDTO(userRepository.getLstCurrentUsername(),
                userRepository.getListCurrentEmail(), userRepository.getListCurrentCodeByUserType(UserTypeEnum.STUDENT.getType()));

            // Tạo các map field
            Map<Integer, String> mapIndexColumnKey = new HashMap<>();
            // students save DB
            List<User> lstNewStudent = new ArrayList<>();
            Set<Long> lstExistedStudentId = new HashSet<>();

            // Duyệt file input
            Iterator<Row> rowIterator = inputSheet.rowIterator();
            int numberOfColumns = StudentImportFieldMapping.values().length;
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
                StudentImportDTO importDTO = new StudentImportDTO();
                importDTO.setUserType(UserTypeEnum.STUDENT.getType());
                for (Cell cell : currentRow) {
                    String columnKey = mapIndexColumnKey.get(cell.getColumnIndex());
                    String objectFieldKey = StudentImportFieldMapping.getObjectFieldByColumnKey(columnKey);
                    String cellValue = ExcelFileUtils.getStringCellValue(cell);
                    if (!ObjectUtils.isEmpty(cellValue)) {
                        isEmptyRow = false;
                    }
                    if (!ObjectUtils.isEmpty(objectFieldKey)) {
                        org.apache.commons.beanutils.BeanUtils.setProperty(importDTO, objectFieldKey, cellValue);
                    }
                }
                // Validate và mapping vào entity
                User newStudent = new User(importDTO);
                if (!newStudent.getFullName().isEmpty()) {
                    userService.generateUsernamePasswordEmail(newStudent);
                    importDTO.setUsername(ObjectUtils.isEmpty(importDTO.getUsername()) ? newStudent.getUsername() : importDTO.getUsername());
                    importDTO.setEmail(ObjectUtils.isEmpty(importDTO.getUsername()) ? newStudent.getEmail() : importDTO.getEmail());
                    importDTO.setPasswordRaw(ObjectUtils.isEmpty(importDTO.getPasswordRaw()) ? newStudent.getPasswordRaw() : importDTO.getPasswordRaw());
                }
                List<String> causeList = new ArrayList<>();
                ValidatedImportUserDTO validatedResult = userService.validateImportUser(validatorDTO, importDTO, causeList);
                if (!isEmptyRow) {
                    if (ObjectUtils.isEmpty(causeList)) {
                        newStudent.setUsername(importDTO.getUsername());
                        newStudent.setEmail(importDTO.getEmail());
                        newStudent.setPassword(passwordEncoder.encode(importDTO.getPasswordRaw()));
                        newStudent.setMetaData(ObjectMapperUtil.mapping(
                            String.format("{\"courseNum\" : %d}", Integer.valueOf(ObjectUtil.getOrDefault(importDTO.getCourse(), "0"))), Object.class));
                        lstNewStudent.add(newStudent);
                        // add username/email/code to validators
                        validatorDTO.getLstExistedUsername().add(newStudent.getUsername());
                        validatorDTO.getLstExistedEmail().add(newStudent.getEmail());
                        validatorDTO.getLstExistedCode().add(newStudent.getCode());
                    } else {
                        // if duplicated data and data has already been valid
                        if (validatedResult.getHasDuplicatedField() && !validatedResult.getMissedRequiredField() && ! validatedResult.getHasInvalidFormatField()){
                            Set<Long> existedStudentIds = userRepository.findStudentByUniqueInfo(importDTO.getCode(), importDTO.getEmail(), importDTO.getUsername());
                            if (!ObjectUtils.isEmpty(existedStudentIds)){
                                lstExistedStudentId.addAll(existedStudentIds);
                            }
                        }
                        response.getErrorRows().add(new RowErrorDTO(currentRow.getRowNum() + 1, importDTO, causeList));
                        response.setMessage(ImportResponseEnum.EXIST_INVALID_DATA.getMessage());
                        response.setStatus(ImportResponseEnum.EXIST_INVALID_DATA.getStatus());
                    }
                }
            }
            // List new students imported
            lstNewStudent = userRepository.saveAll(lstNewStudent);
            List<UserRole> lstStudentUserRole = lstNewStudent.stream()
                .map(student -> new UserRole(student.getId(), RoleConstants.ROLE_STUDENT_ID)).collect(Collectors.toList());
            userRoleRepository.saveAll(lstStudentUserRole);

            // add to exam class: both new and existed students
            lstExistedStudentId.removeIf(lstExamClassParticipantIds::contains);
            List<UserExamClass> lstStudentExamClass = lstNewStudent.stream()
                .map(student -> new UserExamClass(student.getId(), examClass.getId(), UserExamClassRoleEnum.STUDENT.getType())).collect(Collectors.toList());
            lstExistedStudentId.forEach(studentId -> lstStudentExamClass.add(new UserExamClass(studentId, examClass.getId(), UserExamClassRoleEnum.STUDENT.getType())));
            userExamClassRepository.saveAll(lstStudentExamClass);
            inputWorkbook.close();

            // return list studentId
            return lstStudentExamClass.stream().map(UserExamClass::getUserId).collect(Collectors.toSet());
        } catch (IOException ioException) {
            response.setMessage(ImportResponseEnum.IO_ERROR.getMessage());
            response.setStatus(ImportResponseEnum.IO_ERROR.getStatus());
        } catch (Exception exception) {
            if (Objects.nonNull(inputWorkbook)) {
                inputWorkbook.close();
            }
            response.setMessage(ImportResponseEnum.UNKNOWN_ERROR.getMessage());
            response.setStatus(ImportResponseEnum.UNKNOWN_ERROR.getStatus());
            log.error(MessageConst.EXCEPTION_LOG_FORMAT, exception.getMessage(), exception.getCause());
        }
        return null;
    }
}
