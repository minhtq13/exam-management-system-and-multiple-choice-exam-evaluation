package com.elearning.elearning_support.services.auth;

import org.springframework.stereotype.Service;
import com.elearning.elearning_support.dtos.auth.refresh.RefreshTokenResDTO;
import com.elearning.elearning_support.entities.auth.AuthInfo;
import com.elearning.elearning_support.entities.users.User;

@Service
public interface AuthInfoService {

    /**
     * Lưu thông tin xác thực người dùng
     */
    AuthInfo saveLoginAuthInfo(User user, String ip);

    /**
     * Tìm thông tin xác thực người dùng
     */
    AuthInfo findByUserId(Long userId);

    /**
     * verify refresh token
     */
    RefreshTokenResDTO refreshAccessToken(String refreshToken);

}
