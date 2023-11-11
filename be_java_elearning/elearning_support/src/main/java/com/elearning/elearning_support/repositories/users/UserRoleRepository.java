package com.elearning.elearning_support.repositories.users;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.elearning.elearning_support.entities.users.UserRole;

@Repository
public interface UserRoleRepository extends JpaRepository<UserRole, Long> {

}
