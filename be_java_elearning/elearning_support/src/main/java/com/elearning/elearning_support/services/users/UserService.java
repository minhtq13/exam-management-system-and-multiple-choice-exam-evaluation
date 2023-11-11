package com.elearning.elearning_support.services.users;

import org.springframework.core.io.InputStreamResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.elearning.elearning_support.dtos.users.IGetUserListDTO;
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

    /**
     * Lấy danh sách HSSV
     */
    Page<IGetUserListDTO> getPageStudent(String studentName, String studentCode, Pageable pageable);


    /**
     * Lấy danh sách GV
     */
    Page<IGetUserListDTO> getPageTeacher(String teacherName, String teacherCode, Pageable pageable);

    /**
     * Import danh sách HSSV
     */
    InputStreamResource importStudent(MultipartFile fileImport);


    /**
     * Import danh sách GV
     */
    InputStreamResource importTeacher(MultipartFile fileImport);



}
