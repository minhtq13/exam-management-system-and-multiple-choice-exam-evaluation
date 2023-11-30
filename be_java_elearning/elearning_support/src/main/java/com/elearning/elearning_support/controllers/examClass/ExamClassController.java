package com.elearning.elearning_support.controllers.examClass;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import org.springframework.core.io.InputStreamResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.elearning.elearning_support.dtos.examClass.ExamClassCreateDTO;
import com.elearning.elearning_support.dtos.examClass.ExamClassSaveReqDTO;
import com.elearning.elearning_support.dtos.examClass.ICommonExamClassDTO;
import com.elearning.elearning_support.dtos.examClass.IExamClassDetailDTO;
import com.elearning.elearning_support.dtos.examClass.IExamClassParticipantDTO;
import com.elearning.elearning_support.dtos.examClass.UserExamClassDTO;
import com.elearning.elearning_support.enums.examClass.UserExamClassRoleEnum;
import com.elearning.elearning_support.services.examClass.ExamClassService;
import com.elearning.elearning_support.utils.file.FileUtils.Excel;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/exam-class")
@Tag(name = "APIs Lớp thi (Exam Class)")
@RequiredArgsConstructor
public class ExamClassController {

    private final ExamClassService examClassService;

    @PostMapping
    @Operation(summary = "Tạo lớp thi")
    public Long createExamClass(@RequestBody @Validated ExamClassCreateDTO createDTO) {
        return examClassService.createExamClass(createDTO);
    }

    @GetMapping("/page")
    @Operation(summary = "Danh sách lớp thi dạng page")
    public Page<ICommonExamClassDTO> getListExamClass(
        @RequestParam(name = "code", required = false, defaultValue = "") String code,
        @RequestParam(name = "semesterId", required = false, defaultValue = "-1") Long semesterId,
        @RequestParam(name = "subjectId", required = false, defaultValue = "-1") Long subjectId,
        @RequestParam(name = "testId", required = false, defaultValue = "-1") Long testId,
        @RequestParam(name = "page", required = false, defaultValue = "0") Integer page,
        @RequestParam(name = "size", required = false, defaultValue = "10") Integer size,
        @RequestParam(name = "sort", required = false, defaultValue = "id") String sort
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sort).descending());
        return examClassService.getPageExamClass(code, semesterId, subjectId, testId, pageable);
    }

    @GetMapping("/detail/{id}")
    @Operation(summary = "Chi tiết lớp thi")
    public IExamClassDetailDTO getDetailExamClass(@PathVariable(name = "id") Long id) {
        return examClassService.getExamClassDetail(id);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Cập nhật thông tin lớp thi")
    public void updateExamClass(@PathVariable(name = "id") Long id, @RequestBody @Validated ExamClassSaveReqDTO updateDTO) {
        examClassService.updateExamClass(id, updateDTO);
    }

    @PutMapping("/participant")
    @Operation(summary = "Cập nhật Giám thị / Thí sinh vào lớp thi")
    public void updateParticipantToExamClass(@RequestBody @Validated UserExamClassDTO userExamClassDTO) {
        examClassService.updateParticipantToExamClass(userExamClassDTO);
    }

    @GetMapping("/participant/list/{examClassId}")
    @Operation(summary = "Lấy danh sách Giám thị / Thí sinh trong lớp thi")
    public List<IExamClassParticipantDTO> getListExamClassParticipant(@PathVariable(name = "examClassId") Long examClassId,
        @RequestParam(name = "roleType") UserExamClassRoleEnum roleType) {
        return examClassService.getListExamClassParticipant(examClassId, roleType);
    }

    @GetMapping("/participant/export/{examClassId}")
    @Operation(summary = "Export danh sách SV / GV lớp thi")
    public ResponseEntity<InputStreamResource> exportExamClassParticipant(@PathVariable(name = "examClassId") Long examClassId,
        @RequestParam(name = "roleType") UserExamClassRoleEnum roleType) throws IOException {
        HttpHeaders headers = new HttpHeaders();
        String exportObject = roleType == UserExamClassRoleEnum.STUDENT ? "student" : "supervisor";
        String fileName = String.format("ExamClass_%s_%s_.xlsx", exportObject, LocalDateTime.now());
        headers.add(HttpHeaders.CONTENT_TYPE, MediaType.parseMediaType(String.join(";", Arrays.asList(Excel.CONTENT_TYPES))).toString());
        headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + fileName);
        return ResponseEntity.ok().headers(headers).body(examClassService.exportExamClassParticipant(examClassId, roleType));
    }

}
