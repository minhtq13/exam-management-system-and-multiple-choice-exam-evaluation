package com.elearning.elearning_support.services.auth.impl;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.Objects;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Service;
import com.elearning.elearning_support.constants.message.errorKey.ErrorKey;
import com.elearning.elearning_support.constants.message.messageConst.MessageConst;
import com.elearning.elearning_support.constants.message.messageConst.MessageConst.Resources;
import com.elearning.elearning_support.dtos.auth.refresh.RefreshTokenResDTO;
import com.elearning.elearning_support.entities.auth.AuthInfo;
import com.elearning.elearning_support.entities.users.User;
import com.elearning.elearning_support.exceptions.CustomBadCredentialsException;
import com.elearning.elearning_support.exceptions.exceptionFactory.ExceptionFactory;
import com.elearning.elearning_support.repositories.auth.AuthInfoRepository;
import com.elearning.elearning_support.security.jwt.JwtUtils;
import com.elearning.elearning_support.services.auth.AuthInfoService;
import com.elearning.elearning_support.utils.DateUtils;

@Service
public class AuthServiceImpl implements AuthInfoService {

    @Autowired
    private AuthInfoRepository authInfoRepository;

    @Autowired
    private ExceptionFactory exceptionFactory;

    @Autowired
    private JwtUtils jwtUtils;

    @Value("${jwt.refreshTokenExpiredMs}")
    private Long refreshTokenExpiredMs;

    public static final Integer TOKEN_INVALID_STATUS = 0;

    public static final Integer TOKEN_VALID_STATUS = 1;

    @Override
    public AuthInfo saveLoginAuthInfo(User user, String ip) {
        AuthInfo currentAuthInfo = authInfoRepository.findFirstByUserIdOrderByCreatedAtDesc(user.getId()).orElse(null);
        String accessToken = jwtUtils.generateJwt(user);
        String refreshToken = jwtUtils.generateRefreshToken(user);
        boolean tokenIsValid = jwtUtils.validateToken(accessToken);
        if (Objects.isNull(currentAuthInfo) || !tokenIsValid) {
            if (Objects.nonNull(currentAuthInfo)) {
                currentAuthInfo.setStatus(TOKEN_INVALID_STATUS); // set status invalid
                authInfoRepository.save(currentAuthInfo);
            }
            AuthInfo newAuthInfo = AuthInfo.builder()
                .userId(user.getId())
                .token(accessToken)
                .ipAddress(ip)
                .status(TOKEN_VALID_STATUS)
                .createdAt(LocalDateTime.now())
                .lastLoginAt(LocalDateTime.now())
                .refreshToken(refreshToken)
                .rfTokenExpiredAt(new Date(DateUtils.getCurrentDateTime().getTime() + refreshTokenExpiredMs))
                .build();
            authInfoRepository.save(newAuthInfo);
            return newAuthInfo;
        }
        currentAuthInfo.setLastLoginAt(LocalDateTime.now());
        return authInfoRepository.save(currentAuthInfo);
    }

    @Override
    public AuthInfo findByUserId(Long userId) {
        return authInfoRepository.findFirstByUserIdOrderByCreatedAtDesc(userId).orElse(null);
    }

    @Override
    public RefreshTokenResDTO refreshAccessToken(String refreshToken) {
        AuthInfo authInfo = authInfoRepository.findByRefreshToken(refreshToken)
            .orElseThrow(() -> exceptionFactory.resourceNotFoundException(MessageConst.AuthInfo.NOT_FOUND, Resources.AUTH_INFORMATION,
                MessageConst.RESOURCE_NOT_FOUND, ErrorKey.AuthInfo.REFRESH_TOKEN));
        if (!jwtUtils.validateToken(authInfo.getToken()) || Objects.equals(authInfo.getStatus(), TOKEN_INVALID_STATUS)) {
            User user = authInfo.getUser();
            authInfo.setToken(jwtUtils.generateJwt(user));
            authInfo.setStatus(TOKEN_VALID_STATUS);
            // check refresh token if expired -> gen new refresh token
            if (authInfo.getRfTokenExpiredAt().before(DateUtils.getCurrentDateTime())) {
                throw new CustomBadCredentialsException(MessageConst.AuthInfo.REFRESH_TOKEN_EXPIRED, Resources.AUTH_INFORMATION,
                    ErrorKey.AuthInfo.REFRESH_TOKEN);
            }
        }
        authInfo = authInfoRepository.save(authInfo);
        return new RefreshTokenResDTO(authInfo.getToken(), authInfo.getRefreshToken());
    }
}
