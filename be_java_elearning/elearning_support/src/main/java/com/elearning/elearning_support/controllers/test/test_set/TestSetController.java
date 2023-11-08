package com.elearning.elearning_support.controllers.test.test_set;

import java.io.IOException;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
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

    @PostMapping(value = "/export", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    @Operation(summary = "Export đề thi ra file word")
    public ResponseEntity<InputStreamResource> exportTestSetToWord(@RequestBody TestSetSearchReqDTO searchReqDTO) throws IOException {
        HttpHeaders headers = new HttpHeaders();
        String fileName = "TestSetExport.docx";
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        headers.setContentDisposition(ContentDisposition.attachment().filename(fileName).build());
        return ResponseEntity.ok().headers(headers).body(testSetService.exportTestSet(searchReqDTO));
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
