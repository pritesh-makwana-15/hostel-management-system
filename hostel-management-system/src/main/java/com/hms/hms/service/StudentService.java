package com.hms.hms.service;

import com.hms.hms.dto.RegisterRequest;
import com.hms.hms.dto.StudentProfileDTO;
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

    // ── Create ────────────────────────────────────────────────
    @Transactional
    public Student createStudent(RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new RuntimeException("Email already registered: " + req.getEmail());
        }

        User user = User.builder()
                .name(req.getName())
                .email(req.getEmail())
                .password(passwordEncoder.encode(req.getPassword()))
                .phone(req.getPhone())
                .role(User.Role.STUDENT)
                .build();
        user = userRepository.save(user);

        Warden warden = null;
        if (req.getWardenId() != null) {
            warden = wardenRepository.findById(req.getWardenId()).orElse(null);
        }

        Student student = Student.builder()
                .user(user)
                .warden(warden)
                // Academic
                .enrollmentNo(req.getEnrollmentNo())
                .course(req.getCourse())
                .yearSemester(req.getYearSemester())
                .batch(req.getBatch())
                .program(req.getProgram())
                // Personal
                .dob(req.getDob())
                .gender(req.getGender())
                .nationality(req.getNationality())
                .photoUrl(req.getPhotoUrl())
                // Guardian
                .guardianName(req.getGuardianName())
                .guardianPhone(req.getGuardianPhone())
                .guardianRelation(req.getGuardianRelation())
                .address(req.getAddress())
                // Hostel
                .hostelBlock(req.getHostelBlock())
                .roomType(req.getRoomType())
                .roomNo(req.getRoomNo())
                .bedNo(req.getBedNo())
                .allocatedOn(req.getAllocatedOn())
                .roomId(req.getRoomId())
                // Status
                .status(req.getStatus() != null ? req.getStatus() : "Active")
                .joinDate(req.getJoinDate())
                .build();

        return studentRepository.save(student);
    }

    // ── Read All ──────────────────────────────────────────────
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    // ── Read One ──────────────────────────────────────────────
    public Student getById(Long id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found: " + id));
    }

    // ── Profile (full joined data for profile page) ───────────
    public StudentProfileDTO getProfile(Long id) {
        Student s = getById(id);

        // Fee summary — placeholder values (replace with real fee repo queries)
        Double totalFeesDue      = 0.0;
        Double currentOutstanding = 0.0;
        String feeStatus          = "N/A";

        // Complaint summary — placeholder (replace with real complaint repo queries)
        Integer totalComplaints    = 0;
        Integer openComplaints     = 0;
        Integer resolvedComplaints = 0;
        String lastComplaint       = "None";

        return StudentProfileDTO.builder()
                .id(s.getId())
                .enrollmentNo(s.getEnrollmentNo())
                .status(s.getStatus())
                // Personal
                .name(s.getName())
                .email(s.getEmail())
                .phone(s.getPhone())
                .gender(s.getGender())
                .dob(s.getDob())
                .nationality(s.getNationality())
                .photoUrl(s.getPhotoUrl())
                // Academic
                .course(s.getCourse())
                .yearSemester(s.getYearSemester())
                .batch(s.getBatch())
                .program(s.getProgram())
                // Guardian
                .guardianName(s.getGuardianName())
                .guardianPhone(s.getGuardianPhone())
                .guardianRelation(s.getGuardianRelation())
                .address(s.getAddress())
                // Hostel
                .hostelBlock(s.getHostelBlock())
                .roomType(s.getRoomType())
                .roomNo(s.getRoomNo())
                .bedNo(s.getBedNo())
                .allocatedOn(s.getAllocatedOn())
                // Fee summary
                .totalFeesDue(totalFeesDue)
                .currentOutstanding(currentOutstanding)
                .feeStatus(feeStatus)
                // Complaint summary
                .totalComplaints(totalComplaints)
                .openComplaints(openComplaints)
                .resolvedComplaints(resolvedComplaints)
                .lastComplaint(lastComplaint)
                // Relations
                .wardenId(s.getWarden() != null ? s.getWarden().getId() : null)
                .wardenName(s.getWarden() != null ? s.getWarden().getName() : null)
                .joinDate(s.getJoinDate())
                .build();
    }

    // ── Update ────────────────────────────────────────────────
    @Transactional
    public Student updateStudent(Long id, RegisterRequest req) {
        Student existing = getById(id);

        User user = existing.getUser();
        user.setName(req.getName());
        user.setPhone(req.getPhone());
        if (req.getPassword() != null && !req.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(req.getPassword()));
        }
        userRepository.save(user);

        if (req.getWardenId() != null) {
            wardenRepository.findById(req.getWardenId()).ifPresent(existing::setWarden);
        }

        // Academic
        existing.setEnrollmentNo(req.getEnrollmentNo());
        existing.setCourse(req.getCourse());
        existing.setYearSemester(req.getYearSemester());
        existing.setBatch(req.getBatch());
        existing.setProgram(req.getProgram());
        // Personal
        existing.setDob(req.getDob());
        existing.setGender(req.getGender());
        existing.setNationality(req.getNationality());
        if (req.getPhotoUrl() != null) existing.setPhotoUrl(req.getPhotoUrl());
        // Guardian
        existing.setGuardianName(req.getGuardianName());
        existing.setGuardianPhone(req.getGuardianPhone());
        existing.setGuardianRelation(req.getGuardianRelation());
        existing.setAddress(req.getAddress());
        // Hostel
        existing.setHostelBlock(req.getHostelBlock());
        existing.setRoomType(req.getRoomType());
        existing.setRoomNo(req.getRoomNo());
        existing.setBedNo(req.getBedNo());
        existing.setAllocatedOn(req.getAllocatedOn());
        existing.setRoomId(req.getRoomId());
        // Status
        if (req.getStatus() != null) existing.setStatus(req.getStatus());
        if (req.getJoinDate() != null) existing.setJoinDate(req.getJoinDate());

        return studentRepository.save(existing);
    }

    // ── Update Status Only ────────────────────────────────────
    @Transactional
    public Student updateStatus(Long id, String status) {
        Student student = getById(id);
        student.setStatus(status);
        return studentRepository.save(student);
    }

    // ── Assign Room ───────────────────────────────────────────
    @Transactional
    public Student assignRoom(Long id, String hostelBlock, String roomType,
                              String roomNo, String bedNo, Long roomId) {
        Student student = getById(id);
        student.setHostelBlock(hostelBlock);
        student.setRoomType(roomType);
        student.setRoomNo(roomNo);
        student.setBedNo(bedNo);
        student.setRoomId(roomId);
        return studentRepository.save(student);
    }

    // ── Delete ────────────────────────────────────────────────
    @Transactional
    public String deleteStudent(Long id) {
        Student student = getById(id);
        studentRepository.delete(student);
        userRepository.delete(student.getUser());
        return "Deleted student with id: " + id;
    }
}