package com.hms.hms.service;

import com.hms.hms.dto.AdminComplaintDTO;
import com.hms.hms.dto.AssignComplaintRequest;
import com.hms.hms.dto.RegisterRequest;
import com.hms.hms.dto.ResolveComplaintRequest;
import com.hms.hms.entity.Admin;
import com.hms.hms.entity.Complaint;
import com.hms.hms.entity.User;
import com.hms.hms.entity.Warden;
import com.hms.hms.repository.AdminRepository;
import com.hms.hms.repository.ComplaintRepository;
import com.hms.hms.repository.UserRepository;
import com.hms.hms.repository.WardenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {

    @Autowired private UserRepository userRepository;
    @Autowired private AdminRepository adminRepository;
    @Autowired private ComplaintRepository complaintRepository;
    @Autowired private WardenRepository wardenRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    @Transactional
    public Admin createAdmin(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email)) {
            throw new RuntimeException("Email already registered: " + request.email);
        }

        // 1. Save user
        User user = new User();
        user.name = request.name;
        user.email = request.email;
        user.password = passwordEncoder.encode(request.password);
        user.phone = request.phone;
        user.role = User.Role.ADMIN;
        user = userRepository.save(user);

        // 2. Save admin profile
        Admin profile = new Admin();
        profile.user = user;
        profile.designation = request.designation;
        profile.phone = request.phone;
        return adminRepository.save(profile);
    }

    public List<Admin> getAllAdmins() {
        return adminRepository.findAll();
    }

    public Admin getById(Long id) {
        return adminRepository.findById(id).orElse(null);
    }

    public Admin getByEmail(String email) {
        if (email == null || email.isBlank()) return null;

        return userRepository.findByEmail(email)
                .flatMap(u -> adminRepository.findByUserId(u.id))
                .orElse(null);
    }

    public Admin save(Admin admin) {
        // Save user first if it has changes
        if (admin.user != null) {
            userRepository.save(admin.user);
        }
        return adminRepository.save(admin);
    }

    @Transactional
    public Admin updateAdmin(Long id, RegisterRequest request) {
        Admin existing = adminRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Admin not found: " + id));

        User user = existing.user;
        user.name = request.name;
        user.phone = request.phone;
        if (request.password != null && !request.password.isBlank()) {
            user.password = passwordEncoder.encode(request.password);
        }
        userRepository.save(user);

        existing.designation = request.designation;
        existing.phone = request.phone;
        return adminRepository.save(existing);
    }

    @Transactional
    public String deleteAdmin(Long id) {
        Admin profile = adminRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Admin not found: " + id));
        adminRepository.delete(profile);
        userRepository.delete(profile.user);
        return "Deleted admin with id: " + id;
    }

    // ── Complaint Management for Admin ────────────────────────────
    public List<AdminComplaintDTO> getAllComplaints() {
        return complaintRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"))
                .stream()
                .map(this::toAdminComplaintDTO)
                .collect(Collectors.toList());
    }

    public AdminComplaintDTO getComplaintById(Long id) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Complaint not found: " + id));
        return toAdminComplaintDTO(complaint);
    }

    private AdminComplaintDTO toAdminComplaintDTO(Complaint c) {
        String studentName = "Unknown";
        Long studentUserId = null;
        Long studentId = null;
        String hostelBlock = "";
        
        if (c.student != null) {
            studentId = c.student.id;
            if (c.student.user != null) {
                studentName = c.student.user.name != null ? c.student.user.name : "Unknown";
                studentUserId = c.student.user.id;
            }
            if (c.student.room != null) {
                hostelBlock = c.student.room.hostelBlock != null ? c.student.room.hostelBlock : "";
            }
        }
        
        String wardenName = "Not Assigned";
        Long wardenId = null;
        
        if (c.warden != null) {
            wardenId = c.warden.id;
            if (c.warden.user != null && c.warden.user.name != null) {
                wardenName = c.warden.user.name;
            }
        }
        
        return AdminComplaintDTO.builder()
                .id(c.id)
                .complaintCode(c.complaintCode)
                .title(c.title)
                .category(c.category)
                .priority(c.priority)
                .description(c.description)
                .roomNumber(c.roomNumber)
                .status(c.status != null ? c.status : "Open")
                .submittedDate(c.submittedDate != null ? c.submittedDate.toString() : "")
                .submittedTime(c.submittedTime != null ? c.submittedTime : "")
                .studentName(studentName)
                .studentId(studentId)
                .hostelBlock(hostelBlock)
                .studentUserId(studentUserId)
                .assignedWardenName(wardenName)
                .assignedWardenId(wardenId)
                .createdAt(c.createdAt != null ? c.createdAt.atZone(java.time.ZoneId.systemDefault()).toInstant().toEpochMilli() : 0L)
                .build();
    }

    @Transactional
    public AdminComplaintDTO assignComplaint(Long id, AssignComplaintRequest request) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Complaint not found: " + id));

        if (request.getWardenId() != null) {
            Warden warden = wardenRepository.findById(request.getWardenId())
                    .orElseThrow(() -> new RuntimeException("Warden not found: " + request.getWardenId()));
            complaint.warden = warden;
        } else {
            complaint.warden = null;
        }

        complaint.status = "In Progress";
        complaintRepository.save(complaint);
        return toAdminComplaintDTO(complaint);
    }

    @Transactional
    public AdminComplaintDTO resolveComplaint(Long id, ResolveComplaintRequest request) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Complaint not found: " + id));

        if (request.getStatus() != null && !request.getStatus().isBlank()) {
            complaint.status = request.getStatus();
        }

        complaintRepository.save(complaint);
        return toAdminComplaintDTO(complaint);
    }
}