package com.demo.app.dto.studentTest;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class StudentTestResultResponse {

    private String testNo;

    private List<StudentTestQuestion> questions;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class StudentTestQuestion {

        private int questionNo;

        private String topicText;

        private String topicImage;

        private boolean isCorrected;

        private List<StudentTestAnswer> answers;

        @Getter
        @Setter
        @NoArgsConstructor
        @AllArgsConstructor
        @Builder
        public static class StudentTestAnswer {

            private String answerNo;

            private String content;

            private boolean isSelected;

        }
    }

}
