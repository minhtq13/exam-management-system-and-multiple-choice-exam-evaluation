package com.elearning.elearning_support.utils.auth;

import java.util.Objects;
import java.util.Set;
import javax.servlet.http.HttpServletRequest;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.StringUtils;
import com.elearning.elearning_support.entities.users.User;
import com.elearning.elearning_support.security.models.CustomUserDetails;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class AuthUtils {


    private static final String[] HEADERS_TO_TRY = {
        "X-Forwarded-For",
        "Proxy-Client-IP",
        "WL-Proxy-Client-IP",
        "HTTP_X_FORWARDED_FOR",
        "HTTP_X_FORWARDED",
        "HTTP_X_CLUSTER_CLIENT_IP",
        "HTTP_CLIENT_IP",
        "HTTP_FORWARDED_FOR",
        "HTTP_FORWARDED",
        "HTTP_VIA",
        "REMOTE_ADDR"
    };

    /**
     * Get current user id
     *
     * @return : current user id
     */
    public static Long getCurrentUserId() {
        try {
            User currentUser = getCurrentUser();
            return Objects.nonNull(currentUser) ? currentUser.getId() : null;
        } catch (Exception ex) {
            log.error("Get current user id error");
            return null;
        }
    }

    /**
     * Get current user
     *
     * @return : current user
     */
    public static User getCurrentUser() {
        try {
            CustomUserDetails userDetails = (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            return userDetails.getUser();
        } catch (Exception ex) {
            log.error("Get current user id error");
            return null;
        }
    }

    /**
     * Get lst role code of the current user
     */
    public static Set<String> getCurrentUserRoles() {
        try {
            CustomUserDetails userDetails = (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            return userDetails.getRoles();
        } catch (Exception ex) {
            ex.printStackTrace();
            log.error("Get current user's roles error");
            return null;
        }
    }

    /**
     * Get client's request ip address
     */
    public static String getIpAddress(HttpServletRequest request){
        for(String header : HEADERS_TO_TRY){
            String ipAddress = request.getHeader(header);
            if(Objects.nonNull(ipAddress) && StringUtils.hasText(ipAddress) && !"unknown".equalsIgnoreCase(ipAddress)){
                return ipAddress;
            }
        }
        return request.getRemoteAddr();
    }

}
