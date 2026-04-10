package com.hms.hms.controller;

import com.hms.hms.dto.ApiResponse;
import com.hms.hms.dto.RoomRequestDTO;
import com.hms.hms.dto.RoomResponseDTO;
import com.hms.hms.service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/rooms")
@PreAuthorize("hasRole('ADMIN')")
public class RoomController {

    @Autowired
    private RoomService roomService;

    // POST /api/admin/rooms — Add Room + auto-create beds
    @PostMapping
    public ResponseEntity<ApiResponse<RoomResponseDTO>> addRoom(@RequestBody RoomRequestDTO request) {
        RoomResponseDTO room = roomService.addRoom(request);
        return ResponseEntity.ok(ApiResponse.success("Room added successfully", room));
    }

    // GET /api/admin/rooms — Get all rooms
    @GetMapping
    public ResponseEntity<ApiResponse<List<RoomResponseDTO>>> getAllRooms() {
        List<RoomResponseDTO> rooms = roomService.getAllRooms();
        return ResponseEntity.ok(ApiResponse.success("Rooms fetched successfully", rooms));
    }

    // GET /api/admin/rooms/{id} — Get single room
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<RoomResponseDTO>> getRoomById(@PathVariable Long id) {
        RoomResponseDTO room = roomService.getRoomById(id);
        return ResponseEntity.ok(ApiResponse.success("Room fetched successfully", room));
    }

    // PUT /api/admin/rooms/{id} — Update room + adjust beds
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<RoomResponseDTO>> updateRoom(
            @PathVariable Long id,
            @RequestBody RoomRequestDTO request) {
        RoomResponseDTO room = roomService.updateRoom(id, request);
        return ResponseEntity.ok(ApiResponse.success("Room updated successfully", room));
    }

    // GET /api/admin/rooms/blocks - Get unique hostel blocks
    @GetMapping("/blocks")
    public ResponseEntity<ApiResponse<List<String>>> getUniqueBlocks() {
        List<String> blocks = roomService.getUniqueBlocks();
        return ResponseEntity.ok(ApiResponse.success("Blocks fetched successfully", blocks));
    }

    // GET /api/admin/rooms/test - Test endpoint to check room count
    @GetMapping("/test")
    public ResponseEntity<ApiResponse<String>> testRooms() {
        try {
            List<RoomResponseDTO> rooms = roomService.getAllRooms();
            return ResponseEntity.ok(ApiResponse.success("Test successful", "Found " + rooms.size() + " rooms"));
        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.success("Test failed", "Error: " + e.getMessage()));
        }
    }
}
