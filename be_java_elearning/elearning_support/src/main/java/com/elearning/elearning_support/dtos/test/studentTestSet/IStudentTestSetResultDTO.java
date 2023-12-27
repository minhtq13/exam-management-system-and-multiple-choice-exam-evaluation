package com.elearning.elearning_support.dtos.test.studentTestSet;

public interface IStudentTestSetResultDTO {

    Long getId();

    Long getStudentId();

    String getStudentName();

    String getStudentCode();

    Long getTestSetId();

    String getTestSetCode();

    Long getExamClassId();

    String getExamClassCode();

    Integer getNumTestSetQuestions();

    Integer getNumMarkedAnswers();

    Integer getNumCorrectAnswers();

    Double getTotalPoints();

    String getHandledSheetImg();
}
