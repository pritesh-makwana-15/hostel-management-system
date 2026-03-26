package com.hms.hms.repository;

import com.hms.hms.entity.Warden;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WardenRepository extends JpaRepository<Warden, Long> {
    Optional<Warden> findByUserId(Long userId);
}