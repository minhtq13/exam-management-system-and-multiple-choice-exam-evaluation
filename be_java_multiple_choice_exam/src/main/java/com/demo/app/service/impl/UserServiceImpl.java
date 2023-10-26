package com.demo.app.service.impl;

import com.demo.app.dto.student.StudentProfileResponse;
import com.demo.app.dto.teacher.TeacherProfileResponse;
import com.demo.app.dto.user.UserResponse;
import com.demo.app.exception.UserNotEnrolledException;
import com.demo.app.model.Role;
import com.demo.app.model.Student;
import com.demo.app.model.Teacher;
import com.demo.app.repository.StudentRepository;
import com.demo.app.repository.TeacherRepository;
import com.demo.app.repository.UserRepository;
import com.demo.app.service.UserService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    private final StudentRepository studentRepository;

    private final TeacherRepository teacherRepository;

    private final ModelMapper mapper;

    @Override
    public List<UserResponse> getUsers() {
        var users = userRepository.findAll();
        return users.parallelStream()
                .map(user -> {
                    var response = mapper.map(user, UserResponse.class);
                    var roles = user.getRoles().parallelStream()
                            .map(role -> role.getRoleName().name())
                            .collect(Collectors.toList());
                    response.setRoles(roles);
                    return response;
                }).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public Object getUserProfile(Authentication auth) throws UserNotEnrolledException {
        if (!auth.isAuthenticated() || auth.getName().equals("anonymousUser")) {
            throw new UserNotEnrolledException("Cannot found user !", HttpStatus.FORBIDDEN);
        }
        var roles = auth.getAuthorities()
                .parallelStream()
                .map(GrantedAuthority::getAuthority)
                .toList();
        if (roles.contains(Role.RoleType.ROLE_ADMIN.toString())) {
            return getUserProfile(auth.getName());
        } else if (roles.contains(Role.RoleType.ROLE_STUDENT.toString())) {
            return getStudentProfile(auth.getName());
        } else if (roles.contains(Role.RoleType.ROLE_TEACHER.toString())) {
            return getTeacherProfile(auth.getName());
        }
        return null;
    }

    private UserResponse getUserProfile(String username) {
        var user = userRepository.findByUsername(username).get();
        var response = mapper.map(user, UserResponse.class);
        var roles = user.getRoles().parallelStream()
                .map(role -> role.getRoleName().name())
                .collect(Collectors.toList());
        response.setRoles(roles);
        return response;
    }

    private StudentProfileResponse getStudentProfile(String username) {
        var student = studentRepository.findByUsernameAndEnabledIsTrue(username)
                .orElse(new Student());
        var roles = student.getUser()
                .getRoles()
                .parallelStream()
                .map(role -> role.getRoleName().toString())
                .collect(Collectors.toList());
        var response = mapper.map(student, StudentProfileResponse.class);
        response.setUsername(student.getUser().getUsername());
        response.setEmail(student.getUser().getEmail());
        response.setRoles(roles);
        return response;
    }

    private TeacherProfileResponse getTeacherProfile(String username) {
        var teacher = teacherRepository.findByUsername(username)
                .orElse(new Teacher());
        var roles = teacher.getUser()
                .getRoles()
                .parallelStream()
                .map(role -> role.getRoleName().toString())
                .collect(Collectors.toList());
        var response = mapper.map(teacher, TeacherProfileResponse.class);
        response.setUsername(teacher.getUser().getUsername());
        response.setEmail(teacher.getUser().getEmail());
        response.setRoles(roles);
        return response;
    }
}