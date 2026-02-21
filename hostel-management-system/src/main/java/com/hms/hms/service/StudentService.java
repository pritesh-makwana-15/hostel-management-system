package com.hms.hms.service;

import com.hms.hms.dto.RegisterRequest;
import com.hms.hms.entity.Student;
import com.hms.hms.entity.User;
import com.hms.hms.entity.Warden;
import com.hms.hms.repository.StudentRepository;
import com.hms.hms.repository.UserRepository;
import com.hms.hms.repository.WardenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class StudentService {

    @Autowired private UserRepository userRepository;
    @Autowired private StudentRepository studentRepository;
    @Autowired private WardenRepository wardenRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    @Transactional
    public Student createStudent(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered: " + request.getEmail());
        }

        // 1. Save user
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .role(User.Role.STUDENT)
                .build();
        user = userRepository.save(user);

        // 2. Resolve warden (optional)
        Warden warden = null;
        if (request.getWardenId() != null) {
            warden = wardenRepository.findById(request.getWardenId()).orElse(null);
        }

        // 3. Save student profile
        Student student = Student.builder()
                .user(user)
                .warden(warden)
                .roomId(request.getRoomId())
                .course(request.getCourse())
                .dob(request.getDob())
                .joinDate(request.getJoinDate())
                .build();
        return studentRepository.save(student);
    }

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    public Student getById(Long id) {
        return studentRepository.findById(id).orElse(null);
    }

    @Transactional
    public Student updateStudent(Long id, RegisterRequest request) {
        Student existing = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found: " + id));

        User user = existing.getUser();
        user.setName(request.getName());
        user.setPhone(request.getPhone());
        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }
        userRepository.save(user);

        if (request.getWardenId() != null) {
            wardenRepository.findById(request.getWardenId()).ifPresent(existing::setWarden);
        }
        existing.setRoomId(request.getRoomId());
        existing.setCourse(request.getCourse());
        existing.setDob(request.getDob());
        existing.setJoinDate(request.getJoinDate());
        return studentRepository.save(existing);
    }

    @Transactional
    public String deleteStudent(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found: " + id));
        studentRepository.delete(student);
        userRepository.delete(student.getUser());
        return "Deleted student with id: " + id;
    }
}