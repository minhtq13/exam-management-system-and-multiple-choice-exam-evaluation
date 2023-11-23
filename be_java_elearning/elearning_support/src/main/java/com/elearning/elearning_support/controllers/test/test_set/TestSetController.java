package com.elearning.elearning_support.controllers.test.test_set;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.elearning.elearning_support.dtos.test.test_set.ScoringTestSetReqDTO;
import com.elearning.elearning_support.dtos.test.test_set.TestSetDetailDTO;
import com.elearning.elearning_support.dtos.test.test_set.TestSetGenerateReqDTO;
import com.elearning.elearning_support.dtos.test.test_set.TestSetPreviewDTO;
import com.elearning.elearning_support.dtos.test.test_set.TestSetSearchReqDTO;
import com.elearning.elearning_support.dtos.test.test_set.TestSetUpdateDTO;
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
    public List<TestSetPreviewDTO> genTestSetFromTest(@RequestBody TestSetGenerateReqDTO generateDTO) {
        return testSetService.generateTestSet(generateDTO);
    }

    @PostMapping(value = "/export", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    @Operation(summary = "Export đề thi ra file word")
    public ResponseEntity<InputStreamResource> exportTestSetToWord(@RequestBody TestSetSearchReqDTO searchReqDTO) throws IOException {
        HttpHeaders headers = new HttpHeaders();
        String fileName = String.format("TestSetExport_%s_.docx", LocalDateTime.now());
        headers.add(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_OCTET_STREAM_VALUE);
        headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + fileName);
        return ResponseEntity.ok().headers(headers).body(testSetService.exportTestSet(searchReqDTO));
    }

    @PostMapping("/detail")
    @Operation(summary = "Lấy chi tiết đề thi")
    public TestSetDetailDTO getTestSetDetail(@RequestBody TestSetSearchReqDTO searchReqDTO) {
        return testSetService.getTestSetDetail(searchReqDTO);
    }

    @PutMapping
    @Operation(summary = "Cập nhật đề thi")
    public void updateTestSet(@RequestBody @Validated TestSetUpdateDTO updateDTO) {
        testSetService.updateTestSet(updateDTO);
    }


    /*
    ==================================== TEST SET SCORING CONTROLLER =================================
     */
    @PostMapping("/scoring")
    @Operation(summary = "Chấm điểm bài thi chắc nghiệm")
    public void scoringStudentTestSet(@RequestBody @Validated ScoringTestSetReqDTO scoringReqDTO){
        testSetService.scoreStudentTestSet(scoringReqDTO.getHandledTestSets());
    }


}
