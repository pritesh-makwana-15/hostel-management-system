package com.hms.hms.controller;

import com.hms.hms.dto.*;
import com.hms.hms.entity.Bed;
import com.hms.hms.entity.Room;
import com.hms.hms.entity.Student;
import com.hms.hms.repository.BedRepository;
import com.hms.hms.repository.RoomRepository;
import com.hms.hms.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/warden/rooms")
public class WardenRoomController {

    @Autowired private RoomRepository roomRepository;
    @Autowired private BedRepository bedRepository;
    @Autowired private StudentService studentService;

    @GetMapping
    @PreAuthorize("hasRole('WARDEN')")
    public ResponseEntity<ApiResponse<List<WardenRoomViewDTO>>> getAll() {
        List<WardenRoomViewDTO> rooms = roomRepository.findAll().stream()
                .map(room -> toViewDTO(room, bedRepository.findByRoomId(room.getId())))
                .collect(Collectors.toList());

        return ResponseEntity.ok(ApiResponse.success("Rooms fetched", rooms));
    }

    @GetMapping("/{roomId}")
    @PreAuthorize("hasRole('WARDEN')")
    public ResponseEntity<ApiResponse<WardenRoomViewDTO>> getById(@PathVariable String roomId) {
        long id = parseRoomId(roomId);
        Room room = roomRepository.findById(id).orElse(null);
        if (room == null) return ResponseEntity.notFound().build();

        List<Bed> beds = bedRepository.findByRoomId(id);
        return ResponseEntity.ok(ApiResponse.success("Room found", toViewDTO(room, beds)));
    }

    @PostMapping("/{roomId}/assign")
    @PreAuthorize("hasRole('WARDEN')")
    public ResponseEntity<ApiResponse<Student>> assignBed(
            @PathVariable String roomId,
            @RequestBody WardenAssignBedRequest request
    ) {
        long id = parseRoomId(roomId);

        AssignRoomRequest assign = new AssignRoomRequest();
        assign.setRoomId(id);
        assign.setBedNo(request.getBedNo());

        Student updated = studentService.assignRoom(request.getStudentId(), assign);
        return ResponseEntity.ok(ApiResponse.success("Bed assigned", updated));
    }

    private static long parseRoomId(String roomId) {
        if (roomId == null) throw new IllegalArgumentException("roomId is required");
        String digits = roomId.replaceAll("[^0-9]", "");
        if (digits.isBlank()) throw new IllegalArgumentException("Invalid room id: " + roomId);
        return Long.parseLong(digits);
    }

    private WardenRoomViewDTO toViewDTO(Room room, List<Bed> beds) {
        List<Bed> sortedBeds = beds.stream()
                .sorted(Comparator.comparing(this::bedSortKey))
                .toList();

        int occupied = (int) sortedBeds.stream().filter(b -> "Occupied".equalsIgnoreCase(nullToEmpty(b.getStatus()))).count();

        String occupancyStatus;
        if (occupied == 0) occupancyStatus = "Available";
        else if (occupied >= room.getTotalBeds()) occupancyStatus = "Fully Occupied";
        else occupancyStatus = "Partially Occupied";

        List<WardenBedViewDTO> bedViews = sortedBeds.stream()
                .map(b -> {
                    Student s = b.getStudent();
                    return WardenBedViewDTO.builder()
                            .id(b.getBedNumber())
                            .status(normalizeBedStatus(b.getStatus()))
                            .studentName(s != null ? s.getName() : null)
                            .enrollment(s != null ? s.getEnrollmentNo() : null)
                            .build();
                })
                .collect(Collectors.toList());

        return WardenRoomViewDTO.builder()
                .id(formatRoomId(room.getId()))
                .blockHostel(room.getHostelBlock())
                .roomNumber(room.getRoomNumber())
                .roomType(room.getRoomType())
                .floor(room.getFloor())
                .totalBeds(room.getTotalBeds())
                .occupiedBeds(occupied)
                .availableBeds(Math.max(0, room.getTotalBeds() - occupied))
                .occupancyStatus(occupancyStatus)
                .description(Optional.ofNullable(room.getDescription()).orElse(""))
                .beds(bedViews)
                .build();
    }

    private String bedSortKey(Bed bed) {
        String bn = nullToEmpty(bed.getBedNumber()).toUpperCase(Locale.ROOT).trim(); // e.g. "B12"
        String digits = bn.replaceAll("[^0-9]", "");
        int n = digits.isBlank() ? Integer.MAX_VALUE : Integer.parseInt(digits);
        return String.format("%08d-%s", n, bn);
    }

    private static String formatRoomId(Long id) {
        if (id == null) return null;
        return "R" + String.format("%03d", id);
    }

    private static String normalizeBedStatus(String status) {
        String s = nullToEmpty(status).trim();
        if (s.equalsIgnoreCase("occupied")) return "Occupied";
        if (s.equalsIgnoreCase("available")) return "Available";
        if (s.equalsIgnoreCase("maintenance")) return "Maintenance";
        return s.isBlank() ? "Available" : s;
    }

    private static String nullToEmpty(String s) {
        return s == null ? "" : s;
    }

    @lombok.Data
    public static class WardenAssignBedRequest {
        private Long studentId;
        private String bedNo; // "B1", "B2", ...
    }
}

