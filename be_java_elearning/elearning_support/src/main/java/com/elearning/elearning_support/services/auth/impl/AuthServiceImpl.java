package com.elearning.elearning_support.services.auth.impl;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.Objects;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import com.elearning.elearning_support.constants.message.errorKey.ErrorKey;
import com.elearning.elearning_support.constants.message.messageConst.MessageConst;
import com.elearning.elearning_support.constants.message.messageConst.MessageConst.Resources;
import com.elearning.elearning_support.dtos.auth.AuthValidationDTO;
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
    private RedisTemplate<String, Object> redisTemplate;

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

    public static final String AUTH_KEY_PREFIX = "AUTH_USER_ID";

    @Override
    public AuthValidationDTO saveLoginAuthInfo(User user, String ip) {
        // === CHECK TOKEN IN REDIS =====
        AuthValidationDTO redisAuth = (AuthValidationDTO) redisTemplate.opsForValue().get(AUTH_KEY_PREFIX + user.getId());
        if (Objects.isNull(redisAuth) || !jwtUtils.validateToken(redisAuth.getAccessToken())) {
            AuthInfo currentAuthInfo = authInfoRepository.findFirstByUserIdOrderByCreatedAtDesc(user.getId()).orElse(null);
            String accessToken = jwtUtils.generateJwt(user);
            String refreshToken = jwtUtils.generateRefreshToken(user);
            AuthValidationDTO authValidationDTO;
            if (Objects.isNull(currentAuthInfo)) { // not exist login history
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
                authValidationDTO = new AuthValidationDTO(newAuthInfo.getToken(), newAuthInfo.getRefreshToken(), newAuthInfo.getStatus());
            } else { // existed login history
                currentAuthInfo.setToken(!jwtUtils.validateToken(currentAuthInfo.getToken()) ? accessToken : currentAuthInfo.getToken()); // set status valid
                currentAuthInfo.setRefreshToken(refreshToken);
                currentAuthInfo.setRfTokenExpiredAt(new Date(DateUtils.getCurrentDateTime().getTime() + refreshTokenExpiredMs));
                currentAuthInfo.setStatus(TOKEN_VALID_STATUS);
                currentAuthInfo.setLastLoginAt(LocalDateTime.now());
                currentAuthInfo = authInfoRepository.save(currentAuthInfo);
                authValidationDTO = new AuthValidationDTO(currentAuthInfo.getToken(), currentAuthInfo.getRefreshToken(),
                    currentAuthInfo.getStatus());
            }
            redisTemplate.opsForValue().set(AUTH_KEY_PREFIX + user.getId(), authValidationDTO);
            return authValidationDTO;
        } else {
            return redisAuth;
        }
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
            authInfo = authInfoRepository.save(authInfo);
            redisTemplate.opsForValue()
                .set(AUTH_KEY_PREFIX + user.getId(), new AuthValidationDTO(authInfo.getToken(), authInfo.getRefreshToken(), authInfo.getStatus()));
        }
        return new RefreshTokenResDTO(authInfo.getToken(), authInfo.getRefreshToken());
    }
}
