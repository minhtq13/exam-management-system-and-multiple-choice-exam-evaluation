package com.elearning.elearning_support.repositories.users;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import com.elearning.elearning_support.constants.sql.SQLUser;
import com.elearning.elearning_support.entities.users.UserRole;

@Repository
public interface UserRoleRepository extends JpaRepository<UserRole, Long> {

    @Transactional
    @Modifying
    @Query(nativeQuery = true, value = SQLUser.DELETE_USER_ROLE_BY_USER_ID)
    void deleteAllByUserId(Long userId);

}
