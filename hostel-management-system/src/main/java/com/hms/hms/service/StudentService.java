package com.hms.hms.service;

import com.hms.hms.dto.RegisterRequest;
import com.hms.hms.dto.StudentComplaintDTO;
import com.hms.hms.dto.StudentProfileDTO;
import com.hms.hms.entity.Complaint;
import com.hms.hms.entity.Student;
import com.hms.hms.entity.User;
import com.hms.hms.entity.Warden;
import com.hms.hms.entity.Room;
import com.hms.hms.entity.Bed;
import com.hms.hms.repository.ComplaintRepository;
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
import java.time.format.DateTimeFormatter;
import java.util.stream.Collectors;

@Service
public class StudentService {

    @Autowired private UserRepository userRepository;
    @Autowired private StudentRepository studentRepository;
    @Autowired private WardenRepository wardenRepository;
    @Autowired private RoomRepository roomRepository;
    @Autowired private BedRepository bedRepository;
    @Autowired private ComplaintRepository complaintRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    // Create
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

    // Read All
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    // Read All Paginated
    public Page<Student> getAllStudents(Pageable pageable) {
        return studentRepository.findAll(pageable);
    }

    // Read One
    public Student getById(Long id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found: " + id));
    }

    // Profile
    public StudentProfileDTO getProfile(Long id) {
        Student s = getById(id);

        // Fee summary - placeholder values
        Double totalFeesDue = 0.0;
        Double currentOutstanding = 0.0;
        String feeStatus = "N/A";

        Integer totalComplaints = (int) complaintRepository.countByStudentId(id);
        Integer openComplaints = (int) complaintRepository.countByStudentIdAndStatus(id, "Open");
        Integer resolvedComplaints = (int) complaintRepository.countByStudentIdAndStatus(id, "Resolved");
        String lastComplaint = complaintRepository.findTopByStudentIdOrderByCreatedAtDesc(id)
            .map(Complaint::getTitle)
            .orElse("None");

        return StudentProfileDTO.builder()
                .id(s.id)
                .enrollmentNo(s.enrollmentNo)
                .status(s.status)
                // Personal
                .name(s.user != null ? s.user.name : null)
                .email(s.user != null ? s.user.email : null)
                .phone(s.user != null ? s.user.phone : null)
                .gender(s.gender)
                .dob(s.dob)
                .nationality(s.nationality)
                .photoUrl(s.photoUrl)
                // Academic
                .course(s.course)
                .yearSemester(s.yearSemester)
                .batch(s.batch)
                .program(s.program)
                // Guardian
                .guardianName(s.guardianName)
                .guardianPhone(s.guardianPhone)
                .guardianRelation(s.guardianRelation)
                .address(s.address)
                // Hostel
                .hostelBlock(s.hostelBlock)
                .roomType(s.roomType)
                .roomNo(s.roomNo)
                .bedNo(s.bedNo)
                .allocatedOn(s.allocatedOn)
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
                .wardenId(s.warden != null ? s.warden.id : null)
                .wardenName(s.warden != null && s.warden.user != null ? s.warden.user.name : null)
                .joinDate(s.joinDate)
                .build();
    }

    // Update
    @Transactional
    public Student updateStudent(Long id, RegisterRequest req) {
        Student existing = getById(id);

        User user = existing.user;
        user.name = req.getName();
        user.phone = req.getPhone();
        if (req.getPassword() != null && !req.getPassword().isBlank()) {
            user.password = passwordEncoder.encode(req.getPassword());
        }
        userRepository.save(user);

        if (req.getWardenId() != null) {
            wardenRepository.findById(req.getWardenId()).ifPresent(w -> existing.warden = w);
        }

        if (req.getRoomId() != null) {
            roomRepository.findById(req.getRoomId()).ifPresent(r -> existing.room = r);
        }

        // Academic
        existing.enrollmentNo = req.getEnrollmentNo();
        existing.course = req.getCourse();
        existing.yearSemester = req.getYearSemester();
        existing.batch = req.getBatch();
        existing.program = req.getProgram();
        // Personal
        existing.dob = req.getDob();
        existing.gender = req.getGender();
        existing.nationality = req.getNationality();
        if (req.getPhotoUrl() != null) existing.photoUrl = req.getPhotoUrl();
        // Guardian
        existing.guardianName = req.getGuardianName();
        existing.guardianPhone = req.getGuardianPhone();
        existing.guardianRelation = req.getGuardianRelation();
        existing.address = req.getAddress();
        // Hostel
        existing.hostelBlock = req.getHostelBlock();
        existing.roomType = req.getRoomType();
        existing.roomNo = req.getRoomNo();
        existing.bedNo = req.getBedNo();
        existing.allocatedOn = req.getAllocatedOn();
        // Status
        if (req.getStatus() != null) existing.status = req.getStatus();
        if (req.getJoinDate() != null) existing.joinDate = req.getJoinDate();

        return studentRepository.save(existing);
    }

