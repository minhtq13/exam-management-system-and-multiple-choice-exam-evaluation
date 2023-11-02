package com.elearning.elearning_support.dtos.chapter;

import java.util.ArrayList;
import java.util.List;
import javax.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SubjectChapterCreateDTO {

    @NotNull
    Long subjectId;

    List<ChapterCreateDTO> lstChapter = new ArrayList<>();


}
