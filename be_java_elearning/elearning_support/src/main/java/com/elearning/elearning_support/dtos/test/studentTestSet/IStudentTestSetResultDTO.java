package com.elearning.elearning_support.dtos.test.studentTestSet;

public interface IStudentTestSetResultDTO {

    Long getId();

    Long getStudentId();

    String getStudentName();

    Long getTestSetId();

    String getTestSetCode();

    Long getExamClassId();

    String getExamClassCode();

    Integer getNumMarkedAnswers();

    Integer getNumCorrectAnswers();

    Double getTotalPoints();

    String getHandledSheetImg();
}
