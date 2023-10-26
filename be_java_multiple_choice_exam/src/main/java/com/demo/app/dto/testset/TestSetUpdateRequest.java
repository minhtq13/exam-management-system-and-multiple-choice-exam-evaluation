package com.demo.app.dto.testset;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
public class TestSetUpdateRequest {

    private String testNo;

    private int duration;

    private String testDay;

    private List<QuestionPosition> questionPositions;

    @Data
    @NoArgsConstructor
    public static class QuestionPosition {

        private int id;

        private int questionNo;

        private List<AnswerPosition> answerPositions;

        @Data
        @NoArgsConstructor
        public static class AnswerPosition{

            private int id;

            private String answerNo;
        }

    }

}
