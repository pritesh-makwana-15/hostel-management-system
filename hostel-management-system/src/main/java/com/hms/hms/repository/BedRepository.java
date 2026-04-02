package com.hms.hms.repository;

import com.hms.hms.entity.Bed;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BedRepository extends JpaRepository<Bed, Long> {
    List<Bed> findByRoomId(Long roomId);
    void deleteByRoomId(Long roomId);
    int countByRoomId(Long roomId);
}
