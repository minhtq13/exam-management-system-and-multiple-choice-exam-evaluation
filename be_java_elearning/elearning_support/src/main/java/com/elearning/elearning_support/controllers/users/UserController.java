package com.elearning.elearning_support.controllers.users;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.MediaType;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import com.elearning.elearning_support.dtos.fileAttach.importFile.ImportResponseDTO;
import com.elearning.elearning_support.dtos.users.IGetUserListDTO;
import com.elearning.elearning_support.dtos.users.UserCreateDTO;
import com.elearning.elearning_support.dtos.users.UserDetailDTO;
import com.elearning.elearning_support.dtos.users.UserSaveReqDTO;
import com.elearning.elearning_support.services.users.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/user")
@Tag(name = "APIs Người dùng (User)")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;


    /*
     *  ================== API dành cho user START =================
     */

    @PostMapping
    @Operation(summary = "Tạo người dùng")
    public void createUser(@RequestBody @Validated UserCreateDTO createDTO) {
        userService.createUser(createDTO);
    }

    @PutMapping("/{userId}")
    @Operation(summary = "Cập nhật thông tin người dùng")
    public void updateUser(
        @PathVariable(name = "userId") Long userId,
        @RequestBody @Validated UserSaveReqDTO updateDTO) {
        userService.updateUser(userId, updateDTO);
    }

    @GetMapping("/{userId}")
    @Operation(summary = "Chi tiết người dùng")
    public UserDetailDTO getUserDetail(@PathVariable(name = "userId") Long userId){
        return userService.getUserDetail(userId);
    }

    /*
     *  ================== API dành cho user END =======================
     */


    /*
     *  ================== API dành cho học sinh START =================
     */
    @GetMapping("/student/page")
    @Operation(summary = "Danh sách học sinh / sinh viên dạng phân trang")
    public Page<IGetUserListDTO> getPageStudent(
        @RequestParam(name = "name", required = false, defaultValue = "") String studentName,
        @RequestParam(name = "code", required = false, defaultValue = "") String studentCode,
        @RequestParam(name = "page", required = false, defaultValue = "0") Integer page,
        @RequestParam(name = "size", required = false, defaultValue = "10") Integer size,
        @RequestParam(name = "sort", required = false, defaultValue = "lastModifiedAt") String sort) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sort).descending());
        return userService.getPageStudent(studentName, studentCode, pageable);
    }

    @GetMapping("/student/list")
    @Operation(summary = "Danh sách học sinh / sinh viên danh sách toàn bộ")
    public List<IGetUserListDTO> getListStudent(
        @RequestParam(name = "name", required = false, defaultValue = "") String studentName,
        @RequestParam(name = "code", required = false, defaultValue = "") String studentCode
    ) {
        return userService.getListStudent(studentName, studentCode);
    }

    @PostMapping(value = "/student/import", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Import sinh viên")
    public ImportResponseDTO importStudent(@RequestParam("file") MultipartFile fileImport) {
        return userService.importStudent(fileImport);
    }

    /*
     *  ================== API dành cho học sinh END =================
     */


    /*
     *  ================== API dành cho giáo viên / giảng viên START =================
     */

    @GetMapping("/teacher/page")
    @Operation(summary = "Danh sách giáo viên / giảng viên dạng phân trang")
    public Page<IGetUserListDTO> getPageTeacher(
        @RequestParam(name = "name", required = false, defaultValue = "") String teacherName,
        @RequestParam(name = "code", required = false, defaultValue = "") String teacherCode,
        @RequestParam(name = "page", required = false, defaultValue = "0") Integer page,
        @RequestParam(name = "size", required = false, defaultValue = "10") Integer size,
        @RequestParam(name = "sort", required = false, defaultValue = "lastModifiedAt") String sort
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sort).descending());
        return userService.getPageTeacher(teacherName, teacherCode, pageable);
    }

    @GetMapping("/teacher/list")
    @Operation(summary = "Danh sách giáo viên / giảng viên danh sách toàn bộ")
    public List<IGetUserListDTO> getListTeacher(
        @RequestParam(name = "name", required = false, defaultValue = "") String teacherName,
        @RequestParam(name = "code", required = false, defaultValue = "") String teacherCode
    ) {
        return userService.getListTeacher(teacherName, teacherCode);
    }

    @PostMapping(value = "/teacher/import", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Import giáo viên / giảng viên")
    public ImportResponseDTO importTeacher(@RequestParam("file") MultipartFile fileImport) {
        return userService.importTeacher(fileImport);
    }

    /*
     *  ================== API dành cho giáo viên / giảng viên END =================
     */


}
