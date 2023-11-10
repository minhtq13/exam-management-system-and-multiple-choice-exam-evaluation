package com.elearning.elearning_support.dtos.users.teacher;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TeacherImportDTO {

    String username;

    String email;

    String passwordRaw;

    String fullNameRaw;

    String birthDateRaw;

    String genderRaw;

    String phone;

    String code;

}
