package com.hms.hms;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@SpringBootApplication
public class HostelManagementSystemApplication {

	public static void main(String[] args) {
		SpringApplication.run(HostelManagementSystemApplication.class, args);
		System.out.println("Hello");
		System.out.println(new BCryptPasswordEncoder().encode("warden123"));
	}

}
