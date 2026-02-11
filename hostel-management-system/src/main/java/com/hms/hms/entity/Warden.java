package com.hms.hms.entity;


import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "warden")
public class Warden {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String name;
    private String email;
    private Long phone;
    private String gender;
    private String address;
    private String password;
    private LocalDate joinDate;

    @ManyToOne
    @JoinColumn(name = "admin_id")
    private Admin admin;

    public Integer getId() {
        return id;
    }
    public void setId(Integer id) {
        this.id = id;
    }

    public void setName(String name){
        this.name = name;
    }
    public String getName(){
        return this.name;
    }

    public void setEmail(String email){
        this.email = email;
    }
    public String getEmail(){
        return this.email;
    }

    public void setPhone(Long phone){
        this.phone = phone;
    }
    public Long getPhone(){
        return this.phone;
    }

    public void setGender(String gender){
        this.gender = gender;
    }
    public String getGender(){
        return this.gender;
    }

    public void setAddress(String address){
        this.address = address;
    }
    public String getAddress(){
        return this.address;
    }

    public void setPassword(String password){
        this.password = password;
    }
    public String getPassword(){
        return this.password;
    }

    public void setJoinDate(LocalDate joinDate){
        this.joinDate = joinDate;
    }
    public LocalDate getJoinDate(){
        return this.joinDate;
    }

    public Admin getAdmin() {
        return admin;
    }
    public void setAdmin(Admin admin) {
        this.admin = admin;
    }



}
