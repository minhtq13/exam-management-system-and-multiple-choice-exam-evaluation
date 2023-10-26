package com.elearning.elearning_support.services.auth;

import org.springframework.stereotype.Service;
import com.elearning.elearning_support.entities.auth.AuthInfo;

@Service
public interface AuthInfoService {

    /**
     * Lưu thông tin xác thực người dùng
     */
    AuthInfo saveAuthInfo(Long userId, String token, String ip);

    /**
     * Tìm thông tin xác thực người dùng
     */
    AuthInfo findByUserId(Long userId);

}
