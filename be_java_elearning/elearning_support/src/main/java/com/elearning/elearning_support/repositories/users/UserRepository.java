package com.elearning.elearning_support.repositories.users;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.elearning.elearning_support.entities.users.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);

    Integer countByUsername(String username);

    Boolean existsByCode(String code);

}
