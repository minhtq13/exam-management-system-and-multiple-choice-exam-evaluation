package com.elearning.elearning_support.services.users;

import org.springframework.stereotype.Service;
import com.elearning.elearning_support.dtos.users.ProfileUserDTO;
import com.elearning.elearning_support.dtos.users.UserCreateDTO;
import com.elearning.elearning_support.dtos.users.UserUpdateDTO;

@Service
public interface UserService {

    /**
     * Get loged in user's profile
     */
    ProfileUserDTO getUserProfile();

    /**
     * Tạo user trong hệ thống
     */
    void createUser(UserCreateDTO createDTO);

    /**
     * Cập nhật thông tin user hệ thống
     */
    void updateUser(UserUpdateDTO updateDTO);



}
