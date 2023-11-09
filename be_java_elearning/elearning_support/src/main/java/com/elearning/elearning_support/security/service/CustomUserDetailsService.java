package com.elearning.elearning_support.security.service;

import javax.validation.constraints.NotNull;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import com.elearning.elearning_support.entities.users.User;
import com.elearning.elearning_support.enums.commons.StatusEnum;
import com.elearning.elearning_support.repositories.users.UserRepository;
import com.elearning.elearning_support.security.models.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Component
@Slf4j
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(@NotNull String username) throws UsernameNotFoundException {
        try {
            User user = userRepository.findByUsernameAndStatus(username, StatusEnum.ENABLED.getStatus())
                .orElseThrow(() -> new UsernameNotFoundException(username));
            return new CustomUserDetails(user);
        } catch (Exception ex) {
            ex.printStackTrace();
            throw new RuntimeException("Load user by user name error");
        }
    }
}
