package com.hms.hms.controller;


import com.hms.hms.entity.Admin;
import com.hms.hms.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @GetMapping
    public List<Admin> getallAdmin(){
        return adminService.getallAdmin();
    }

    @PostMapping
    public Admin saveallAdmin(@RequestBody Admin admin){
        return adminService.saveallAdmin(admin);
    }

    @GetMapping("/{id}")
    public Admin getById(@PathVariable Integer id){
        return adminService.getById(id);
    }

    @PutMapping("/{id}")
    public Admin updateAdmin(@RequestBody Admin admin,@PathVariable Integer id){
        admin.setId(id);
        return adminService.updateAdmin(admin);
    }

    @DeleteMapping("/{id}")
    public String deleteAdminById(@PathVariable Integer id){
        return adminService.deleteAdminById(id);
    }

}
