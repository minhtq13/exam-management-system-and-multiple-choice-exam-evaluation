package com.elearning.elearning_support.dtos.fileAttach.importFile;

import java.util.ArrayList;
import java.util.List;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ImportResponseDTO {

    String message;

    Integer status;

    List<RowErrorDTO> errorRows = new ArrayList<>();

}
