package com.hms.hms.service.impl;

import com.hms.hms.dto.RoomRequestDTO;
import com.hms.hms.dto.RoomResponseDTO;
import com.hms.hms.entity.Bed;
import com.hms.hms.entity.Room;
import com.hms.hms.repository.BedRepository;
import com.hms.hms.repository.RoomRepository;
import com.hms.hms.service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class RoomServiceImpl implements RoomService {

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private BedRepository bedRepository;

    // ── ADD ROOM ─────────────────────────────────────────────
    @Override
    public RoomResponseDTO addRoom(RoomRequestDTO request) {
        if (roomRepository.existsByRoomNumber(request.getRoomNumber())) {
            throw new RuntimeException("Room number '" + request.getRoomNumber() + "' already exists.");
        }

        Room room = Room.builder()
                .hostelBlock(request.getHostelBlock())
                .roomNumber(request.getRoomNumber())
                .roomType(request.getRoomType())
                .floor(request.getFloor())
                .description(request.getDescription())
                .totalBeds(request.getTotalBeds())
                .build();

        room = roomRepository.save(room);

        // Auto-create beds: B1, B2, B3...
        List<Bed> beds = new ArrayList<>();
        for (int i = 1; i <= request.getTotalBeds(); i++) {
            beds.add(Bed.builder()
                    .bedNumber("B" + i)
                    .status("Available")
                    .room(room)
                    .build());
        }
        bedRepository.saveAll(beds);

        return toDTO(room, beds);
    }

    // ── GET ALL ROOMS ────────────────────────────────────────
    @Override
    @Transactional(readOnly = true)
    public List<RoomResponseDTO> getAllRooms() {
        return roomRepository.findAll().stream()
                .map(room -> {
                    List<Bed> beds = bedRepository.findByRoomId(room.getId());
                    return toDTO(room, beds);
                })
                .collect(Collectors.toList());
    }

    // ── GET SINGLE ROOM ──────────────────────────────────────
    @Override
    @Transactional(readOnly = true)
    public RoomResponseDTO getRoomById(Long id) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Room not found with id: " + id));
        List<Bed> beds = bedRepository.findByRoomId(id);
        return toDTO(room, beds);
    }

    // ── UPDATE ROOM ──────────────────────────────────────────
    @Override
    public RoomResponseDTO updateRoom(Long id, RoomRequestDTO request) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Room not found with id: " + id));

        // Check duplicate room number (ignore self)
        roomRepository.findByRoomNumber(request.getRoomNumber()).ifPresent(existing -> {
            if (!existing.getId().equals(id)) {
                throw new RuntimeException("Room number '" + request.getRoomNumber() + "' already exists.");
            }
        });

        room.setHostelBlock(request.getHostelBlock());
        room.setRoomNumber(request.getRoomNumber());
        room.setRoomType(request.getRoomType());
        room.setFloor(request.getFloor());
        room.setDescription(request.getDescription());

        int oldTotal = room.getTotalBeds();
        int newTotal = request.getTotalBeds();
        room.setTotalBeds(newTotal);
        room = roomRepository.save(room);

        // Adjust beds
        List<Bed> existingBeds = bedRepository.findByRoomId(id);

        if (newTotal > oldTotal) {
            // Add more beds
            for (int i = oldTotal + 1; i <= newTotal; i++) {
                existingBeds.add(Bed.builder()
                        .bedNumber("B" + i)
                        .status("Available")
                        .room(room)
                        .build());
            }
            bedRepository.saveAll(existingBeds.subList(oldTotal, existingBeds.size()));
        } else if (newTotal < oldTotal) {
            // Remove extra beds from the end (only Available ones)
            List<Bed> toDelete = existingBeds.subList(newTotal, existingBeds.size());
            for (Bed bed : toDelete) {
                if ("Occupied".equals(bed.getStatus())) {
                    throw new RuntimeException("Cannot reduce beds: bed " + bed.getBedNumber() + " is occupied.");
                }
            }
            bedRepository.deleteAll(toDelete);
            existingBeds = existingBeds.subList(0, newTotal);
        }

        return toDTO(room, existingBeds);
    }

    // ── HELPER: Entity → DTO ─────────────────────────────────
    private RoomResponseDTO toDTO(Room room, List<Bed> beds) {
        long occupied = beds.stream().filter(b -> "Occupied".equals(b.getStatus())).count();
        long available = beds.stream().filter(b -> "Available".equals(b.getStatus())).count();

        String status;
        if (occupied == 0) status = "Available";
        else if (occupied == beds.size()) status = "Full";
        else status = "Partial";

        List<RoomResponseDTO.BedDTO> bedDTOs = beds.stream()
                .map(b -> RoomResponseDTO.BedDTO.builder()
                        .id(b.getId())
                        .bedNumber(b.getBedNumber())
                        .status(b.getStatus())
                        .build())
                .collect(Collectors.toList());

        return RoomResponseDTO.builder()
                .id(room.getId())
                .hostelBlock(room.getHostelBlock())
                .roomNumber(room.getRoomNumber())
                .roomType(room.getRoomType())
                .floor(room.getFloor())
                .description(room.getDescription())
                .totalBeds(room.getTotalBeds())
                .occupiedBeds((int) occupied)
                .availableBeds((int) available)
                .occupancyStatus(status)
                .createdAt(room.getCreatedAt())
                .beds(bedDTOs)
                .build();
    }
}
