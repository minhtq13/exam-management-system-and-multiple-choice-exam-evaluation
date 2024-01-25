package com.elearning.elearning_support.security.models;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import com.elearning.elearning_support.entities.permission.Permission;
import com.elearning.elearning_support.entities.role.Role;
import com.elearning.elearning_support.entities.users.User;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class CustomUserDetails implements UserDetails {

    private User user;

    private Set<String> roles;

    private Collection<? extends GrantedAuthority> authorities;

    public CustomUserDetails(User user) {
        this.user = user;
        this.roles = user.getRoles().stream().map(Role::getCode).collect(Collectors.toSet());
        List<Permission> lstPermission = new ArrayList<>();
        for (Role role : user.getRoles()) {
            lstPermission.addAll(role.getLstPermissions());
        }
        this.authorities = lstPermission.stream().map(permission -> new SimpleGrantedAuthority(permission.getCode()))
            .collect(Collectors.toList());
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Long getUserId() {
        return this.user.getId();
    }

    public void setRoles(Set<String> roles) {
        this.roles = roles;
    }

    @Override
    public String getPassword() {
        return user.getPassword();
    }

    @Override
    public String getUsername() {
        return user.getUsername();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
