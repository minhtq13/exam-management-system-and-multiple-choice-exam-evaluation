package com.elearning.elearning_support.services.users;

import java.io.IOException;
import java.util.List;
import org.springframework.core.io.InputStreamResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.elearning.elearning_support.dtos.fileAttach.importFile.ImportResponseDTO;
import com.elearning.elearning_support.dtos.users.IGetUserListDTO;
import com.elearning.elearning_support.dtos.users.ProfileUserDTO;
import com.elearning.elearning_support.dtos.users.UserCreateDTO;
import com.elearning.elearning_support.dtos.users.UserDetailDTO;
import com.elearning.elearning_support.dtos.users.UserSaveReqDTO;

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
    void updateUser(Long userId, UserSaveReqDTO updateDTO);

    /**
     * Chi tiết thông tin user
     */
    UserDetailDTO getUserDetail(Long userId);

    /**
     * Lấy danh sách HSSV dạng page
     */
    Page<IGetUserListDTO> getPageStudent(String studentName, String studentCode, Pageable pageable);

    /**
     * Lấy danh sách HSSV dạng list
     */
    List<IGetUserListDTO> getListStudent(String studentName, String studentCode);


    /**
     * Lấy danh sách GV dạng page
     */
    Page<IGetUserListDTO> getPageTeacher(String teacherName, String teacherCode, Pageable pageable);

    /**
     * Lấy danh sách GV dạng list
     */
    List<IGetUserListDTO> getListTeacher(String teacherName, String teacherCode);

    /**
     * Import danh sách HSSV
     */
    ImportResponseDTO importStudent(MultipartFile fileImport);


    /**
     * Export danh sách HSSV
     */
    InputStreamResource exportStudent(String studentName, String studentCode) throws IOException;


    /**
     * Import danh sách GV
     */
    ImportResponseDTO importTeacher(MultipartFile fileImport);

    /**
     * Export danh sách GV
     */
    InputStreamResource exportTeacher(String studentName, String studentCode) throws IOException;

}
