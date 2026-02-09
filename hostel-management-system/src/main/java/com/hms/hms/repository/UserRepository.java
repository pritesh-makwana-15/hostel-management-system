package com.hms.hms.repository;

import com.hms.hms.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Find a user by their email address
     * @param email - user's email
     * @return Optional containing User if found, empty otherwise
     */
    Optional<User> findByEmail(String email);
}