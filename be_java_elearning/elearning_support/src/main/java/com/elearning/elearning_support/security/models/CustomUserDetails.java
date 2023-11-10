package com.elearning.elearning_support.security.models;

import java.util.Collection;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
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

    public CustomUserDetails(User user){
        this.user = user;
        this.authorities = this.user.getRoles().stream().map(role -> new SimpleGrantedAuthority(role.getName())).collect(Collectors.toSet());
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Long getUserId(){return this.user.getId();}

    public String getUserEmail(){return this.user.getEmail();}

    public String getUserCode(){return this.user.getCode();}

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
