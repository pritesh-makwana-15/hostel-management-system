package com.hms.hms.service;

import com.hms.hms.dto.RegisterRequest;
import com.hms.hms.dto.ResolveComplaintRequest;
import com.hms.hms.dto.WardenComplaintDTO;
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

@Service
public class WardenService {

    @Autowired private UserRepository userRepository;
    @Autowired private WardenRepository wardenRepository;
    @Autowired private AdminRepository adminRepository;
    @Autowired private ComplaintRepository complaintRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    @Transactional
    public Warden createWarden(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered: " + request.getEmail());
        }

        // 1. Save user
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .role(User.Role.WARDEN)
                .build();
        user = userRepository.save(user);

        // 2. Resolve admin (optional)
        Admin admin = null;
        if (request.getAdminId() != null) {
            admin = adminRepository.findById(request.getAdminId()).orElse(null);
        }

        // 3. Save warden profile
        Warden warden = Warden.builder()
                .user(user)
                .admin(admin)
                .gender(request.getGender())
                .address(request.getAddress())
                .joinDate(request.getJoinDate())
                .build();
        return wardenRepository.save(warden);
    }

    public List<Warden> getAllWardens() {
        return wardenRepository.findAll();
    }

    public Warden getById(Long id) {
        return wardenRepository.findById(id).orElse(null);
    }

    public Warden getByEmail(String email) {
        return wardenRepository.findByUser_Email(email).orElse(null);
    }

    @Transactional
    public Warden updateWarden(Long id, RegisterRequest request) {
        Warden existing = wardenRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Warden not found: " + id));

        User user = existing.user;
        user.name = request.getName();
        user.phone = request.getPhone();
        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            user.password = passwordEncoder.encode(request.getPassword());
        }
        userRepository.save(user);

        if (request.getAdminId() != null) {
            adminRepository.findById(request.getAdminId()).ifPresent(admin -> existing.admin = admin);
        }
        existing.gender = request.getGender();
        existing.address = request.getAddress();
        existing.joinDate = request.getJoinDate();
        return wardenRepository.save(existing);
    }

    @Transactional
    public String deleteWarden(Long id) {
        Warden warden = wardenRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Warden not found: " + id));
        wardenRepository.delete(warden);
        userRepository.delete(warden.user);
        return "Deleted warden with id: " + id;
    }

    // Change password for warden
    @Transactional
    public boolean changePassword(Long wardenId, String currentPassword, String newPassword) {
        Warden warden = wardenRepository.findById(wardenId)
                .orElseThrow(() -> new RuntimeException("Warden not found: " + wardenId));
        
        User user = warden.user;
        
        if (!passwordEncoder.matches(currentPassword, user.password)) {
            return false;
        }
        
        user.password = passwordEncoder.encode(newPassword);
        userRepository.save(user);
        return true;
    }

    // Get all complaints assigned to warden
    public List<WardenComplaintDTO> getComplaints(Long wardenId) {
        List<Complaint> complaints = complaintRepository.findByWardenIdOrStudent_WardenIdOrderByCreatedAtDesc(wardenId, wardenId);
        return complaints.stream()
            .map(c -> toWardenComplaintDTO(c, wardenId))
            .collect(java.util.stream.Collectors.toList());
        }

        // Get all complaints from the complaint table for the warden list view
        public List<WardenComplaintDTO> getAllComplaints() {
        List<Complaint> complaints = complaintRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
        return complaints.stream()
                    .map(c -> toWardenComplaintDTO(c, c.warden != null ? c.warden.id : null))
                .collect(java.util.stream.Collectors.toList());
    }

        @Transactional
        public WardenComplaintDTO updateComplaintStatus(Long complaintId, String wardenEmail, ResolveComplaintRequest request) {
            Warden warden = getByEmail(wardenEmail);
            if (warden == null) {
                throw new RuntimeException("Warden not found for email: " + wardenEmail);
            }

            Complaint complaint = complaintRepository.findById(complaintId)
                    .orElseThrow(() -> new RuntimeException("Complaint not found: " + complaintId));

            boolean managedByWarden = (complaint.warden != null && complaint.warden.id != null && complaint.warden.id.equals(warden.id))
                    || (complaint.student != null && complaint.student.warden != null && complaint.student.warden.id != null && complaint.student.warden.id.equals(warden.id));

            if (!managedByWarden) {
                throw new RuntimeException("Complaint is not assigned to this warden: " + complaintId);
            }

            if (request == null || request.getStatus() == null || request.getStatus().isBlank()) {
                throw new RuntimeException("Status is required");
            }

            complaint.status = request.getStatus().trim();
            complaintRepository.save(complaint);
            return toWardenComplaintDTO(complaint, warden.id);
        }

        private WardenComplaintDTO toWardenComplaintDTO(Complaint c, Long wardenId) {
        return WardenComplaintDTO.builder()
                    .id(c.id)
                    .complaintCode(c.complaintCode)
                    .title(c.title)
                    .category(c.category)
                    .priority(c.priority)
                    .description(c.description)
                    .roomNumber(c.roomNumber)
                    .status(c.status)
                    .submittedDate(c.submittedDate != null ? c.submittedDate.toString() : null)
                    .submittedTime(c.submittedTime)
                    .studentName(c.student != null && c.student.user != null ? c.student.user.name : null)
                    .studentId(c.student != null ? c.student.enrollmentNo : null)
                    .hostelBlock(c.student != null ? c.student.hostelBlock : null)
                    .studentUserId(c.student != null ? c.student.id : null)
            .wardenId(wardenId)
                    .createdAt(c.createdAt != null ? c.createdAt.toEpochSecond(java.time.ZoneOffset.UTC) : null)
            .build();
        }
}