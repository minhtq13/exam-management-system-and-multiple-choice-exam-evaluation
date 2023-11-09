package com.elearning.elearning_support.controllers.users;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import com.elearning.elearning_support.dtos.users.UserCreateDTO;
import com.elearning.elearning_support.dtos.users.UserUpdateDTO;
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

    @GetMapping
    @Operation(description = "Danh sách người dùng")
    public ResponseEntity<?> getListUser(){
        return ResponseEntity.ok("");
    }

    @PostMapping
    @Operation(summary = "Tạo người dùng")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN')")
    public void createUser(@RequestBody @Validated UserCreateDTO createDTO) {
        userService.createUser(createDTO);
    }

    @PutMapping
    @Operation(summary = "Cập nhật thông tin người dùng")
    public void updateUser(@RequestBody @Validated UserUpdateDTO updateDTO) {

    }

    /*
     *  ================== API dành cho user END =================
    */


    /*
    *  ================== API dành cho học sinh START =================
    */
    @GetMapping("/student/page")
    @Operation(summary = "Danh sách học sinh / sinh viên dạng phân trang")
    public ResponseEntity<?> getPageStudent() {
        return ResponseEntity.ok("");
    }

    @GetMapping("/student/list")
    @Operation(summary = "Danh sách học sinh / sinh viên danh sách toàn bộ")
    public ResponseEntity<?> getListStudent() {
        return ResponseEntity.ok("");
    }

    @PostMapping(value = "/student/import", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Import sinh viên")
    public ResponseEntity<?> importStudent(@RequestParam("file") MultipartFile fileImport) {
        return ResponseEntity.ok("");
    }

    /*
     *  ================== API dành cho học sinh END =================
     */


    /*
     *  ================== API dành cho giáo viên / giảng viên START =================
     */

    @GetMapping("/teacher/page")
    @Operation(summary = "Danh sách học sinh / sinh viên dạng phân trang")
    public ResponseEntity<?> getPageTeacher() {
        return ResponseEntity.ok("");
    }

    @GetMapping("/teacher/list")
    @Operation(summary = "Danh sách học sinh / sinh viên danh sách toàn bộ")
    public ResponseEntity<?> getListTeacher() {
        return ResponseEntity.ok("");
    }

    @PostMapping(value = "/teacher/import", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Import sinh viên")
    public ResponseEntity<?> importTeacher(@RequestParam("file") MultipartFile fileImport) {
        return ResponseEntity.ok("");
    }


    /*
     *  ================== API dành cho giáo viên / giảng viên END =================
     */








}
