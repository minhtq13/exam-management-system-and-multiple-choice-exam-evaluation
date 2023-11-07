package com.elearning.elearning_support.controllers.test.test_set;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.elearning.elearning_support.dtos.test.test_set.TestSetDetailDTO;
import com.elearning.elearning_support.dtos.test.test_set.TestSetGenerateReqDTO;
import com.elearning.elearning_support.dtos.test.test_set.TestSetSearchReqDTO;
import com.elearning.elearning_support.services.test.TestSetService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/test-set")
@Tag(name = "APIs Đề thi (TestSet)")
@RequiredArgsConstructor
public class TestSetController {

    private final TestSetService testSetService;

    @PostMapping("/generate")
    @Operation(summary = "Gen đề thi trong kỳ thi")
    public void genTestSetFromTest(@RequestBody TestSetGenerateReqDTO generateDTO) {
        testSetService.generateTestSet(generateDTO);
    }

    @PostMapping(value = "/export", consumes = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Export đề thi ra file word")
    public ResponseEntity<?> exportTestSetToWord(@RequestBody TestSetSearchReqDTO searchReqDTO) {
        return ResponseEntity.ok("");
    }

    @GetMapping("/detail")
    @Operation(summary = "Lấy chi tiết đề thi")
    public TestSetDetailDTO getTestSetDetail(@RequestBody TestSetSearchReqDTO searchReqDTO) {
        return testSetService.getTestSetDetail(searchReqDTO);
    }

    @PutMapping
    @Operation(summary = "Cập nhật đề thi")
    public void updateTestSet() {

    }

}
