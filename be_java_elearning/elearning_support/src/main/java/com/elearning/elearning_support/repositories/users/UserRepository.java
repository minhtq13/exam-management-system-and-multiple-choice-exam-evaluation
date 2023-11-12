package com.elearning.elearning_support.repositories.users;

import java.util.List;
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

    Optional<User> findByIdAndDeletedFlag(Long id, Integer deletedFlag);

    Integer countByUsername(String username);

    Boolean existsByCode(String code);

    Boolean existsByUsername(String username);

    Boolean existsByEmail(String email);

    Boolean existsByEmailAndIdNot(String email, Long id);

    Boolean existsByCodeAndUserType(String code, Integer userType);

    Boolean existsByCodeAndUserTypeAndIdNot(String code, Integer userType, Long userId);

    @Query(nativeQuery = true, value = SQLUser.GET_USER_DETAIL)
    IGetDetailUserDTO getDetailUser(Long userId);

    @Query(nativeQuery = true, value = SQLUser.GET_LIST_STUDENT)
    Page<IGetUserListDTO> getPageStudent(String name, String code, Pageable pageable);

    @Query(nativeQuery = true, value = SQLUser.GET_LIST_STUDENT)
    List<IGetUserListDTO> getListStudent(String name, String code);

    @Query(nativeQuery = true, value = SQLUser.GET_LIST_TEACHER)
    Page<IGetUserListDTO> getPageTeacher(String name, String code, Pageable pageable);

    @Query(nativeQuery = true, value = SQLUser.GET_LIST_TEACHER)
    List<IGetUserListDTO> getListTeacher(String name, String code);

    @Query(nativeQuery = true, value = SQLUser.GET_LIST_CURRENT_USERNAME)
    Set<String> getLstCurrentUsername();

    @Query(nativeQuery = true, value = SQLUser.GET_LIST_CURRENT_USER_EMAIL)
    Set<String> getListCurrentEmail();

    @Query(nativeQuery = true, value = SQLUser.GET_LIST_CURRENT_USER_CODE_BY_USER_TYPE)
    Set<String> getListCurrentCodeByUserType(Integer userType);

}
