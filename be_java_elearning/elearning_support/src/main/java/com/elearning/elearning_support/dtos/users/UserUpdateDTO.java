package com.elearning.elearning_support.dtos.users;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import com.elearning.elearning_support.enums.users.IdentityTypeEnum;
import com.elearning.elearning_support.enums.users.UserTypeEnum;
import com.elearning.elearning_support.utils.DateUtils;
import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;
import net.bytebuddy.build.HashCodeAndEqualsPlugin.Sorted;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserUpdateDTO {

    @Schema(description = "Loại giấy tờ chứng thực cá nhân")
    IdentityTypeEnum identityType;

    @Schema(description = "Số giấy tờ chứng thực")
    String identificationNumber;

    @Schema(description = "Đường dẫn ảnh đại diện")
    String avatarPath;

    @Schema(description = "Id ảnh đại diện đã tải lên")
    Long avatarId;

    @NotNull
    @NotBlank
    @Schema(description = "Họ và tên đệm")
    String firstName;

    @NotNull
    @NotBlank
    @Schema(description = "Tên")
    String lastName;

    @JsonFormat(pattern = DateUtils.FORMAT_DATE_DD_MM_YYYY_SLASH, timezone = DateUtils.TIME_ZONE)
    @NotNull
    @Schema(description = "Ngày sinh")
    Date birthDate;

    @Schema(description = "Địa chỉ")
    String address;

    @Schema(description = "Số điện thoại")
    @NotNull
    String phoneNumber;

    @Schema(description = "Email")
    String email;

    @Schema(description = "Danh sách quyền")
    Set<Long> lstRoleId = new HashSet<>();

    @Schema(description = "Id phòng/ ban đơn vị")
    @NotNull
    Long departmentId;

    @NotNull
    UserTypeEnum userType;

}
