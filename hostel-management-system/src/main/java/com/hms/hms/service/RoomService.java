package com.hms.hms.service;

import com.hms.hms.dto.RoomRequestDTO;
import com.hms.hms.dto.RoomResponseDTO;

import java.util.List;

public interface RoomService {
    RoomResponseDTO addRoom(RoomRequestDTO request);
    List<RoomResponseDTO> getAllRooms();
    RoomResponseDTO getRoomById(Long id);
    RoomResponseDTO updateRoom(Long id, RoomRequestDTO request);
}
