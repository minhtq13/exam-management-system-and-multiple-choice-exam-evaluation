package com.elearning.elearning_support.controllers.test.test_set.studentTestSet;

import java.io.IOException;
import java.util.Arrays;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.elearning.elearning_support.dtos.CustomInputStreamResource;
import com.elearning.elearning_support.dtos.test.studentTestSet.ExamClassResultStatisticsDTO;
import com.elearning.elearning_support.services.test.StudentTestSetService;
import com.elearning.elearning_support.utils.file.FileUtils.Excel;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/std-test-set")
@Tag(name = "APIs Kết quả thi (StudentTestSet)")
@RequiredArgsConstructor
public class StudentTestSetController {

    private final StudentTestSetService studentTestSetService;

    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'TEACHER')")
    @GetMapping("/result/{examClassCode}")
    @Operation(summary = "Lấy kết quả thi theo mã lớp")
    public ExamClassResultStatisticsDTO getStudentTestSetResult(@PathVariable(name = "examClassCode") String examClassCode) {
        return studentTestSetService.getListStudentTestSetResult(examClassCode);
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'TEACHER')")
    @GetMapping(value = "/result/export/{examClassCode}", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    @Operation(summary = "Export kết quả thi theo lớp")
    public ResponseEntity<InputStreamResource> exportTeacher(@PathVariable(name = "examClassCode") String examClassCode
    ) throws IOException {
        HttpHeaders headers = new HttpHeaders();
        CustomInputStreamResource resource = studentTestSetService.exportStudentTestSetResult(examClassCode);
        headers.add(HttpHeaders.CONTENT_TYPE, MediaType.parseMediaType(String.join(";", Arrays.asList(Excel.CONTENT_TYPES))).toString());
        headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + resource.getFileName());
        return ResponseEntity.ok().headers(headers).body(resource.getResource());
    }




}
