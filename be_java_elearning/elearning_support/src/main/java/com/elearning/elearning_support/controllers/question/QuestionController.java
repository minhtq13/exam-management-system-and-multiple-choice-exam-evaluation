package com.elearning.elearning_support.controllers.question;

import java.util.List;
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
import org.springframework.web.multipart.MultipartFile;
import com.elearning.elearning_support.dtos.question.QuestionListCreateDTO;
import com.elearning.elearning_support.dtos.question.QuestionListDTO;
import com.elearning.elearning_support.dtos.question.QuestionUpdateDTO;
import com.elearning.elearning_support.services.question.QuestionService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/question")
@RequiredArgsConstructor
public class QuestionController {

    private final QuestionService questionService;

    @PostMapping
    @Operation(description = "Tạo các câu hỏi")
    public void createQuestion(@RequestBody QuestionListCreateDTO createDTO) {
        questionService.createListQuestion(createDTO);
    }

    @PostMapping(value = "/import", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(description = "Import câu hỏi")
    public ResponseEntity<?> importQuestion(@RequestParam(name = "file") MultipartFile file) {
        return ResponseEntity.ok("");
    }

    @GetMapping
    @Operation(description = "Danh sách câu hỏi")
    public List<QuestionListDTO> getListQuestion(
        @RequestParam(name = "subjectId", required = false, defaultValue = "-1") Long subjectId,
        @RequestParam(name = "subjectCode", required = false, defaultValue = "ALL") String subjectCode,
        @RequestParam(name = "chapterCode", required = false, defaultValue = "ALL") String chapterCode,
        @RequestParam(name = "chapterId", required = false, defaultValue = "-1") Long chapterId) {
        return questionService.getListQuestion(subjectId, subjectCode, chapterId, chapterCode);
    }

    @PutMapping("/{questionId}")
    @Operation(description = "Cập nhật câu hỏi")
    public void updateQuestion(@PathVariable(name = "questionId") Long questionId,
        @RequestBody @Validated QuestionUpdateDTO updateDTO) {
        questionService.updateQuestion(questionId, updateDTO);
    }
}
