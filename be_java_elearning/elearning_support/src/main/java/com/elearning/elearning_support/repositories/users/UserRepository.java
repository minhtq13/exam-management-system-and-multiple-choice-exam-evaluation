package com.elearning.elearning_support.repositories.users;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import com.elearning.elearning_support.constants.sql.SQLUser;
import com.elearning.elearning_support.dtos.users.IGetDetailUserDTO;
import com.elearning.elearning_support.entities.users.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsernameAndStatus(String username, Integer status);

    Integer countByUsername(String username);

    Boolean existsByCode(String code);

    @Query(nativeQuery = true, value = SQLUser.GET_DETAIL_USER)
    IGetDetailUserDTO getDetailUser(Long userId);

}
