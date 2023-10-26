package com.demo.app.controller;

import com.demo.app.dto.message.ResponseMessage;
import com.demo.app.dto.testset.TestSetUpdateRequest;
import com.demo.app.service.TestSetService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.time.LocalDate;

@RestController
@RequestMapping(path = "/api/v1/test-set")
@Tag(name = "Test-Set", description = "TestSet API management")
@RequiredArgsConstructor
public class TestSetController {

    private final TestSetService testSetService;

    @PostMapping(path = "/{testId}/create")
    public ResponseEntity<?> createTestSetFromTest(@PathVariable(name = "testId") int testId,
                                                   @RequestParam final Integer testSetQuantity) throws InterruptedException {
        var testSetIds = testSetService.createTestSetFromTest(testId, testSetQuantity);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(testSetIds);
    }

    @GetMapping(path = "/word/export/{testId}/{testNo}")
    public ResponseEntity<?> downloadTestSetWordFile(@PathVariable(name = "testId") Integer testId,
                                                     @PathVariable(name = "testNo") String testNo) throws IOException {
        var resource = new InputStreamResource(testSetService.exportTestSetToWord(testId, testNo));
        var filename = "Test" + LocalDate.now() + ".docx";
        var headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        headers.setContentDisposition(ContentDisposition
                .attachment()
                .filename(filename)
                .build());
        return ResponseEntity.ok()
                .headers(headers)
                .body(resource);
    }

    @GetMapping(path = "/detail/{testId}/{testNo}")
    public ResponseEntity<?> getTestSetDetail(@PathVariable(name = "testId") Integer testId,
                                              @PathVariable(name = "testNo") String testNo) {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(testSetService.getTestSetDetail(testId, testNo));
    }

    @PutMapping(path = "/update/{testSetId}")
    public ResponseEntity<?> updateTestSet(@PathVariable(name = "testSetId") Integer testSetId,
                                           @RequestBody TestSetUpdateRequest request){
        testSetService.updateTestSet(testSetId, request);
        return ResponseEntity.status(HttpStatus.OK)
                .body(new ResponseMessage("Update TestSet Successfully !"));
    }
}
