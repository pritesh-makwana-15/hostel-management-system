package com.hms.hms.service;

import com.hms.hms.dto.RegisterRequest;
import com.hms.hms.dto.StudentProfileDTO;
import com.hms.hms.entity.Student;
import com.hms.hms.entity.User;
import com.hms.hms.entity.Warden;
import com.hms.hms.entity.Room;
import com.hms.hms.entity.Bed;
import com.hms.hms.repository.StudentRepository;
import com.hms.hms.repository.UserRepository;
import com.hms.hms.repository.WardenRepository;
import com.hms.hms.repository.RoomRepository;
import com.hms.hms.repository.BedRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Map;
import java.time.LocalDate;
import java.time.LocalDate;

@Service
public class StudentService {

    @Autowired private UserRepository userRepository;
    @Autowired private StudentRepository studentRepository;
    @Autowired private WardenRepository wardenRepository;
    @Autowired private RoomRepository roomRepository;
    @Autowired private BedRepository bedRepository;
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

        Room room = null;
        if (req.getRoomId() != null) {
            room = roomRepository.findById(req.getRoomId()).orElse(null);
        }

        Student student = Student.builder()
                .user(user)
                .warden(warden)
                .room(room)
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

    // ── Read All Paginated ─────────────────────────────────────
    public Page<Student> getAllStudents(Pageable pageable) {
        return studentRepository.findAll(pageable);
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

        if (req.getRoomId() != null) {
            roomRepository.findById(req.getRoomId()).ifPresent(existing::setRoom);
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

    // ── Partial Update ─────────────────────────────────────────
    @Transactional
    public Student updatePartial(Long id, Map<String, Object> updates) {
        Student existing = getById(id);
        User user = existing.getUser();

        if (updates.containsKey("name")) user.setName((String) updates.get("name"));
        if (updates.containsKey("email")) user.setEmail((String) updates.get("email"));
        if (updates.containsKey("phone")) user.setPhone((String) updates.get("phone"));
        userRepository.save(user);

        if (updates.containsKey("gender")) existing.setGender((String) updates.get("gender"));
        if (updates.containsKey("dateOfBirth")) existing.setDob(LocalDate.parse((String) updates.get("dateOfBirth")));
        if (updates.containsKey("yearSemester")) existing.setYearSemester((String) updates.get("yearSemester"));
        if (updates.containsKey("guardianName")) existing.setGuardianName((String) updates.get("guardianName"));
        if (updates.containsKey("guardianPhone")) existing.setGuardianPhone((String) updates.get("guardianPhone"));
        if (updates.containsKey("address")) existing.setAddress((String) updates.get("address"));

        return studentRepository.save(existing);
    }

    // ── Assign Room ───────────────────────────────────────────
    @Transactional
    public Student assignRoom(Long studentId, com.hms.hms.dto.AssignRoomRequest request) {
        // Fetch entities
        Student student = getById(studentId);
        com.hms.hms.entity.Room room = roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new RuntimeException("Room not found"));
        com.hms.hms.entity.Bed bed = bedRepository.findByRoomIdAndBedNumber(request.getRoomId(), request.getBedNo());
        if (bed == null) {
            throw new RuntimeException("Bed not found in room");
        }

        // Validate bed is available
        if (!"Available".equals(bed.getStatus())) {
            throw new RuntimeException("Bed is not available");
        }

        // Check if room is full
        long occupiedBeds = room.getBeds().stream().filter(b -> "Occupied".equals(b.getStatus())).count();
        if (occupiedBeds >= room.getTotalBeds()) {
            throw new RuntimeException("Room is full");
        }

        // If student already has a room, free the old bed
        if (student.getBed() != null) {
            com.hms.hms.entity.Bed oldBed = student.getBed();
            oldBed.setStatus("Available");
            oldBed.setStudent(null);
            bedRepository.save(oldBed);

            // Decrease old room occupied beds
            if (student.getRoom() != null && !student.getRoom().equals(room)) {
                // Note: Since occupiedBeds is calculated, no need to decrement manually
            }
        }

        // Assign new bed
        bed.setStatus("Occupied");
        bed.setStudent(student);
        bedRepository.save(bed);

        // Update student
        student.setRoom(room);
        student.setBed(bed);
        student.setHostelBlock(room.getHostelBlock());
        student.setRoomType(room.getRoomType());
        student.setRoomNo(room.getRoomNumber());
        student.setBedNo(bed.getBedNumber());
        student.setAllocatedOn(java.time.LocalDate.now());

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