package com.elearning.elearning_support.dtos.fileAttach;


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
public class FileAttachDTO {

    @Schema(description = "Id file")
    Long id;

    @Schema(description = "Tên file")
    String fileName;

    @Schema(description = "Đường dẫn file")
    String filePath;

    @Schema(description = "Định dạng file")
    String fileExt;

}
