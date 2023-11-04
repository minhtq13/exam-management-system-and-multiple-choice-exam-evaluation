package com.elearning.elearning_support.services.users;

import org.springframework.stereotype.Service;
import com.elearning.elearning_support.dtos.users.ProfileUserDTO;

@Service
public interface UserService {

    /**
     * Get loged in user's profile
     */
    ProfileUserDTO getUserProfile();

}
