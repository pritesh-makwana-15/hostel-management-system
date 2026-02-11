package com.hms.hms.controller;


import com.hms.hms.entity.Warden;
import com.hms.hms.service.WardenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/warden")
public class WardenController {


    @Autowired
    private WardenService wardenService;

    @GetMapping
    public List<Warden> getallWarden(){
        return wardenService.getallWarden();
    }

    @PostMapping
    public Warden saveallWarden(@RequestBody Warden warden){
        return wardenService.saveallWarden(warden);
    }

    @GetMapping("/{id}")
    public Warden getById(@PathVariable Integer id){
        return wardenService.getById(id);
    }

    @PutMapping("/{id}")
    public Warden updateWarden(@RequestBody Warden warden,@PathVariable Integer id){
        warden.setId(id);
        return wardenService.updateWarden(warden);
    }

    @DeleteMapping("/{id}")
    public String deleteWardenById(@PathVariable Integer id){
        return wardenService.deleteWardenById(id);
    }


}
