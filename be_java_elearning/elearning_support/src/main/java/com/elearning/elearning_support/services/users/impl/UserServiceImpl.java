package com.elearning.elearning_support.services.users.impl;

import java.util.Date;
import java.util.Random;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.elearning.elearning_support.entities.users.User;
import com.elearning.elearning_support.repositories.users.UserRepository;
import com.elearning.elearning_support.services.users.UserService;
import com.elearning.elearning_support.utils.DateUtils;
import com.elearning.elearning_support.utils.StringUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

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
