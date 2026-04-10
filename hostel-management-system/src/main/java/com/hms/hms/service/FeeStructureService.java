package com.hms.hms.service;

import com.hms.hms.dto.FeeStructureDTO;
import com.hms.hms.entity.FeeStructure;
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
        logger.info("Creating fee structure with data: {}", dto);
        FeeStructure feeStructure = FeeStructure.builder()
                .hostelBlock(dto.hostelBlock)
                .roomType(dto.roomType)
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

        feeStructure.hostelBlock = dto.hostelBlock;
        feeStructure.roomType = dto.roomType;
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