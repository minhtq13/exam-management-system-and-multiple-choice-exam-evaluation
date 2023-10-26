package com.demo.app.repository;

import com.demo.app.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByUsername(String username);

    Optional<User> findByUsernameAndEnabledIsTrue(String username);

    Boolean existsByUsernameAndEnabledIsTrue(String username);

    Boolean existsByEmailAndEnabledTrue(String email);

    List<User> findByEnabledFalseAndCreatedAtBefore(LocalDateTime waitedTime);

}
