package com.hms.hms;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@SpringBootApplication
@EnableJpaAuditing
public class HostelManagementSystemApplication{

	public static void main(String[] args) {
		SpringApplication.run(HostelManagementSystemApplication.class, args);
		System.out.println("Hello");
		 System.out.println(new BCryptPasswordEncoder().encode("prm123"));
	}

}
