package com.hms.hms.controller;

import com.hms.hms.dto.ApiResponse;
import com.hms.hms.entity.Complaint;
import com.hms.hms.entity.FeePaymentTransaction;
import com.hms.hms.entity.Student;
import com.hms.hms.repository.BedRepository;
import com.hms.hms.repository.ComplaintRepository;
import com.hms.hms.repository.FeePaymentTransactionRepository;
import com.hms.hms.repository.StudentRepository;
import com.hms.hms.repository.RoomRepository;
import com.hms.hms.repository.WardenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/dashboard")
@PreAuthorize("hasRole('ADMIN')")
public class AdminDashboardController {

    @Autowired
    private StudentRepository studentRepository;
    
    @Autowired
    private RoomRepository roomRepository;
    
    @Autowired
    private WardenRepository wardenRepository;

    @Autowired
    private ComplaintRepository complaintRepository;

    @Autowired
    private FeePaymentTransactionRepository feePaymentTransactionRepository;

    @Autowired
    private BedRepository bedRepository;

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDashboardStats() {
        try {
            Map<String, Object> stats = new HashMap<>();

            long totalStudents = studentRepository.count();
            long activeStudents = studentRepository.findAll().stream()
                    .filter(s -> s.status != null && "ACTIVE".equalsIgnoreCase(s.status))
                    .count();
            long pendingStudents = studentRepository.findAll().stream()
                    .filter(s -> s.status != null && "PENDING".equalsIgnoreCase(s.status))
                    .count();

            long totalRooms = roomRepository.count();
            long occupiedRooms = studentRepository.findAll().stream()
                    .filter(s -> s.room != null && (s.status == null || !"INACTIVE".equalsIgnoreCase(s.status)))
                    .map(s -> s.room.id)
                    .filter(Objects::nonNull)
                    .distinct()
                    .count();
            long availableRooms = totalRooms - occupiedRooms;

            long totalWardens = wardenRepository.count();
            long activeWardens = totalWardens;

            BigDecimal currentMonthCollection = feePaymentTransactionRepository.findAll().stream()
                    .filter(p -> p.status != null && "VERIFIED".equalsIgnoreCase(p.status))
                    .filter(p -> resolvePaymentDateTime(p) != null)
                    .filter(p -> YearMonth.from(resolvePaymentDateTime(p)).equals(YearMonth.now()))
                    .map(p -> p.amount == null ? BigDecimal.ZERO : p.amount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            stats.put("totalStudents", totalStudents);
            stats.put("activeStudents", activeStudents);
            stats.put("pendingStudents", pendingStudents);
            stats.put("totalRooms", totalRooms);
            stats.put("occupiedRooms", occupiedRooms);
            stats.put("availableRooms", availableRooms);
            stats.put("totalWardens", totalWardens);
            stats.put("activeWardens", activeWardens);
            stats.put("monthlyFeeCollection", currentMonthCollection);

            double occupancyRate = totalRooms > 0 ? (double) occupiedRooms / totalRooms * 100 : 0;
            stats.put("occupancyRate", Math.round(occupancyRate * 100.0) / 100.0);

            return ResponseEntity.ok(ApiResponse.success("Dashboard stats fetched successfully", stats));

        } catch (Exception e) {
            return ResponseEntity.status(500)
                .body(ApiResponse.error("Failed to fetch dashboard stats: " + e.getMessage()));
        }
    }

    @GetMapping("/recent-activity")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getRecentActivity() {
        try {
            Map<String, Object> activity = new HashMap<>();

            List<Map<String, Object>> recentRegistrations = studentRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"))
                    .stream()
                    .limit(5)
                    .map(this::mapStudentRegistration)
                    .collect(Collectors.toList());

            List<Map<String, Object>> recentComplaints = complaintRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"))
                    .stream()
                    .limit(5)
                    .map(this::mapComplaintActivity)
                    .collect(Collectors.toList());

            List<Map<String, Object>> recentPayments = feePaymentTransactionRepository.findAll().stream()
                    .sorted((a, b) -> {
                        LocalDateTime left = resolvePaymentDateTime(a);
                        LocalDateTime right = resolvePaymentDateTime(b);
                        if (left == null && right == null) {
                            return 0;
                        }
                        if (left == null) {
                            return 1;
                        }
                        if (right == null) {
                            return -1;
                        }
                        return right.compareTo(left);
                    })
                    .limit(5)
                    .map(this::mapPaymentActivity)
                    .collect(Collectors.toList());

            activity.put("recentRegistrations", recentRegistrations);
            activity.put("recentComplaints", recentComplaints);
            activity.put("recentPayments", recentPayments);

            return ResponseEntity.ok(ApiResponse.success("Recent activity fetched successfully", activity));

        } catch (Exception e) {
            return ResponseEntity.status(500)
                .body(ApiResponse.error("Failed to fetch recent activity: " + e.getMessage()));
        }
    }

    @GetMapping("/alerts")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDashboardAlerts() {
        try {
            Map<String, Object> alerts = new HashMap<>();

            List<Map<String, Object>> pendingComplaints = complaintRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"))
                    .stream()
                    .filter(c -> c.status == null || !"RESOLVED".equalsIgnoreCase(c.status))
                    .limit(5)
                    .map(c -> {
                        Map<String, Object> item = new HashMap<>();
                        item.put("id", c.id);
                        item.put("title", c.title);
                        item.put("student", c.student != null && c.student.user != null ? c.student.user.name : "Unknown");
                        item.put("priority", c.priority);
                        item.put("status", c.status != null ? c.status : "Open");
                        item.put("statusColor", mapPriorityColor(c.priority));
                        return item;
                    })
                    .collect(Collectors.toList());

            List<Map<String, Object>> pendingFees = feePaymentTransactionRepository.findAll().stream()
                    .filter(p -> p.status != null && "PENDING".equalsIgnoreCase(p.status))
                    .sorted(Comparator.comparing(this::resolvePaymentDateTime, Comparator.nullsLast(Comparator.reverseOrder())))
                    .limit(5)
                    .map(p -> {
                        Map<String, Object> item = new HashMap<>();
                        item.put("id", p.paymentId != null ? p.paymentId : p.id);
                        item.put("student", p.student != null && p.student.user != null ? p.student.user.name : "Unknown");
                        item.put("amount", p.amount == null ? "0" : p.amount.toPlainString());
                        item.put("status", p.status);
                        item.put("statusColor", "#F59E0B");
                        return item;
                    })
                    .collect(Collectors.toList());

            alerts.put("pendingComplaints", pendingComplaints);
            alerts.put("pendingFees", pendingFees);

            return ResponseEntity.ok(ApiResponse.success("Dashboard alerts fetched successfully", alerts));
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(ApiResponse.error("Failed to fetch dashboard alerts: " + e.getMessage()));
        }
    }

    @GetMapping("/charts")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDashboardChartData() {
        try {
            Map<String, Object> charts = new HashMap<>();

            List<YearMonth> months = new ArrayList<>();
            YearMonth current = YearMonth.now();
            for (int i = 5; i >= 0; i--) {
                months.add(current.minusMonths(i));
            }

            Map<YearMonth, BigDecimal> monthlyCollection = new LinkedHashMap<>();
            for (YearMonth month : months) {
                monthlyCollection.put(month, BigDecimal.ZERO);
            }

            for (FeePaymentTransaction payment : feePaymentTransactionRepository.findAll()) {
                if (payment.status == null || !"VERIFIED".equalsIgnoreCase(payment.status)) {
                    continue;
                }
                LocalDateTime paymentTime = resolvePaymentDateTime(payment);
                if (paymentTime == null) {
                    continue;
                }
                YearMonth month = YearMonth.from(paymentTime);
                if (!monthlyCollection.containsKey(month)) {
                    continue;
                }
                monthlyCollection.put(month, monthlyCollection.get(month).add(payment.amount == null ? BigDecimal.ZERO : payment.amount));
            }

            List<Map<String, Object>> monthlyFeeData = monthlyCollection.entrySet().stream()
                    .map(entry -> {
                        Map<String, Object> item = new HashMap<>();
                        item.put("month", entry.getKey().format(DateTimeFormatter.ofPattern("MMM")));
                        item.put("value", entry.getValue());
                        return item;
                    })
                    .collect(Collectors.toList());

            long occupiedBeds = bedRepository.findAll().stream()
                    .filter(b -> b.status != null && "OCCUPIED".equalsIgnoreCase(b.status))
                    .count();
            long availableBeds = bedRepository.findAll().stream()
                    .filter(b -> b.status != null && "AVAILABLE".equalsIgnoreCase(b.status))
                    .count();
            long maintenanceBeds = bedRepository.findAll().stream()
                    .filter(b -> b.status != null && "MAINTENANCE".equalsIgnoreCase(b.status))
                    .count();

            if (occupiedBeds == 0 && availableBeds == 0 && maintenanceBeds == 0) {
                long totalRooms = roomRepository.count();
                long assignedStudents = studentRepository.findAll().stream().filter(s -> s.room != null).count();
                occupiedBeds = assignedStudents;
                availableBeds = Math.max(totalRooms - assignedStudents, 0);
                maintenanceBeds = 0;
            }

            Map<String, Object> occupancy = new HashMap<>();
            occupancy.put("occupied", occupiedBeds);
            occupancy.put("available", availableBeds);
            occupancy.put("maintenance", maintenanceBeds);

            charts.put("monthlyFeeData", monthlyFeeData);
            charts.put("roomOccupancy", occupancy);

            return ResponseEntity.ok(ApiResponse.success("Dashboard chart data fetched successfully", charts));
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(ApiResponse.error("Failed to fetch dashboard chart data: " + e.getMessage()));
        }
    }

    private Map<String, Object> mapStudentRegistration(Student student) {
        Map<String, Object> item = new HashMap<>();
        item.put("id", student.id);
        item.put("studentName", student.user != null ? student.user.name : "Unknown");
        item.put("status", student.status);
        item.put("timestamp", student.createdAt != null ? student.createdAt.toString() : null);
        return item;
    }

    private Map<String, Object> mapComplaintActivity(Complaint complaint) {
        Map<String, Object> item = new HashMap<>();
        item.put("id", complaint.id);
        item.put("title", complaint.title);
        item.put("status", complaint.status != null ? complaint.status : "Open");
        item.put("priority", complaint.priority);
        item.put("studentName", complaint.student != null && complaint.student.user != null ? complaint.student.user.name : "Unknown");
        item.put("timestamp", complaint.createdAt != null ? complaint.createdAt.toString() : null);
        return item;
    }

    private Map<String, Object> mapPaymentActivity(FeePaymentTransaction payment) {
        Map<String, Object> item = new HashMap<>();
        item.put("id", payment.paymentId != null ? payment.paymentId : payment.id);
        item.put("studentName", payment.student != null && payment.student.user != null ? payment.student.user.name : "Unknown");
        item.put("amount", payment.amount == null ? "0" : payment.amount.toPlainString());
        item.put("status", payment.status);
        LocalDateTime ts = resolvePaymentDateTime(payment);
        item.put("timestamp", ts != null ? ts.toString() : null);
        return item;
    }

    private String mapPriorityColor(String priority) {
        if (priority == null) {
            return "#6B7280";
        }
        if ("HIGH".equalsIgnoreCase(priority)) {
            return "#EF4444";
        }
        if ("MEDIUM".equalsIgnoreCase(priority)) {
            return "#F59E0B";
        }
        return "#10B981";
    }

    private LocalDateTime resolvePaymentDateTime(FeePaymentTransaction payment) {
        if (payment == null) {
            return null;
        }
        if (payment.verifiedAt != null) {
            return payment.verifiedAt;
        }
        if (payment.createdAt != null) {
            return payment.createdAt;
        }
        if (payment.paymentDate != null) {
            return payment.paymentDate.atStartOfDay();
        }
        return null;
    }
}
