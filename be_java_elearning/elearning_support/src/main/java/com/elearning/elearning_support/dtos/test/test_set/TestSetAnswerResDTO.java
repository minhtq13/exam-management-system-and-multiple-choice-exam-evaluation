package com.elearning.elearning_support.dtos.test.test_set;

import java.io.Serializable;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TestSetAnswerResDTO implements Serializable {

    Long answerId;

    Integer answerNo;

    String content;

}
