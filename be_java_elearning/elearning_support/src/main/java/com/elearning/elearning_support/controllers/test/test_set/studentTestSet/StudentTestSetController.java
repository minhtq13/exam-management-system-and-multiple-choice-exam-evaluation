package com.elearning.elearning_support.controllers.test.test_set.studentTestSet;

import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.elearning.elearning_support.dtos.test.studentTestSet.StudentTestSetResultDTO;
import com.elearning.elearning_support.services.test.StudentTestSetService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/std-test-set")
@Tag(name = "APIs Kết quả thi (StudentTestSet)")
@RequiredArgsConstructor
public class StudentTestSetController {

    private final StudentTestSetService studentTestSetService;

    @GetMapping("/result/{examClassCode}")
    @Operation(summary = "Lấy kết quả thi theo mã lớp")
    public List<StudentTestSetResultDTO> getStudentTestSetResult(@PathVariable(name = "examClassCode") String examClassCode) {
        return studentTestSetService.getListStudentTestSetResult(examClassCode);
    }


}
