package com.elearning.elearning_support.controllers.test.test_set;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/test-set")
@Tag(name = "APIs Đề thi (TestSet)")
@RequiredArgsConstructor
public class TestSetController {

}
