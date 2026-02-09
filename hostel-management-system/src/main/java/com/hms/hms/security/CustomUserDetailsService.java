package com.hms.hms.security;

import com.hms.hms.entity.User;
import com.hms.hms.repository.UserRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    // Constructor injection
    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Load user by email (not username)
     * Spring Security calls this method during authentication
     * @param email - user's email address
     * @return UserDetails object for Spring Security
     * @throws UsernameNotFoundException if user not found
     */
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // Step 1: Fetch user from database using email
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        // Step 2: Convert User entity into Spring Security UserDetails
        // Add "ROLE_" prefix to match Spring Security convention
        SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + user.getRole().name());

        // Step 3: Return UserDetails object
        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),           // username (using email)
                user.getPassword(),        // encrypted password
                Collections.singletonList(authority)  // user's role
        );
    }
}