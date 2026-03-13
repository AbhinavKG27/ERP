package com.apex.erp.security;

import com.apex.erp.module.user.entity.Role;
import com.apex.erp.module.user.entity.User;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Getter
public class CustomUserDetails implements UserDetails {

    private final Long   id;
    private final String email;
    private final String password;
    private final Role   role;
    private final boolean active;

    public CustomUserDetails(User user) {
        this.id       = user.getId();
        this.email    = user.getEmail();
        this.password = user.getPasswordHash();
        this.role     = user.getRole();
        this.active   = Boolean.TRUE.equals(user.getIsActive());
    }

    // Spring Security requires "ROLE_" prefix in authority
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }

    @Override public String getUsername()            { return email; }
    @Override public String getPassword()            { return password; }
    @Override public boolean isAccountNonExpired()   { return true; }
    @Override public boolean isAccountNonLocked()    { return active; }
    @Override public boolean isCredentialsNonExpired(){ return true; }
    @Override public boolean isEnabled()             { return active; }
}