    // Update Status Only
    @Transactional
    public Student updateStatus(Long id, String status) {
        Student student = getById(id);
        student.status = status;
        return studentRepository.save(student);
    }

    // Delete - FIXED VERSION WITH FOREIGN KEY CONSTRAINT HANDLING
    @Transactional
    public String deleteStudent(Long id) {
        Student student = getById(id);
        
        // Clear bed assignment if student has a bed assigned
        if (student.bed != null) {
            student.bed.status = "Available";
            student.bed.student = null;
            bedRepository.save(student.bed);
        }
        
        // Clear room assignment
        student.room = null;
        student.bed = null;
        student.hostelBlock = null;
        student.roomType = null;
        student.roomNo = null;
        student.bedNo = null;
        student.allocatedOn = null;
        
        studentRepository.save(student);
        
        // Now delete the student and user
        studentRepository.delete(student);
        userRepository.delete(student.user);
        
        return "Deleted student with id: " + id;
    }

    // Partial Update
    @Transactional
    public Student updatePartial(Long id, Map<String, Object> updates) {
        Student existing = getById(id);
        User user = existing.user;

        if (updates.containsKey("name")) user.name = (String) updates.get("name");
        if (updates.containsKey("email")) user.email = (String) updates.get("email");
        if (updates.containsKey("phone")) user.phone = (String) updates.get("phone");
        userRepository.save(user);

        if (updates.containsKey("gender")) existing.gender = (String) updates.get("gender");
        if (updates.containsKey("dateOfBirth")) existing.dob = LocalDate.parse((String) updates.get("dateOfBirth"));
        if (updates.containsKey("yearSemester")) existing.yearSemester = (String) updates.get("yearSemester");
        if (updates.containsKey("guardianName")) existing.guardianName = (String) updates.get("guardianName");
        if (updates.containsKey("guardianPhone")) existing.guardianPhone = (String) updates.get("guardianPhone");
        if (updates.containsKey("address")) existing.address = (String) updates.get("address");

        return studentRepository.save(existing);
    }

    // Assign Room
    @Transactional
    public Student assignRoom(Long studentId, com.hms.hms.dto.AssignRoomRequest request) {
        Student student = getById(studentId);
        Room room = roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new RuntimeException("Room not found"));
        Bed bed = bedRepository.findByRoomIdAndBedNumber(request.getRoomId(), request.getBedNo());
        if (bed == null) {
            throw new RuntimeException("Bed not found in room");
        }

        // Validate bed is available
        if (!"Available".equals(bed.status)) {
            throw new RuntimeException("Bed is not available");
        }

        // Check if room is full
        long occupiedBeds = room.beds.stream().filter(b -> "Occupied".equals(b.status)).count();
        if (occupiedBeds >= room.totalBeds) {
            throw new RuntimeException("Room is full");
        }

        // If student already has a room, free the old bed
        if (student.bed != null) {
            Bed oldBed = student.bed;
            oldBed.status = "Available";
            oldBed.student = null;
            bedRepository.save(oldBed);
        }

        // Assign new bed
        bed.status = "Occupied";
        bed.student = student;
        bedRepository.save(bed);

        // Update student
        student.room = room;
        student.bed = bed;
        student.hostelBlock = room.hostelBlock;
        student.roomType = room.roomType;
        student.roomNo = room.roomNumber;
        student.bedNo = bed.bedNumber;
        student.allocatedOn = LocalDate.now();

