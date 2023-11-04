package com.elearning.elearning_support.dtos.test;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class GenTestConfigDTO {

    Integer numTotalQuestion;

    Integer numEasyQuestion;

    Integer numMediumQuestion;

    Integer numHardQuestion;


}
