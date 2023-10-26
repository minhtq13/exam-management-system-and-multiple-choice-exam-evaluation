package com.demo.app.controller;

import com.demo.app.dto.chapter.ChapterRequest;
import com.demo.app.dto.message.ResponseMessage;
import com.demo.app.service.SubjectService;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "/api/v1")
@Tag(name = "Chapter")
@RequiredArgsConstructor
public class ChapterController {

    private final SubjectService subjectService;

    @GetMapping(path = "/{code}/chapter/list")
    public ResponseEntity<?> getAllSubjectChapters(@Parameter @PathVariable(name = "code") String code){
        return ResponseEntity.ok().body(subjectService.getAllSubjectChapters(code));
    }

    @PostMapping(path = "/{code}/chapter/add")
    public ResponseEntity<?> addSubjectChapter(@Parameter @PathVariable(name = "code") String code,
                                               @RequestBody @Valid final ChapterRequest request){
        subjectService.addSubjectChapter(code, request);
        return new ResponseEntity<>(new ResponseMessage("Add subject's chapter successfully !"), HttpStatus.CREATED);
    }

    @PostMapping(path = "/{code}/chapters/add")
    public ResponseEntity<?> addSubjectChapters(@PathVariable(name = "code") String code,
                                                @RequestBody @Valid final List<ChapterRequest> request){
        subjectService.addSubjectChapters(code, request);
        return ResponseEntity.status(HttpStatus.OK)
                .body(new ResponseMessage("Add subject's chapters successfully !"));
    }

    @PutMapping(path = "/chapter/update/{id}")
    public ResponseEntity<?> updateChapter(@Parameter @PathVariable(name = "id") int chapterId,
                                           @RequestBody @Valid final ChapterRequest request){
        subjectService.updateSubjectChapter(chapterId, request);
        return new ResponseEntity<>(new ResponseMessage("Update chapter successfully !"), HttpStatus.OK);
    }

    @DeleteMapping(path = "/chapter/disable/{id}")
    public ResponseEntity<?> disableChapter(@Parameter @PathVariable(name = "id") int chapterId){
        subjectService.disableChapter(chapterId);
        return new ResponseEntity<>(new ResponseMessage("Disable chapter successfully !"), HttpStatus.OK);
    }

}
