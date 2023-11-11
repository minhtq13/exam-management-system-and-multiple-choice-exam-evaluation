package com.elearning.elearning_support.services.auth.impl;

import java.time.LocalDateTime;
import java.util.Objects;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.elearning.elearning_support.entities.auth.AuthInfo;
import com.elearning.elearning_support.repositories.auth.AuthInfoRepository;
import com.elearning.elearning_support.security.jwt.JwtUtils;
import com.elearning.elearning_support.services.auth.AuthInfoService;

@Service
public class AuthServiceImpl implements AuthInfoService {

    @Autowired
    private AuthInfoRepository authInfoRepository;

    @Autowired
    private JwtUtils jwtUtils;

    public static final Integer TOKEN_INVALID_STATUS = 0;

    public static final Integer TOKEN_VALID_STATUS = 1;

    @Override
    public void saveAuthInfo(Long userId, String token, String ip) {
        AuthInfo currentAuthInfo = authInfoRepository.findFirstByUserIdOrderByCreatedAtDesc(userId).orElse(null);
        boolean tokenIsValid = jwtUtils.validateToken(token);
        if(Objects.isNull(currentAuthInfo) || !tokenIsValid){
            if(Objects.nonNull(currentAuthInfo)){
                currentAuthInfo.setStatus(TOKEN_INVALID_STATUS); // set status invalid
                authInfoRepository.save(currentAuthInfo);
            }
            AuthInfo newAuthInfo = AuthInfo.builder().userId(userId).token(token).ipAddress(ip)
                .status(TOKEN_VALID_STATUS).createdAt(LocalDateTime.now()).lastLoginAt(LocalDateTime.now()).build();
            authInfoRepository.save(newAuthInfo);
            return;
        }
        currentAuthInfo.setLastLoginAt(LocalDateTime.now());
        authInfoRepository.save(currentAuthInfo);
    }

    @Override
    public AuthInfo findByUserId(Long userId) {
        return authInfoRepository.findFirstByUserIdOrderByCreatedAtDesc(userId).orElse(null);
    }
}
