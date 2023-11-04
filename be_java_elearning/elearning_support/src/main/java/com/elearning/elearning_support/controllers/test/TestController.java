package com.elearning.elearning_support.controllers.test;

import java.util.Date;
import java.util.List;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.format.annotation.DateTimeFormat.ISO;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.elearning.elearning_support.dtos.test.ITestListDTO;
import com.elearning.elearning_support.dtos.test.TestReqDTO;
import com.elearning.elearning_support.enums.commons.StatusEnum;
import com.elearning.elearning_support.services.test.TestService;
import com.elearning.elearning_support.utils.DateUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/test")
@RequiredArgsConstructor
public class TestController {

    private final TestService testService;

    @PostMapping("/create")
    @Operation(description = "Tạo kỳ thi với bộ câu hỏi random trong một môn học")
    @Tag(name = "Tạo kỳ thi bộ câu hỏi đã chọn")
    public void createTest(@RequestBody @Validated TestReqDTO createDTO) {
        testService.createTest(createDTO);
    }

    @PostMapping("/create/random")
    @Operation(description = "Tạo kỳ thi với bộ câu hỏi chọn trước")
    @Tag(name = "Tạo kỳ thi các câu hỏi của các chương")
    public void createRandomTest(@RequestBody @Validated TestReqDTO createDTO) {
        testService.createRandomTest(createDTO);
    }

    @PutMapping("/{testId}")
    @Operation(description = "Cập nhật kỳ thi")
    @Tag(name = "Cập nhật kỳ thi")
    public void updateTest(@PathVariable(name = "testId") Long testId,
        @RequestBody @Validated TestReqDTO updateDTO) {
        testService.updateTest(testId, updateDTO);
    }

    @GetMapping
    @Operation(description = "Lấy danh sách các kỳ thi")
    @Tag(name = "Danh sách kỳ thi")
    public List<ITestListDTO> getListTest(
        @RequestParam(name = "subjectId", required = false, defaultValue = "-1") Long subjectId,
        @RequestParam(name = "subjectCode", required = false, defaultValue = "ALL") String subjectCode,
        @DateTimeFormat(pattern = DateUtils.FORMAT_DATE_DD_MM_YYYY_HH_MM, iso = ISO.DATE_TIME)
        @RequestParam(name = "startTime", required = false, defaultValue = "01/01/1970 00:00") Date startTime,
        @DateTimeFormat(pattern = DateUtils.FORMAT_DATE_DD_MM_YYYY_HH_MM, iso = ISO.DATE_TIME)
        @RequestParam(name = "endTime", required = false, defaultValue = "01/01/1970 00:00") Date endTime) {
        return testService.getListTest(subjectId, subjectCode, startTime, endTime);
    }

    @PutMapping("/status/{testId}")
    @Operation(description = "Đổi trạng thái hiển thị kỳ thi")
    @Tag(name = "Đổi trạng thái hiển thị kỳ thi")
    public void switchTestStatus(@PathVariable(name = "testId") Long testId,
        @RequestParam(name = "newStatus") StatusEnum status) {
        testService.switchTestStatus(testId, status);
    }


}
