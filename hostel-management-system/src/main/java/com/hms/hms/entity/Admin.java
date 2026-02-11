package com.hms.hms.entity;


import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "admin")
public class Admin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Integer id;
    private String username;
    private String password;
    private String name;
    private String email;
    private Long phone;
    private String role;

    @OneToMany(mappedBy = "admin")
    private List<Warden> wardens;

    public Admin(){

    }

    public void setId(Integer id){
        this.id =id;
    }
    public Integer getId(){
        return this.id;
    }

    public void setUsername(String username){
        this.username =username;
    }
    public String getUsername(){
        return this.username;
    }

    public void setPassword(String password){
        this.password =password;
    }
    public String getPassword(){
        return this.password;
    }

    public void setName(String name){
        this.name =name;
    }
    public String getName(){
        return this.name;
    }

    public void setEmail(String email){
        this.email =email;
    }
    public String getEmail(){
        return this.email;
    }

    public void setPhone(Long phone){
        this.phone =phone;
    }
    public Long getPhone(){
        return this.phone;
    }

    public void setRole(String role){
        this.role =role;
    }
    public String getRole(){
        return this.role;
    }

    public List<Warden> getWardens() {
        return wardens;
    }
    public void setWardens(List<Warden> wardens) {
        this.wardens = wardens;
    }
}

