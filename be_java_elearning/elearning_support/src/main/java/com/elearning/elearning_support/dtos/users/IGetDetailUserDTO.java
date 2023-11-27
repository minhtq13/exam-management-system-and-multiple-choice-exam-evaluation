package com.elearning.elearning_support.dtos.users;

import java.util.Date;
import com.elearning.elearning_support.utils.DateUtils;
import com.fasterxml.jackson.annotation.JsonFormat;

public interface IGetDetailUserDTO {

    Long getId();

    String getName();

    Long getAvatarId();

    String getAvatarPath();

    String getFirstName();

    String getLastName();

    String getCode();

    String getIdentificationNum();

    String getIdentityType();

    String getAddress();

    String getGender();

    @JsonFormat(pattern = DateUtils.FORMAT_DATE_DD_MM_YYYY_SLASH, timezone = DateUtils.TIME_ZONE)
    Date getBirthDate();

    String getPhoneNumber();

    String getEmail();

    String getUserName();

    String getDepartment();

    Long getDepartmentId();

    @JsonFormat(pattern = DateUtils.FORMAT_DATE_DD_MM_YYYY_HH_MM_SS, timezone = DateUtils.TIME_ZONE)
    Date getCreatedAt();

    @JsonFormat(pattern = DateUtils.FORMAT_DATE_DD_MM_YYYY_HH_MM_SS, timezone = DateUtils.TIME_ZONE)
    Date getModifiedAt();

    Integer getUserType();
    String getRoleJson();

    Integer getCourseNum();

}
