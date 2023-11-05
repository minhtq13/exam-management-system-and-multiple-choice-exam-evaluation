package com.elearning.elearning_support.controllers.chapter;

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
import com.elearning.elearning_support.dtos.chapter.ChapterUpdateDTO;
import com.elearning.elearning_support.dtos.chapter.SubjectChapterCreateDTO;
import com.elearning.elearning_support.enums.commons.StatusEnum;
import com.elearning.elearning_support.services.chapter.ChapterService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/chapter")
@Tag(name = "APIs Chương (chapter)")
@RequiredArgsConstructor
public class ChapterController {

    private final ChapterService chapterService;

    @GetMapping(path = "/{subjectId}")
    @Operation(description = "Lấy danh sách chương của một môn học")
    public ResponseEntity<?> getListChapter(@Parameter @PathVariable(name = "subjectId") Long subjectId) {
        return ResponseEntity.ok("");
    }

    @PostMapping
    @Operation(description = "Tạo các chương của môn học")
    public void createChapter(@RequestBody @Validated SubjectChapterCreateDTO createDTO) {
    }

    @PutMapping("/{chapterId}")
    @Operation(description = "Cập nhật chương")
    public void updateChapter(@PathVariable(name = "chapterId") Long chapterId,
        @RequestBody ChapterUpdateDTO updateDTO) {
    }

    @PutMapping("/switch-status")
    @Operation(description = "Cập nhật chương")
    public void changeChapterStatus(@RequestParam(name = "id") Long chapterId,
        @RequestParam(name = "status") StatusEnum status) {

    }
}
