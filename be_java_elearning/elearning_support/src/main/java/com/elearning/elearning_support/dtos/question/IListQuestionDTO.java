package com.elearning.elearning_support.dtos.question;

public interface IListQuestionDTO {

    Long getId();

    String getCode();

    String getContent();

    Integer getLevel();

    String getLstImageJson();

    String getLstAnswerJson();

    Boolean getIsUsed();
}
