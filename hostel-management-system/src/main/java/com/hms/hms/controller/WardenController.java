package com.hms.hms.controller;

import com.hms.hms.dto.RegisterRequest;
import com.hms.hms.entity.Warden;
import com.hms.hms.service.WardenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/warden")
public class WardenController {

    @Autowired
    private WardenService wardenService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'WARDEN')")
    public List<Warden> getAllWardens() {
        return wardenService.getAllWardens();
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Warden> createWarden(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(wardenService.createWarden(request));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'WARDEN')")
    public ResponseEntity<Warden> getById(@PathVariable Long id) {
        Warden warden = wardenService.getById(id);
        return warden != null ? ResponseEntity.ok(warden) : ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Warden> updateWarden(@PathVariable Long id, @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(wardenService.updateWarden(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteWarden(@PathVariable Long id) {
        return ResponseEntity.ok(wardenService.deleteWarden(id));
    }
}