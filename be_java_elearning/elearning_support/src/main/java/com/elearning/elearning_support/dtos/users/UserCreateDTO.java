package com.elearning.elearning_support.dtos.users;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import com.elearning.elearning_support.enums.users.IdentityTypeEnum;
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
public class UserCreateDTO {

    @NotNull
    IdentityTypeEnum identityType;

    @NotNull
    @NotBlank
    String identificationNumber;

    String avatarPath;

    String code;

    @NotNull
    @NotBlank
    String firstName;

    @NotNull
    @NotBlank
    String lastName;

    String title;

    @JsonFormat(pattern = DateUtils.FORMAT_DATE_DD_MM_YYYY_SLASH, timezone = DateUtils.TIME_ZONE)
    @NotNull
    Date birthDate;
    String address;
    @NotNull
    String phoneNumber;
    String email;
    Set<Long> lstRoleId = new HashSet<>();

    @NotNull
    Long departmentId;

}
