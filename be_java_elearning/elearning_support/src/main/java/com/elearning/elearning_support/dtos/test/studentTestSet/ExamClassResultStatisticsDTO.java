package com.elearning.elearning_support.dtos.test.studentTestSet;

import java.util.List;
import com.elearning.elearning_support.dtos.common.CommonNameValueDTO;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ExamClassResultStatisticsDTO {

    List<StudentTestSetResultDTO> results;

    List<CommonNameValueDTO> pieChart;

    List<CommonNameValueDTO> columnChart;


}
