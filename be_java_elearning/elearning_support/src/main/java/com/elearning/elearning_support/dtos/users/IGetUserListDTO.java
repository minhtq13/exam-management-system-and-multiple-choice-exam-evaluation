package com.elearning.elearning_support.dtos.users;


public interface IGetUserListDTO {

    Long getId();

    String getCode();

    Integer getIdentityType();

    String getGender();

    String getIdentificationNumber();

    String getAvatarPath();

    Long getAvatarId();

    String getFirstName();

    String getLastName();

    java.util.Date getBirthDate();

    String getAddress();

    String getPhoneNumber();

    String getEmail();

    Long getDepartmentId();

    String getDepartmentName();

    String getUserType();

    Integer getCourseNum();
}
