package com.hms.hms.repository;

import com.hms.hms.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByUserId(Long userId);
    List<Student> findByWarden_Id(Long wardenId);
    Optional<Student> findByUserEmail(String email);
}