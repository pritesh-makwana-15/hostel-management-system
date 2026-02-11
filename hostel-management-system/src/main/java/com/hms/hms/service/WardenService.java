package com.hms.hms.service;


import com.hms.hms.repository.*;
import com.hms.hms.entity.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WardenService {


    @Autowired
    private WardenRepository wardenRepository;

    public Warden saveallWarden(Warden warden){
        return wardenRepository.save(warden);
    }

    public List<Warden> getallWarden(){
        return wardenRepository.findAll();
    }

    public Warden getById(Integer id){
        return wardenRepository.findById(id).orElse(null);
    }

    public Warden updateWarden(Warden warden){
        Warden existing = wardenRepository.findById(warden.getId()).orElse(null);
        if (existing == null) return null;
        existing.setName(warden.getName());
        existing.setEmail(warden.getEmail());
        existing.setPhone(warden.getPhone());
        existing.setGender(warden.getGender());
        existing.setAddress(warden.getAddress());
        existing.setPassword(warden.getPassword());
        existing.setJoinDate(warden.getJoinDate());
        existing.setAdmin(warden.getAdmin());
        return wardenRepository.save(warden);
    }

    public String deleteWardenById(Integer id){
        wardenRepository.deleteById(id);
        return "Delete " + id;
    }
}
