package com.hms.hms.service;

import com.hms.hms.dto.FeePaymentDTO;
import com.hms.hms.dto.StudentFeeSummaryDTO;
import com.hms.hms.dto.SubmitFeePaymentRequest;
import com.hms.hms.entity.FeePaymentTransaction;
import com.hms.hms.entity.FeeStructure;
import com.hms.hms.entity.Student;
import com.hms.hms.entity.StudentFeeRecord;
import com.hms.hms.repository.FeePaymentTransactionRepository;
import com.hms.hms.repository.FeeStructureRepository;
import com.hms.hms.repository.StudentFeeRecordRepository;
import com.hms.hms.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class FeePaymentService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private FeeStructureRepository feeStructureRepository;

    @Autowired
    private StudentFeeRecordRepository studentFeeRecordRepository;

    @Autowired
    private FeePaymentTransactionRepository feePaymentTransactionRepository;

    @Transactional
    public StudentFeeSummaryDTO getMyFeeSummary(String email, String academicCycle) {
        Student student = getStudentByEmail(email);
        if (student.hostelBlock == null || student.roomType == null) {
            return null;
        }

        String cycle = normalizeAcademicCycle(academicCycle);
        Optional<StudentFeeRecord> existing = studentFeeRecordRepository
                .findByStudentIdAndAcademicCycleAndHostelBlockIgnoreCaseAndRoomTypeIgnoreCase(
                        student.id,
                        cycle,
                        student.hostelBlock,
                        student.roomType
                );

        if (existing.isPresent()) {
            return toSummaryDTO(existing.get());
        }

        if (feeStructureRepository.findByHostelBlockAndRoomType(student.hostelBlock, student.roomType).isEmpty()) {
            return null;
        }

        StudentFeeRecord record = getOrCreateFeeRecord(student, cycle);
        return toSummaryDTO(record);
    }

    @Transactional(readOnly = true)
    public List<FeePaymentDTO> getMyPayments(String email) {
        Student student = getStudentByEmail(email);
        return feePaymentTransactionRepository.findByStudentIdOrderByCreatedAtDesc(student.id)
                .stream()
                .map(this::toPaymentDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public FeePaymentDTO getMyPaymentById(String email, String paymentId) {
        Student student = getStudentByEmail(email);
        FeePaymentTransaction payment = feePaymentTransactionRepository
                .findByPaymentIdAndStudentId(paymentId, student.id)
                .orElseThrow(() -> new RuntimeException("Payment not found for this student"));
        return toPaymentDTO(payment);
    }

    @Transactional
    public FeePaymentDTO submitPayment(String email, SubmitFeePaymentRequest request) {
        Student student = getStudentByEmail(email);
        String cycle = normalizeAcademicCycle(request.getAcademicCycle());

        if (request.getAmount() == null || request.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Payment amount must be greater than 0");
        }

        String transactionId = normalizeTransactionId(request.getTransactionId());
        if (feePaymentTransactionRepository.existsByTransactionIdIgnoreCase(transactionId)) {
            throw new RuntimeException("Duplicate transaction id. This payment was already submitted.");
        }

        StudentFeeRecord feeRecord = getOrCreateFeeRecord(student, cycle);

        BigDecimal approvedBalance = safe(feeRecord.balanceAmount);
        if (approvedBalance.compareTo(BigDecimal.ZERO) == 0) {
            throw new RuntimeException("You have already paid fees for this cycle.");
        }
        
        // Additional check: Don't allow payments if fee status is already PAID
        if ("PAID".equalsIgnoreCase(feeRecord.status)) {
            throw new RuntimeException("You have already paid fees for this cycle.");
        }

        BigDecimal pendingReserved = safe(feePaymentTransactionRepository.sumPendingAmountByFeeRecordId(feeRecord.id));
        BigDecimal availableBalance = approvedBalance.subtract(pendingReserved);
        if (availableBalance.compareTo(BigDecimal.ZERO) < 0) {
            availableBalance = BigDecimal.ZERO;
        }

        if (availableBalance.compareTo(BigDecimal.ZERO) == 0) {
            throw new RuntimeException("You already have pending payment submissions for the full remaining amount. Please wait for admin verification.");
        }

        if (request.getAmount().compareTo(availableBalance) > 0) {
            throw new RuntimeException("Payment amount cannot exceed available balance of " + availableBalance + " after pending submissions");
        }

        FeePaymentTransaction payment = FeePaymentTransaction.builder()
                .paymentId(generatePaymentId())
                .feeRecord(feeRecord)
                .student(student)
                .amount(request.getAmount())
                .paymentMethod(normalizeMethod(request.getPaymentMethod()))
                .transactionId(transactionId)
                .proofFile(normalizeProofFile(request.getProofFile()))
                .paymentDate(parseDate(request.getPaymentDate()))
                .notes(request.getNotes())
                .status("PENDING")
                .build();

        return toPaymentDTO(feePaymentTransactionRepository.save(payment));
    }

    @Transactional(readOnly = true)
    public List<StudentFeeSummaryDTO> getAllFeeRecords() {
        return studentFeeRecordRepository.findAll().stream()
                .map(this::toSummaryDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<StudentFeeSummaryDTO> getFeeRecordsByStudent(Long studentId) {
        return studentFeeRecordRepository.findByStudentIdOrderByAcademicCycleDesc(studentId).stream()
                .map(this::toSummaryDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<FeePaymentDTO> getPaymentsByStudent(Long studentId) {
        return feePaymentTransactionRepository.findByStudentIdOrderByCreatedAtDesc(studentId).stream()
                .map(this::toPaymentDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<FeePaymentDTO> getAllPayments() {
        return feePaymentTransactionRepository.findAll().stream()
                .sorted((a, b) -> {
                    if (a.createdAt == null && b.createdAt == null) return 0;
                    if (a.createdAt == null) return 1;
                    if (b.createdAt == null) return -1;
                    return b.createdAt.compareTo(a.createdAt);
                })
                .map(this::toPaymentDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public FeePaymentDTO verifyPayment(String paymentId, String verifierEmail, String note) {
        FeePaymentTransaction payment = feePaymentTransactionRepository.findByPaymentId(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        if (!"PENDING".equalsIgnoreCase(payment.status)) {
            throw new RuntimeException("Only pending payments can be verified");
        }

        StudentFeeRecord record = payment.feeRecord;
        BigDecimal remaining = safe(record.balanceAmount);

        // If request became stale, still keep admin action as VERIFIED but do not
        // mutate fee ledger values again.
        if ("PAID".equalsIgnoreCase(record.status)) {
            return verifyWithoutLedgerUpdate(
                    payment,
                    verifierEmail,
                    note,
                "AUTO_VERIFIED_BY_ADMIN: Fee record already marked as PAID"
            );
        }
        
        // If balance is now zero, request is no longer valid to verify.
        if (remaining.compareTo(BigDecimal.ZERO) == 0) {
            return verifyWithoutLedgerUpdate(
                    payment,
                    verifierEmail,
                    note,
                "AUTO_VERIFIED_BY_ADMIN: Fee already fully paid before verification"
            );
        }

        if (safe(payment.amount).compareTo(remaining) > 0) {
            return verifyWithoutLedgerUpdate(
                    payment,
                    verifierEmail,
                    note,
                "AUTO_VERIFIED_BY_ADMIN: Payment exceeds remaining balance"
            );
        }

        BigDecimal totalFee = safe(record.totalFee);
        BigDecimal updatedPaid = safe(record.paidAmount).add(safe(payment.amount));

        if (updatedPaid.compareTo(totalFee) >= 0) {
            record.paidAmount = totalFee;
            record.balanceAmount = BigDecimal.ZERO;
            record.status = "PAID";
        } else {
            record.paidAmount = updatedPaid;
            record.balanceAmount = totalFee.subtract(updatedPaid);
            record.status = resolveStatus(record.paidAmount, totalFee);
        }
        studentFeeRecordRepository.save(record);

        payment.status = "VERIFIED";
        payment.verifiedBy = verifierEmail;
        payment.verifiedAt = java.time.LocalDateTime.now();
        if (note != null && !note.isBlank()) {
            payment.notes = (payment.notes == null ? "" : payment.notes + "\n") + "ADMIN_NOTE: " + note;
        }

        return toPaymentDTO(feePaymentTransactionRepository.save(payment));
    }

    private FeePaymentDTO verifyWithoutLedgerUpdate(
            FeePaymentTransaction payment,
            String verifierEmail,
            String note,
            String reason
    ) {
        payment.status = "VERIFIED";
        payment.verifiedBy = verifierEmail;
        payment.verifiedAt = java.time.LocalDateTime.now();

        StringBuilder composedNote = new StringBuilder();
        if (payment.notes != null && !payment.notes.isBlank()) {
            composedNote.append(payment.notes).append("\n");
        }
        composedNote.append(reason);
        if (note != null && !note.isBlank()) {
            composedNote.append("\nADMIN_NOTE: ").append(note);
        }

        payment.notes = composedNote.toString();
        return toPaymentDTO(feePaymentTransactionRepository.save(payment));
    }

    @Transactional
    public FeePaymentDTO rejectPayment(String paymentId, String verifierEmail, String note) {
        FeePaymentTransaction payment = feePaymentTransactionRepository.findByPaymentId(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        if (!"PENDING".equalsIgnoreCase(payment.status)) {
            throw new RuntimeException("Only pending payments can be rejected");
        }

        payment.status = "REJECTED";
        payment.verifiedBy = verifierEmail;
        payment.verifiedAt = java.time.LocalDateTime.now();
        if (note != null && !note.isBlank()) {
            payment.notes = (payment.notes == null ? "" : payment.notes + "\n") + "ADMIN_NOTE: " + note;
        }

        return toPaymentDTO(feePaymentTransactionRepository.save(payment));
    }

    @Transactional
    public FeePaymentDTO refundPayment(String paymentId, String verifierEmail, String note) {
        FeePaymentTransaction payment = feePaymentTransactionRepository.findByPaymentId(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        if (!"VERIFIED".equalsIgnoreCase(payment.status)) {
            throw new RuntimeException("Only verified payments can be refunded");
        }

        StudentFeeRecord record = payment.feeRecord;
        BigDecimal paidAmount = safe(record.paidAmount);
        BigDecimal refundAmount = safe(payment.amount);

        if (refundAmount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Refund amount must be greater than zero");
        }

        if (paidAmount.compareTo(refundAmount) < 0) {
            throw new RuntimeException("Refund exceeds paid amount on student fee record");
        }

        record.paidAmount = paidAmount.subtract(refundAmount);
        record.balanceAmount = safe(record.totalFee).subtract(record.paidAmount);
        record.status = resolveStatus(record.paidAmount, record.totalFee);
        studentFeeRecordRepository.save(record);

        payment.status = "REFUNDED";
        payment.verifiedBy = verifierEmail;
        payment.verifiedAt = java.time.LocalDateTime.now();
        if (note != null && !note.isBlank()) {
            payment.notes = (payment.notes == null ? "" : payment.notes + "\n") + "ADMIN_NOTE: " + note;
        }

        return toPaymentDTO(feePaymentTransactionRepository.save(payment));
    }

    private Student getStudentByEmail(String email) {
        return studentRepository.findByUserEmail(email)
                .orElseThrow(() -> new RuntimeException("Student not found"));
    }

    private StudentFeeRecord getOrCreateFeeRecord(Student student, String cycle) {
        String hostelBlock = normalizeRoomValue(student.hostelBlock, "hostel block");
        String roomType = normalizeRoomValue(student.roomType, "room type");

        Optional<StudentFeeRecord> existing = studentFeeRecordRepository
                .findByStudentIdAndAcademicCycleAndHostelBlockIgnoreCaseAndRoomTypeIgnoreCase(
                        student.id,
                        cycle,
                        hostelBlock,
                        roomType
                );

        if (existing.isPresent()) {
            return existing.get();
        }

        FeeStructure feeStructure = feeStructureRepository
                .findByHostelBlockAndRoomType(hostelBlock, roomType)
                .orElseThrow(() -> new RuntimeException("No fee structure found for this student room assignment"));

        BigDecimal total = safe(feeStructure.monthlyFee).add(safe(feeStructure.utilities));

        StudentFeeRecord created = StudentFeeRecord.builder()
                .student(student)
                .feeStructure(feeStructure)
                .academicCycle(cycle)
                .hostelBlock(hostelBlock)
                .roomType(roomType)
                .totalFee(total)
                .paidAmount(BigDecimal.ZERO)
                .balanceAmount(total)
                .status("PENDING")
                .build();

        try {
            return studentFeeRecordRepository.save(created);
        } catch (DataIntegrityViolationException ex) {
            return studentFeeRecordRepository
                .findByStudentIdAndAcademicCycleAndHostelBlockIgnoreCaseAndRoomTypeIgnoreCase(
                    student.id,
                    cycle,
                    hostelBlock,
                    roomType
                )
                .orElseThrow(() -> ex);
        }
    }

    private StudentFeeSummaryDTO toSummaryDTO(StudentFeeRecord record) {
        FeeStructure fs = record.feeStructure;
        return StudentFeeSummaryDTO.builder()
                .feeId(record.id)
                .studentId(record.student != null ? record.student.id : null)
                .studentName(record.student != null && record.student.user != null ? record.student.user.name : null)
                .enrollmentNo(record.student != null ? record.student.enrollmentNo : null)
                .academicCycle(record.academicCycle)
                .hostelBlock(record.hostelBlock)
                .roomType(record.roomType)
                .totalFee(safe(record.totalFee))
                .paidAmount(safe(record.paidAmount))
                .balance(safe(record.balanceAmount))
                .status(record.status)
                .monthlyFee(fs != null ? safe(fs.monthlyFee) : BigDecimal.ZERO)
                .utilities(fs != null ? safe(fs.utilities) : BigDecimal.ZERO)
                .securityDeposit(fs != null ? safe(fs.securityDeposit) : BigDecimal.ZERO)
                .lateFee(fs != null ? safe(fs.lateFee) : BigDecimal.ZERO)
                .build();
    }

    private FeePaymentDTO toPaymentDTO(FeePaymentTransaction payment) {
        DateTimeFormatter dateTimeFmt = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        Student s = payment.student;
        return FeePaymentDTO.builder()
                .paymentId(payment.paymentId)
                .feeId(payment.feeRecord != null ? payment.feeRecord.id : null)
            .studentId(s != null ? s.id : null)
            .studentName(s != null ? s.getName() : null)
            .enrollmentNo(s != null ? s.enrollmentNo : null)
            .roomNo(s != null ? s.roomNo : null)
            .hostelBlock(s != null ? s.hostelBlock : null)
                .amount(safe(payment.amount))
                .paymentMethod(payment.paymentMethod)
                .transactionId(payment.transactionId)
                .proofFile(payment.proofFile)
                .status(payment.status)
                .paymentDate(payment.paymentDate != null ? payment.paymentDate.toString() : null)
                .createdAt(payment.createdAt != null ? payment.createdAt.format(dateTimeFmt) : null)
                .notes(payment.notes)
                .build();
    }

    private String resolveStatus(BigDecimal paid, BigDecimal total) {
        BigDecimal safePaid = safe(paid);
        BigDecimal safeTotal = safe(total);

        if (safePaid.compareTo(BigDecimal.ZERO) <= 0) {
            return "PENDING";
        }

        if (safePaid.compareTo(safeTotal) < 0) {
            return "PARTIAL";
        }

        return "PAID";
    }

    private String normalizeAcademicCycle(String value) {
        if (value == null || value.isBlank()) {
            return YearMonth.now().toString();
        }
        return value.trim();
    }

    private String normalizeRoomValue(String value, String fieldName) {
        if (value == null || value.isBlank()) {
            throw new RuntimeException("Student " + fieldName + " is not assigned");
        }
        return value.trim();
    }

    private String normalizeTransactionId(String value) {
        if (value == null || value.isBlank()) {
            throw new RuntimeException("Transaction ID is required");
        }
        return value.trim();
    }

    private String normalizeMethod(String value) {
        if (value == null || value.isBlank()) {
            return "OFFLINE";
        }
        return value.trim().toUpperCase();
    }

    private String normalizeProofFile(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        return value.trim();
    }

    private LocalDate parseDate(String value) {
        if (value == null || value.isBlank()) {
            return LocalDate.now();
        }
        try {
            return LocalDate.parse(value);
        } catch (DateTimeParseException ex) {
            return LocalDate.now();
        }
    }

    private String generatePaymentId() {
        return "PAY-" + System.currentTimeMillis();
    }

    private BigDecimal safe(BigDecimal value) {
        return value == null ? BigDecimal.ZERO : value;
    }

    private BigDecimal safe(Double value) {
        return value == null ? BigDecimal.ZERO : BigDecimal.valueOf(value);
    }
}
