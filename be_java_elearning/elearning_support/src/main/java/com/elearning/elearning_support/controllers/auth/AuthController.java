package com.elearning.elearning_support.controllers.auth;

import java.util.Date;
import java.util.Objects;
import java.util.Set;
import javax.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.elearning.elearning_support.constants.message.errorKey.ErrorKey;
import com.elearning.elearning_support.constants.message.messageConst.MessageConst;
import com.elearning.elearning_support.dtos.auth.login.LoginRequest;
import com.elearning.elearning_support.dtos.auth.login.LoginResponse;
import com.elearning.elearning_support.dtos.auth.refresh.RefreshTokenResDTO;
import com.elearning.elearning_support.dtos.users.ProfileUserDTO;
import com.elearning.elearning_support.entities.auth.AuthInfo;
import com.elearning.elearning_support.exceptions.CustomBadCredentialsException;
import com.elearning.elearning_support.security.models.CustomUserDetails;
import com.elearning.elearning_support.services.auth.AuthInfoService;
import com.elearning.elearning_support.services.users.UserService;
import com.elearning.elearning_support.utils.auth.AuthUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "APIs Xác thực/phân quyền (Authentication/Authorization)")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final AuthenticationManager authenticationManager;

    private final AuthInfoService authInfoService;

    private final UserService userService;


    /**
     * Login API -> JWT Token
     */
    @PostMapping("/login")
    @Operation(summary = "Login vào hệ thống")
    public ResponseEntity<?> login(@RequestBody @Validated LoginRequest loginInfo, HttpServletRequest request) {
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(loginInfo.getUsername(),
            loginInfo.getPassword());
        Authentication authentication = authenticationManager.authenticate(authenticationToken);
        SecurityContextHolder.getContext().setAuthentication(authentication);
        // get user details
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        if (userDetails == null) {
            throw new BadCredentialsException("Username/Password is incorrect");
        }
        // Init request values
        String ipAddress = AuthUtils.getIpAddress(request);
        // update auth info in db
        AuthInfo authInfo = authInfoService.saveLoginAuthInfo(userDetails.getUser(), ipAddress);

        if (Objects.isNull(authInfo.getToken()) || Objects.isNull(authInfo.getRefreshToken())) {
            throw new CustomBadCredentialsException(MessageConst.AuthInfo.WRONG_USERNAME_PASSWORD, MessageConst.UNAUTHORIZED,
                String.format("%s/%s", ErrorKey.AuthInfo.USERNAME, ErrorKey.AuthInfo.PASSWORD));
        }
        Set<String> roles = userDetails.getRoles();
        return ResponseEntity.ok(LoginResponse.builder()
            .issuedAt(new Date())
            .accessToken(authInfo.getToken())
            .refreshToken(authInfo.getRefreshToken())
            .roles(roles)
            .build());
    }

    @GetMapping("/profile")
    @Operation(summary = "Lấy thông tin user đăng nhập")
    public ProfileUserDTO getProfile() {
        return userService.getUserProfile();
    }

    @PostMapping("/token/refresh")
    @Operation(summary = "Refresh token")
    public RefreshTokenResDTO refreshToken(@RequestHeader(name = "refreshToken") String refreshToken) {
        return authInfoService.refreshAccessToken(refreshToken);
    }
}
