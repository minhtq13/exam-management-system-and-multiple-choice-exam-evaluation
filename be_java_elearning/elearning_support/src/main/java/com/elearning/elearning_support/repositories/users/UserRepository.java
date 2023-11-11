package com.elearning.elearning_support.repositories.users;

import java.util.Optional;
import java.util.Set;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import com.elearning.elearning_support.constants.sql.SQLUser;
import com.elearning.elearning_support.dtos.users.IGetDetailUserDTO;
import com.elearning.elearning_support.dtos.users.IGetUserListDTO;
import com.elearning.elearning_support.entities.users.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsernameAndStatus(String username, Integer status);

    Integer countByUsername(String username);

    Boolean existsByCode(String code);

    @Query(nativeQuery = true, value = SQLUser.GET_DETAIL_USER)
    IGetDetailUserDTO getDetailUser(Long userId);


    @Query(nativeQuery = true, value = SQLUser.GET_LIST_STUDENT)
    Page<IGetUserListDTO> getListStudent(String name, String code, Pageable pageable);


    @Query(nativeQuery = true, value = SQLUser.GET_LIST_TEACHER)
    Page<IGetUserListDTO> getListTeacher(String name, String code, Pageable pageable);

    @Query(nativeQuery = true, value = SQLUser.GET_LIST_CURRENT_USERNAME)
    Set<String> getLstCurrentUsername();

    @Query(nativeQuery = true, value = SQLUser.GET_LIST_CURRENT_USER_EMAIL)
    Set<String> getListCurrentEmail();

    @Query(nativeQuery = true, value = SQLUser.GET_LIST_CURRENT_USER_CODE_BY_USER_TYPE)
    Set<String> getListCurrentCodeByUserType(Integer userType);

}
