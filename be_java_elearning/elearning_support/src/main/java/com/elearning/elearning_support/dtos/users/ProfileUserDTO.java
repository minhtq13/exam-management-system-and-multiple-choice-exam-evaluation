package com.elearning.elearning_support.dtos.users;

import java.util.Date;
import com.elearning.elearning_support.utils.DateUtils;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProfileUserDTO {

    Long id;

    String name;

    String code;

    String identificationNum;

    String identityType;

    String address;

    @JsonFormat(pattern = DateUtils.FORMAT_DATE_DD_MM_YYYY_SLASH, timezone = DateUtils.TIME_ZONE)
    Date birthDate;

    String phoneNumber;

    String email;

    String userName;

    String role;

    String department;

    Long departmentId;

}
