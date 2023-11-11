package com.elearning.elearning_support.services.users.impl;

import java.util.Arrays;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Random;
import org.springframework.core.io.InputStreamResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;
import org.springframework.web.multipart.MultipartFile;
import com.elearning.elearning_support.dtos.users.IGetUserListDTO;
import com.elearning.elearning_support.dtos.users.ProfileUserDTO;
import com.elearning.elearning_support.dtos.users.UserCreateDTO;
import com.elearning.elearning_support.dtos.users.UserUpdateDTO;
import com.elearning.elearning_support.entities.users.User;
import com.elearning.elearning_support.repositories.users.UserRepository;
import com.elearning.elearning_support.services.users.UserService;
import com.elearning.elearning_support.utils.DateUtils;
import com.elearning.elearning_support.utils.StringUtils;
import com.elearning.elearning_support.utils.auth.AuthUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    private final String[] IGNORE_COPY_USER_PROPERTIES = new String[] {
        "userType"
    };

    @Override
    public ProfileUserDTO getUserProfile() {
        return new ProfileUserDTO(userRepository.getDetailUser(AuthUtils.getCurrentUserId()));
    }

    @Override
    public void createUser(UserCreateDTO createDTO) {

    }

    @Override
    public void updateUser(UserUpdateDTO updateDTO) {

    }

    @Override
    public Page<IGetUserListDTO> getPageStudent(String studentName, String studentCode, Pageable pageable) {
        return userRepository.getListStudent(studentName, studentCode, pageable);
    }

    @Override
    public Page<IGetUserListDTO> getPageTeacher(String teacherName, String teacherCode, Pageable pageable) {
        return userRepository.getListTeacher(teacherName, teacherCode, pageable);
    }


    @Override
    public InputStreamResource importStudent(MultipartFile fileImport) {
        return null;
    }

    @Override
    public InputStreamResource importTeacher(MultipartFile fileImport) {
        return null;
    }

    /**
     * Hàm check trùng các thông tin
     */
    private void validateCreateUser(UserCreateDTO createDTO) {

    }

    private void validateUpdateUser(UserUpdateDTO updateDTO) {

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

    /**
     * Parse lastName - firstName when input is fullName
     */
    private List<String> parseNameParts(String fullName) {
        if (ObjectUtils.isEmpty(fullName)) {
            return Collections.emptyList();
        }
        return Arrays.asList(fullName.trim().split(" ", 2));
    }
}
