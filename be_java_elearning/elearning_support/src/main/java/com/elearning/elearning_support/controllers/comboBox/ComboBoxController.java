package com.elearning.elearning_support.controllers.comboBox;

import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.elearning.elearning_support.dtos.common.ICommonIdCode;
import com.elearning.elearning_support.dtos.common.ICommonIdCodeName;
import com.elearning.elearning_support.enums.users.UserTypeEnum;
import com.elearning.elearning_support.services.comboBox.ComboBoxService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/combobox")
@Tag(name = "APIs Combo Box")
@RequiredArgsConstructor
public class ComboBoxController {

    private final ComboBoxService comboBoxService;


    /*
    ======================= SUBJECT AND CHAPTER COMBOBOX ===================
    */

    @GetMapping("/subject")
    @Operation(summary = "Danh sách môn học / học phần (Subject)")
    public List<ICommonIdCodeName> getListSubject(
        @RequestParam(name = "subjectCode", required = false, defaultValue = "") String subjectCode,
        @RequestParam(name = "subjectTitle", required = false, defaultValue = "") String subjectTitle
    ) {
        return comboBoxService.getListSubject(subjectTitle, subjectCode);
    }

    @GetMapping("/subject/chapter")
    @Operation(summary = "Danh sách chương trong môn học (Chapter)")
    public List<ICommonIdCodeName> getListChapter(
        @RequestParam(name = "subjectId") Long subjectId,
        @RequestParam(name = "chapterCode", required = false, defaultValue = "") String chapterCode,
        @RequestParam(name = "chapterTitle", required = false, defaultValue = "") String chapterTitle
    ) {
        return comboBoxService.getListChapterInSubject(subjectId, chapterTitle, chapterCode);
    }

     /*
    ======================= STUDENT AND TEACHER COMBOBOX ===================
    */

    @GetMapping("/user/student")
    @Operation(summary = "Danh sách HSSV")
    public List<ICommonIdCodeName> getListStudent(
        @RequestParam(name = "studentName", required = false, defaultValue = "") String studentName,
        @RequestParam(name = "studentCode", required = false, defaultValue = "") String studentCode
    ) {
        return comboBoxService.getListStudent(studentName, studentCode);
    }

    @GetMapping("/user/teacher")
    @Operation(summary = "Danh sách Giáo viên / Giảng viên")
    public List<ICommonIdCodeName> getListTeacher(
        @RequestParam(name = "teacherName", required = false, defaultValue = "") String teacherName,
        @RequestParam(name = "teacherCode", required = false, defaultValue = "") String teacherCode
    ) {
        return comboBoxService.getListTeacher(teacherName, teacherCode);
    }

    @GetMapping("/role")
    @Operation(summary = "Danh sách vai trò (không bao gồm SUPER_ADMIN)")
    public List<ICommonIdCodeName> getListRole(
        @RequestParam(name = "search", required = false, defaultValue = "") String search,
        @RequestParam(name = "userType", required = false, defaultValue = "ALL") UserTypeEnum userType) {
        return comboBoxService.getListRole(search, userType);
    }

    @GetMapping("/semester")
    @Operation(summary = "Danh sách học kỳ")
    public List<ICommonIdCodeName> getListSemester(@RequestParam(name = "search", required = false, defaultValue = "") String search){
        return comboBoxService.getListSemester(search);
    }

    @GetMapping("/test")
    @Operation(summary = "Danh sách kỳ thi")
    public List<ICommonIdCodeName> getListTest(@RequestParam(name = "search", required = false, defaultValue = "") String search){
        return comboBoxService.getListTest(search);
    }

    @GetMapping("/exam-class")
    @Operation(summary = "Danh sách mã lớp thi")
    public List<ICommonIdCode> getListExamClass(
        @RequestParam(name = "semesterId", required = false, defaultValue = "-1") Long semesterId,
        @RequestParam(name = "subjectId", required = false, defaultValue = "-1") Long subjectId,
        @RequestParam(name = "search", required = false, defaultValue = "") String search
    ) {
        return comboBoxService.getListExamClass(semesterId, subjectId, search);
    }

}
