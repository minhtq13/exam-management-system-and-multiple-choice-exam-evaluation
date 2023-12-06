package com.elearning.elearning_support.services.users.impl;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Random;
import java.util.stream.Collectors;
import org.apache.commons.beanutils.BeanUtils;
import org.apache.commons.math3.util.Pair;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.core.io.InputStreamResource;
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
import com.elearning.elearning_support.dtos.fileAttach.importFile.ImportResponseDTO;
import com.elearning.elearning_support.dtos.fileAttach.importFile.RowErrorDTO;
import com.elearning.elearning_support.dtos.users.IGetDetailUserDTO;
import com.elearning.elearning_support.dtos.users.IGetUserListDTO;
import com.elearning.elearning_support.dtos.users.ImportUserValidatorDTO;
import com.elearning.elearning_support.dtos.users.ProfileUserDTO;
import com.elearning.elearning_support.dtos.users.UserCreateDTO;
import com.elearning.elearning_support.dtos.users.UserDetailDTO;
import com.elearning.elearning_support.dtos.users.UserSaveReqDTO;
import com.elearning.elearning_support.dtos.users.importUser.CommonUserImportDTO;
import com.elearning.elearning_support.dtos.users.student.StudentExportDTO;
import com.elearning.elearning_support.dtos.users.student.StudentImportDTO;
import com.elearning.elearning_support.dtos.users.teacher.TeacherExportDTO;
import com.elearning.elearning_support.entities.users.User;
import com.elearning.elearning_support.entities.users.UserRole;
import com.elearning.elearning_support.enums.commons.DeletedFlag;
import com.elearning.elearning_support.enums.importFile.ImportResponseEnum;
import com.elearning.elearning_support.enums.importFile.StudentImportFieldMapping;
import com.elearning.elearning_support.enums.importFile.TeacherImportFieldMapping;
import com.elearning.elearning_support.enums.users.GenderEnum;
import com.elearning.elearning_support.enums.users.UserTypeEnum;
import com.elearning.elearning_support.exceptions.exceptionFactory.ExceptionFactory;
import com.elearning.elearning_support.repositories.users.UserRepository;
import com.elearning.elearning_support.repositories.users.UserRoleRepository;
import com.elearning.elearning_support.services.users.UserService;
import com.elearning.elearning_support.utils.DateUtils;
import com.elearning.elearning_support.utils.StringUtils;
import com.elearning.elearning_support.utils.auth.AuthUtils;
import com.elearning.elearning_support.utils.excelFile.ExcelFileUtils;
import com.elearning.elearning_support.utils.excelFile.ExcelValidationUtils;
import com.elearning.elearning_support.utils.file.FileUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    private final UserRoleRepository userRoleRepository;

    private final PasswordEncoder passwordEncoder;

    private final ExceptionFactory exceptionFactory;

    private final ExcelFileUtils excelFileUtils;


    private final String[] IGNORE_COPY_USER_PROPERTIES = new String[]{
        "userType"
    };

    @Override
    public ProfileUserDTO getUserProfile() {
        return new ProfileUserDTO(userRepository.getDetailUser(AuthUtils.getCurrentUserId()));
    }

    @Transactional
    @Override
    public void createUser(UserCreateDTO createDTO) {
        // Validate username
        if (userRepository.existsByUsername(createDTO.getUsername())) {
            throw exceptionFactory.resourceExistedException(MessageConst.User.USER_USERNAME_EXISTED_ERROR, Resources.USER,
                MessageConst.RESOURCE_EXISTED, ErrorKey.User.USERNAME, createDTO.getUsername());
        }
        // validate updated fields
        validateCreateUser(createDTO);

        // Tạo user mới
        User newUser = new User();
        org.springframework.beans.BeanUtils.copyProperties(createDTO, newUser);
        newUser.setCreatedAt(new Date());
        newUser.setCreatedBy(AuthUtils.getCurrentUserId());
        newUser.setPassword(passwordEncoder.encode(createDTO.getPassword()));
        newUser.setGender(createDTO.getGenderType().getType());
        newUser = userRepository.save(newUser);

        // Add to user_role
        Long newUserId = newUser.getId();
        List<UserRole> lstUserRole = createDTO.getLstRoleId().stream().map(roleId -> new UserRole(newUserId, roleId))
            .collect(Collectors.toList());
        userRoleRepository.saveAll(lstUserRole);
    }

    @Transactional
    @Override
    public void updateUser(Long userId, UserSaveReqDTO updateDTO) {
        // Kiểm tra user tồn tại
        User user = findUserById(userId);

        // Validate updated fields
        validateUpdateUser(userId, updateDTO);

        // Update fields
        org.springframework.beans.BeanUtils.copyProperties(updateDTO, user, IGNORE_COPY_USER_PROPERTIES);
        user.setGender(updateDTO.getGenderType().getType());
        user.setModifiedAt(new Date());
        user.setModifiedBy(AuthUtils.getCurrentUserId());
        userRepository.save(user);

        // Update user_role (delete all -> save new)
        if (!ObjectUtils.isEmpty(updateDTO.getLstRoleId())) {
            userRoleRepository.deleteAllByUserId(user.getId());
            List<UserRole> lstUserRole = updateDTO.getLstRoleId().stream().map(roleId -> new UserRole(user.getId(), roleId))
                .collect(Collectors.toList());
            userRoleRepository.saveAll(lstUserRole);
        }
    }

    @Override
    public UserDetailDTO getUserDetail(Long userId) {
        IGetDetailUserDTO iUserDetails = userRepository.getDetailUser(userId);
        if (Objects.isNull(iUserDetails)) {
            throw exceptionFactory.resourceNotFoundException(MessageConst.User.USER_NOT_FOUND_ERROR_CODE, Resources.USER,
                MessageConst.RESOURCE_NOT_FOUND, ErrorKey.User.ID, String.valueOf(userId));
        }
        return new UserDetailDTO(iUserDetails);
    }

    @Override
    public Page<IGetUserListDTO> getPageStudent(String studentName, String studentCode, Integer courseNum, Pageable pageable) {
        return userRepository.getPageStudent(studentName, studentCode, courseNum, pageable);
    }

    @Override
    public List<IGetUserListDTO> getListStudent(String studentName, String studentCode, Integer courseNum) {
        return userRepository.getListStudent(studentName, studentCode, courseNum);
    }

    @Override
    public Page<IGetUserListDTO> getPageTeacher(String teacherName, String teacherCode, Pageable pageable) {
        return userRepository.getPageTeacher(teacherName, teacherCode, pageable);
    }

    @Override
    public List<IGetUserListDTO> getListTeacher(String teacherName, String teacherCode) {
        return userRepository.getListTeacher(teacherName, teacherCode);
    }

    @Transactional
    @Override
    public ImportResponseDTO importStudent(MultipartFile fileImport) {
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

            // Validators
            ImportUserValidatorDTO validatorDTO = new ImportUserValidatorDTO(userRepository.getLstCurrentUsername(),
                userRepository.getListCurrentEmail(), userRepository.getListCurrentCodeByUserType(UserTypeEnum.STUDENT.getType()));

            // Tạo các map field
            Map<Integer, String> mapIndexColumnKey = new HashMap<>();
            // students save DB
            List<User> lstNewStudent = new ArrayList<>();

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
                CommonUserImportDTO importDTO = new StudentImportDTO();
                importDTO.setUserType(UserTypeEnum.STUDENT.getType());
                for (Cell cell : currentRow) {
                    String columnKey = mapIndexColumnKey.get(cell.getColumnIndex());
                    String objectFieldKey = StudentImportFieldMapping.getObjectFieldByColumnKey(columnKey);
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
                validateImportUser(validatorDTO, importDTO, causeList);
                if (!isEmptyRow) {
                    if (ObjectUtils.isEmpty(causeList)) {
                        User newStudent = new User(importDTO);
                        newStudent.setPassword(passwordEncoder.encode(importDTO.getPasswordRaw()));
                        lstNewStudent.add(newStudent);
                        // add username/email/code to validators
                        validatorDTO.getLstExistedUsername().add(newStudent.getUsername());
                        validatorDTO.getLstExistedEmail().add(newStudent.getEmail());
                        validatorDTO.getLstExistedCode().add(newStudent.getCode());
                    } else {
                        response.getErrorRows().add(new RowErrorDTO(currentRow.getRowNum() + 1, importDTO, causeList));
                        response.setMessage(ImportResponseEnum.EXIST_INVALID_DATA.getMessage());
                        response.setStatus(ImportResponseEnum.EXIST_INVALID_DATA.getStatus());
                    }
                }
            }
            lstNewStudent = userRepository.saveAll(lstNewStudent);
            List<UserRole> lstStudentUserRole = lstNewStudent.stream()
                .map(student -> new UserRole(student.getId(), RoleConstants.ROLE_STUDENT_ID)).collect(
                    Collectors.toList());
            userRoleRepository.saveAll(lstStudentUserRole);
            inputWorkbook.close();

            // Set status and message response
            return response;
        } catch (IOException ioException) {
            response.setMessage(ImportResponseEnum.IO_ERROR.getMessage());
            response.setStatus(ImportResponseEnum.IO_ERROR.getStatus());
        } catch (Exception exception) {
            response.setMessage(ImportResponseEnum.UNKNOWN_ERROR.getMessage());
            response.setStatus(ImportResponseEnum.UNKNOWN_ERROR.getStatus());
            log.error(MessageConst.EXCEPTION_LOG_FORMAT, exception.getMessage(), exception.getCause());
        }
        return null;
    }

    @Override
    public InputStreamResource exportStudent(String studentName, String studentCode, Integer courseNum) throws IOException {
        List<StudentExportDTO> lstStudent = userRepository.getListStudent(studentName, studentCode, courseNum).stream().map(StudentExportDTO::new).collect(
            Collectors.toList());
        // Tạo map cấu trúc file excel
        Map<Integer, Pair<String, String>> mapStructure = new LinkedHashMap<>();
        mapStructure.put(1, Pair.create("lastName", "getLastName"));
        mapStructure.put(2, Pair.create("firstName", "getFirstName"));
        mapStructure.put(3, Pair.create("gender", "getGender"));
        mapStructure.put(4, Pair.create("birthDate", "getBirthDate"));
        mapStructure.put(5, Pair.create("email", "getEmail"));
        mapStructure.put(6, Pair.create("phoneNumber", "getPhoneNumber"));
        mapStructure.put(7, Pair.create("courseNum", "getCourseNum"));
        return excelFileUtils.createWorkbook(lstStudent, mapStructure, "students");
    }

    @Transactional
    @Override
    public ImportResponseDTO importTeacher(MultipartFile fileImport) {
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

            // Validators
            ImportUserValidatorDTO validatorDTO = new ImportUserValidatorDTO(userRepository.getLstCurrentUsername(),
                userRepository.getListCurrentEmail(), userRepository.getListCurrentCodeByUserType(UserTypeEnum.TEACHER.getType()));

            // Tạo các map field
            Map<Integer, String> mapIndexColumnKey = new HashMap<>();
            // students save DB
            List<User> lstNewTeacher = new ArrayList<>();

            // Duyệt file input
            Iterator<Row> rowIterator = inputSheet.rowIterator();
            int numberOfColumns = TeacherImportFieldMapping.values().length;
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
                importDTO.setUserType(UserTypeEnum.TEACHER.getType());
                for (Cell cell : currentRow) {
                    String columnKey = mapIndexColumnKey.get(cell.getColumnIndex());
                    String objectFieldKey = StudentImportFieldMapping.getObjectFieldByColumnKey(columnKey);
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
                validateImportUser(validatorDTO, importDTO, causeList);
                if (!isEmptyRow) {
                    if (ObjectUtils.isEmpty(causeList)) {
                        User newTeacher = new User(importDTO);
                        newTeacher.setPassword(passwordEncoder.encode(importDTO.getPasswordRaw()));
                        lstNewTeacher.add(newTeacher);
                        // add username/email/code to validators
                        validatorDTO.getLstExistedUsername().add(newTeacher.getUsername());
                        validatorDTO.getLstExistedEmail().add(newTeacher.getEmail());
                        validatorDTO.getLstExistedCode().add(newTeacher.getCode());
                    } else {
                        response.getErrorRows().add(new RowErrorDTO(currentRow.getRowNum() + 1, importDTO, causeList));
                        response.setMessage(ImportResponseEnum.EXIST_INVALID_DATA.getMessage());
                        response.setStatus(ImportResponseEnum.EXIST_INVALID_DATA.getStatus());
                    }
                }
            }
            lstNewTeacher = userRepository.saveAll(lstNewTeacher);
            List<UserRole> lstTeacherUserRole = lstNewTeacher.stream()
                .map(student -> new UserRole(student.getId(), RoleConstants.ROLE_TEACHER_ID)).collect(
                    Collectors.toList());
            userRoleRepository.saveAll(lstTeacherUserRole);
            inputWorkbook.close();
            return response;
        } catch (IOException ioException) {
            response.setMessage(ImportResponseEnum.IO_ERROR.getMessage());
            response.setStatus(ImportResponseEnum.IO_ERROR.getStatus());
        } catch (Exception exception) {
            response.setMessage(ImportResponseEnum.UNKNOWN_ERROR.getMessage());
            response.setStatus(ImportResponseEnum.UNKNOWN_ERROR.getStatus());
            log.error(MessageConst.EXCEPTION_LOG_FORMAT, exception.getMessage(), exception.getCause());
        }
        return null;
    }

    @Override
    public InputStreamResource exportTeacher(String teacherName, String teacherCode) throws IOException {
        List<TeacherExportDTO> lstTeacher = userRepository.getListTeacher(teacherName, teacherCode).stream().map(TeacherExportDTO::new).collect(
            Collectors.toList());
        // Tạo map cấu trúc file excel
        Map<Integer, Pair<String, String>> mapStructure = new LinkedHashMap<>();
        mapStructure.put(1, Pair.create("lastName", "getLastName"));
        mapStructure.put(2, Pair.create("firstName", "getFirstName"));
        mapStructure.put(3, Pair.create("gender", "getGender"));
        mapStructure.put(4, Pair.create("birthDate", "getBirthDate"));
        mapStructure.put(5, Pair.create("email", "getEmail"));
        mapStructure.put(6, Pair.create("phoneNumber", "getPhoneNumber"));
        mapStructure.put(7, Pair.create("departmentName", "getDepartmentName"));
        return excelFileUtils.createWorkbook(lstTeacher, mapStructure, "teacher");
    }

    /**
     * Hàm check trùng các thông tin
     */
    private void validateImportUser(ImportUserValidatorDTO validatorDTO, CommonUserImportDTO importDTO, List<String> causeList) {
        // Validate field bắt buộc
        List<String> missingRequiredFields = new ArrayList<>();
        if (ObjectUtils.isEmpty(importDTO.getFullNameRaw())) {
            missingRequiredFields.add("fullName");
        }
        if (ObjectUtils.isEmpty(importDTO.getGenderRaw())) {
            missingRequiredFields.add("code");
        }
        if (ObjectUtils.isEmpty(importDTO.getGenderRaw())) {
            missingRequiredFields.add("gender");
        }
        if (ObjectUtils.isEmpty(importDTO.getUsername())) {
            missingRequiredFields.add("username");
        }
        if (ObjectUtils.isEmpty(importDTO.getPasswordRaw())) {
            missingRequiredFields.add("password");
        }
        if (ObjectUtils.isEmpty(importDTO.getEmail())) {
            missingRequiredFields.add("email");
        }
        if (!missingRequiredFields.isEmpty()) {
            causeList.add(String.format("Missing required fields: %s", String.join(",", missingRequiredFields)));
        }

        // Validate định dạng dữ liệu
        List<String> invalidFormatFields = new ArrayList<>();
        if (!Objects.isNull(ExcelValidationUtils.validatePhoneNumber(importDTO.getPhoneNumber()))) {
            invalidFormatFields.add("phone");
        }
        if (!Objects.isNull(ExcelValidationUtils.validateEmail(importDTO.getEmail()))) {
            invalidFormatFields.add("email");
        }
        if (Objects.isNull(GenderEnum.getGenderByEngName(importDTO.getGenderRaw()))) {
            invalidFormatFields.add("gender");
        }
        if (!invalidFormatFields.isEmpty()) {
            causeList.add(String.format("Invalid formatted fields: %s", String.join(",", invalidFormatFields)));
        }

        // Validate trùng dữ liệu
        List<String> duplicatedFields = new ArrayList<>();
        if (validatorDTO.getLstExistedUsername().contains(importDTO.getUsername())) {
            duplicatedFields.add("username");
        }
        if (validatorDTO.getLstExistedEmail().contains(importDTO.getEmail())) {
            duplicatedFields.add("email");
        }
        if (validatorDTO.getLstExistedCode().contains(importDTO.getCode())) {
            duplicatedFields.add("code");
        }
        if (!duplicatedFields.isEmpty()) {
            causeList.add(String.format("Duplicated fields: %s", String.join(",", duplicatedFields)));
        }

    }

    /**
     * Validate user when create or update
     */
    private void validateCreateUser(UserSaveReqDTO saveReqDTO){
        // Validate existed email;
        if (userRepository.existsByEmail(saveReqDTO.getEmail())) {
            throw exceptionFactory.resourceExistedException(MessageConst.User.USER_EMAIL_EXISTED_ERROR, Resources.USER,
                MessageConst.RESOURCE_EXISTED, ErrorKey.User.EMAIL, saveReqDTO.getEmail());
        }

        // Validate existed code with the same userType
        if (userRepository.existsByCodeAndUserType(saveReqDTO.getCode(), saveReqDTO.getUserType())) {
            throw exceptionFactory.resourceExistedException(MessageConst.User.USER_CODE_AND_USER_TYPE_EXISTED_ERROR, Resources.USER,
                MessageConst.RESOURCE_EXISTED, ErrorKey.User.CODE, saveReqDTO.getCode());
        }

    }

    /**
     * Validate user when create or update
     */
    private void validateUpdateUser(Long userId, UserSaveReqDTO saveReqDTO) {
        // Validate existed email;
        if (userRepository.existsByEmailAndIdNot(saveReqDTO.getEmail(), userId)) {
            throw exceptionFactory.resourceExistedException(MessageConst.User.USER_EMAIL_EXISTED_ERROR, Resources.USER,
                MessageConst.RESOURCE_EXISTED, ErrorKey.User.EMAIL, saveReqDTO.getEmail());
        }

        // Validate existed code with the same userType
        if (userRepository.existsByCodeAndUserTypeAndIdNot(saveReqDTO.getCode(), saveReqDTO.getUserType(), userId)) {
            throw exceptionFactory.resourceExistedException(MessageConst.User.USER_CODE_AND_USER_TYPE_EXISTED_ERROR, Resources.USER,
                MessageConst.RESOURCE_EXISTED, ErrorKey.User.CODE, saveReqDTO.getCode());
        }

    }

    /**
     * Find user by id and deleted_flag
     */
    private User findUserById(Long id) {
        return userRepository.findByIdAndDeletedFlag(id, DeletedFlag.NOT_YET_DELETED.getValue())
            .orElseThrow(() -> exceptionFactory.resourceNotFoundException(MessageConst.User.USER_NOT_FOUND_ERROR_CODE, Resources.USER,
                MessageConst.RESOURCE_NOT_FOUND, ErrorKey.User.ID, String.valueOf(id)));
    }

    /**
     * Genarate  random user's code
     */
    private String generateUserCode() {
        String baseCode = "";
        Random random = new Random();
        String generatedCode = baseCode + (random.nextInt(900000) + 100000);
        while (userRepository.existsByCode(generatedCode)) {
            generatedCode = baseCode + (random.nextInt(900000) + 100000);
        }
        return generatedCode;
    }

    /**
     * Generate new username and password for user
     */
    private void generateUsernamePassword(User user) {
        StringBuilder usernameBuilder = new StringBuilder();
        String fullName = user.getFullName();
        String[] fullNameArr = fullName.trim().split(" ");
        if (fullNameArr.length > 0) {
            usernameBuilder.append(StringUtils.convertVietnameseToEng(fullNameArr[fullNameArr.length - 1]).toLowerCase());
            for (int index = 0; index < fullNameArr.length - 1; index++) {
                usernameBuilder.append(StringUtils.convertVietnameseToEng(fullNameArr[index]).toLowerCase().charAt(0));
            }
        }
        //Set username and password to user
        Integer userLikeExisted = userRepository.countByUsername(usernameBuilder.toString());
        usernameBuilder.append(userLikeExisted == 0 ? "" : String.valueOf(userLikeExisted + 1));
        user.setUsername(usernameBuilder.toString());

        String password = user.getUsername() + "@" + DateUtils.asLocalDate(new Date()).getYear();
        user.setPassword(passwordEncoder.encode(password));
    }

}
