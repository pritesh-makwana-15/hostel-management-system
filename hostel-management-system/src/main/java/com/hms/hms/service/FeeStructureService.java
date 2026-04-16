package com.hms.hms.service;

import com.hms.hms.dto.FeeStructureDTO;
import com.hms.hms.entity.FeeStructure;
import com.hms.hms.exception.FeeStructureConflictException;
import com.hms.hms.repository.FeeStructureRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FeeStructureService {

    private static final Logger logger = LoggerFactory.getLogger(FeeStructureService.class);

    @Autowired
    private FeeStructureRepository feeStructureRepository;

    public FeeStructureDTO createFeeStructure(FeeStructureDTO dto) {
        String hostelBlock = normalizeHostelBlock(dto.hostelBlock);
        String roomType = normalizeRoomType(dto.roomType);

        if (feeStructureRepository.existsByHostelBlockIgnoreCaseAndRoomTypeIgnoreCase(hostelBlock, roomType)) {
            throw new FeeStructureConflictException(
                "Fee structure already exists for block '" + hostelBlock + "' and room type '" + roomType + "'"
            );
        }

        logger.info("Creating fee structure with data: {}", dto);
        FeeStructure feeStructure = FeeStructure.builder()
            .hostelBlock(hostelBlock)
            .roomType(roomType)
                .monthlyFee(dto.monthlyFee)
                .securityDeposit(dto.securityDeposit)
                .utilities(dto.utilities)
                .lateFee(dto.lateFee)
                .status(dto.status != null ? dto.status : "Active")
                .build();

        logger.info("Fee structure entity: {}", feeStructure);
        FeeStructure saved = feeStructureRepository.save(feeStructure);
        logger.info("Saved fee structure with ID: {}", saved.id);
        return mapToDTO(saved);
    }

    public List<FeeStructureDTO> getAllFeeStructures() {
        return feeStructureRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public FeeStructureDTO getFeeStructureById(Long id) {
        FeeStructure feeStructure = feeStructureRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Fee Structure not found with id: " + id));
        return mapToDTO(feeStructure);
    }

    public FeeStructureDTO updateFeeStructure(Long id, FeeStructureDTO dto) {
        FeeStructure feeStructure = feeStructureRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Fee Structure not found with id: " + id));

        String hostelBlock = normalizeHostelBlock(dto.hostelBlock);
        String roomType = normalizeRoomType(dto.roomType);

        if (feeStructureRepository.existsByHostelBlockIgnoreCaseAndRoomTypeIgnoreCaseAndIdNot(hostelBlock, roomType, id)) {
            throw new FeeStructureConflictException(
                "Fee structure already exists for block '" + hostelBlock + "' and room type '" + roomType + "'"
            );
        }

        feeStructure.hostelBlock = hostelBlock;
        feeStructure.roomType = roomType;
        feeStructure.monthlyFee = dto.monthlyFee;
        feeStructure.securityDeposit = dto.securityDeposit;
        feeStructure.utilities = dto.utilities;
        feeStructure.lateFee = dto.lateFee;
        if (dto.status != null) {
            feeStructure.status = dto.status;
        }

        FeeStructure updated = feeStructureRepository.save(feeStructure);
        return mapToDTO(updated);
    }

    public void deleteFeeStructure(Long id) {
        feeStructureRepository.deleteById(id);
    }

    public List<FeeStructureDTO> getFeeStructuresByBlock(String hostelBlock) {
        return feeStructureRepository.findByHostelBlock(hostelBlock).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<FeeStructureDTO> getFeeStructuresByRoomType(String roomType) {
        return feeStructureRepository.findByRoomType(roomType).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public boolean feeStructureExists(String hostelBlock, String roomType, Long excludeId) {
        String normalizedHostelBlock = normalizeHostelBlock(hostelBlock);
        String normalizedRoomType = normalizeRoomType(roomType);

        if (excludeId != null) {
            return feeStructureRepository.existsByHostelBlockIgnoreCaseAndRoomTypeIgnoreCaseAndIdNot(
                    normalizedHostelBlock,
                    normalizedRoomType,
                    excludeId
            );
        }

        return feeStructureRepository.existsByHostelBlockIgnoreCaseAndRoomTypeIgnoreCase(
                normalizedHostelBlock,
                normalizedRoomType
        );
    }

    private String normalizeHostelBlock(String hostelBlock) {
        if (hostelBlock == null || hostelBlock.trim().isEmpty()) {
            throw new RuntimeException("Hostel block is required");
        }
        return hostelBlock.trim();
    }

    private String normalizeRoomType(String roomType) {
        if (roomType == null || roomType.trim().isEmpty()) {
            throw new RuntimeException("Room type is required");
        }

        String normalized = roomType.trim();
        if ("ac".equalsIgnoreCase(normalized)) {
            return "AC";
        }
        if ("non-ac".equalsIgnoreCase(normalized) || "non ac".equalsIgnoreCase(normalized)) {
            return "Non-AC";
        }
        return normalized;
    }

    private FeeStructureDTO mapToDTO(FeeStructure feeStructure) {
        return FeeStructureDTO.builder()
                .id(feeStructure.id)
                .hostelBlock(feeStructure.hostelBlock)
                .roomType(feeStructure.roomType)
                .monthlyFee(feeStructure.monthlyFee)
                .securityDeposit(feeStructure.securityDeposit)
                .utilities(feeStructure.utilities)
                .lateFee(feeStructure.lateFee)
                .status(feeStructure.status)
                .createdAt(feeStructure.createdAt)
                .build();
    }
}