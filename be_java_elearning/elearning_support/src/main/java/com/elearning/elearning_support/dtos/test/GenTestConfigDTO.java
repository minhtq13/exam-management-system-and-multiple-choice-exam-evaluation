package com.elearning.elearning_support.dtos.test;

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
public class GenTestConfigDTO {

    @NotNull
    Integer numTotalQuestion;

    @NotNull
    Integer numEasyQuestion;

    @NotNull
    Integer numMediumQuestion;

    @NotNull
    Integer numHardQuestion;


}