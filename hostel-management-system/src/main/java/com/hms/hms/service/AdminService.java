package com.hms.hms.service;


import com.hms.hms.repository.*;
import com.hms.hms.entity.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminService {

    @Autowired
    private AdminRepository adminRepository;

    public Admin saveallAdmin(Admin admin){
        return adminRepository.save(admin);
    }

    public List<Admin> getallAdmin(){
        return adminRepository.findAll();
    }

    public Admin getById(Integer id){
        return adminRepository.findById(id).orElse(null);
    }

    public Admin updateAdmin(Admin admin){
        Admin existing = adminRepository.findById(admin.getId()).orElse(null);
        if (existing == null) return null;
        existing.setUsername(admin.getUsername());
        existing.setPassword(admin.getPassword());
        existing.setName(admin.getName());
        existing.setEmail(admin.getEmail());
        existing.setPhone(admin.getPhone());
        existing.setRole(admin.getRole());
        return adminRepository.save(admin);
    }

    public String deleteAdminById(Integer id){
        adminRepository.deleteById(id);
        return "Delete " + id;
    }
}
