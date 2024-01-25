package com.elearning.elearning_support.dtos.test.test_set;

import java.util.ArrayList;
import java.util.List;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ScoringPreviewResDTO {

    @Schema(description = "Mã temp data")
    String tmpFileCode;

    @Schema(description = "Chi tiết kết quả chấm ứng với tempCode")
    List<ScoringPreviewItemDTO> previews = new ArrayList<>();

    @Schema(description = "Cảnh báo kết quả chấm")
    List<String> warningMessages = new ArrayList<>();

    public ScoringPreviewResDTO(String tmpFileCode, List<ScoringPreviewItemDTO> previews) {
        this.tmpFileCode = tmpFileCode;
        this.previews = previews;
    }
}
