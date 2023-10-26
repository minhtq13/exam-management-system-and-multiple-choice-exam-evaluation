package com.elearning.elearning_support.security.models;

import java.util.Collection;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
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

    private Set<Role> roles;

    public CustomUserDetails(User user){
        this.user = user;
        this.roles = this.user.getRoles();
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Long getUserId(){return this.user.getId();}

    public String getUserEmail(){return this.user.getEmail();}

    public String getUserCode(){return this.user.getCode();}

    public void setRoles(Set<Role> roles) {
        this.roles = roles;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return this.roles.stream()
            .map(role -> new SimpleGrantedAuthority(role.getCode())).collect(Collectors.toList());
    }

    @Override
    public String getPassword() {
        return null;
    }

    @Override
    public String getUsername() {
        return null;
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