        return studentRepository.save(student);
    }

    // Update student profile
    @Transactional
    public StudentProfileDTO updateStudentProfile(Long studentId, RegisterRequest request) {
        Student student = getById(studentId);
        
        // Update User entity fields
        if (request.getName() != null) {
            student.user.name = request.getName();
        }
        if (request.getPhone() != null) {
            student.user.phone = request.getPhone();
        }
        
        // Update Student entity fields
        if (request.getGender() != null) {
            student.gender = request.getGender();
        }
        if (request.getDob() != null) {
            student.dob = request.getDob();
        }
        if (request.getNationality() != null) {
            student.nationality = request.getNationality();
        }
        if (request.getCourse() != null) {
            student.course = request.getCourse();
        }
        if (request.getYearSemester() != null) {
            student.yearSemester = request.getYearSemester();
        }
        if (request.getGuardianName() != null) {
            student.guardianName = request.getGuardianName();
        }
        if (request.getGuardianPhone() != null) {
            student.guardianPhone = request.getGuardianPhone();
        }
        if (request.getGuardianRelation() != null) {
            student.guardianRelation = request.getGuardianRelation();
        }
        if (request.getAddress() != null) {
            student.address = request.getAddress();
        }
        
        userRepository.save(student.user);
        studentRepository.save(student);
        
        return getProfile(studentId);
    }

    // Change password
    @Transactional
    public boolean changePassword(Long studentId, String currentPassword, String newPassword) {
        Student student = getById(studentId);
        User user = student.user;
        
        if (!passwordEncoder.matches(currentPassword, user.password)) {
            return false;
        }
        
        user.password = passwordEncoder.encode(newPassword);
        userRepository.save(user);
        return true;
    }

    // Create complaint
    @Transactional
    public StudentComplaintDTO createComplaint(Long studentId, String title, String category, String priority, String description, String roomNumber) {
        Student student = getById(studentId);

        if (title == null || title.isBlank()) {
            throw new RuntimeException("Complaint title is required");
        }
        if (category == null || category.isBlank()) {
            throw new RuntimeException("Complaint category is required");
        }
        if (description == null || description.isBlank()) {
            throw new RuntimeException("Complaint description is required");
        }

        LocalDate today = LocalDate.now();
        long sequence = complaintRepository.countByStudentId(studentId) + 1;
        String complaintCode = String.format("CMP-%d-%04d", today.getYear(), sequence);

        Complaint complaint = Complaint.builder()
                .complaintCode(complaintCode)
                .student(student)
                .title(title)
                .category(category)
                .priority((priority == null || priority.isBlank()) ? "Medium" : priority)
                .description(description)
                .roomNumber((roomNumber == null || roomNumber.isBlank()) ? student.roomNo : roomNumber)
                .warden(student.warden)
                .status("Open")
                .submittedDate(today)
                .submittedTime(java.time.LocalTime.now().format(DateTimeFormatter.ofPattern("hh:mm a")))
                .build();

        Complaint saved = complaintRepository.save(complaint);
        return mapToStudentComplaintDTO(saved);
    }

    public List<StudentComplaintDTO> getComplaints(Long studentId) {
        return complaintRepository.findByStudentIdOrderByCreatedAtDesc(studentId)
                .stream()
                .map(this::mapToStudentComplaintDTO)
                .collect(Collectors.toList());
    }

    public StudentComplaintDTO getComplaintById(Long studentId, String complaintId) {
        Complaint complaint = complaintRepository.findByComplaintCodeAndStudentId(complaintId, studentId)
                .orElseThrow(() -> new RuntimeException("Complaint not found: " + complaintId));

        return mapToStudentComplaintDTO(complaint);
    }

    @Transactional
    public void deleteComplaint(Long studentId, String complaintId) {
        Complaint complaint = complaintRepository.findByComplaintCodeAndStudentId(complaintId, studentId)
                .orElseThrow(() -> new RuntimeException("Complaint not found: " + complaintId));

        complaintRepository.delete(complaint);
    }

    private StudentComplaintDTO mapToStudentComplaintDTO(Complaint complaint) {
        return StudentComplaintDTO.builder()
                .id(complaint.complaintCode)
                .title(complaint.title)
                .category(complaint.category)
                .priority(complaint.priority)
                .description(complaint.description)
                .roomNumber(complaint.roomNumber)
                .hostelBlock(complaint.student != null ? complaint.student.hostelBlock : null)
                .studentName(complaint.student != null && complaint.student.user != null ? complaint.student.user.name : null)
                .studentId(complaint.student != null ? complaint.student.enrollmentNo : null)
                .status(complaint.status)
                .assignedWarden(complaint.warden != null && complaint.warden.user != null ? complaint.warden.user.name : null)
                .assignedWardenId(complaint.warden != null ? complaint.warden.id : null)
                .submittedDate(complaint.submittedDate)
                .submittedTime(complaint.submittedTime)
                .build();
    }

    // Get roommates by room number
    public List<Student> getRoommatesByRoom(String roomNumber) {
        return studentRepository.findByRoomNoAndStatusNot(roomNumber, "Inactive")
                .stream()
                .collect(Collectors.toList());
    }
}
