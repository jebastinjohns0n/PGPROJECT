package com.cybernaut.atms;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.config.EnableMongoAuditing;

@SpringBootApplication
@EnableMongoAuditing
public class AtmsApplication {

    public static void main(String[] args) {
        SpringApplication.run(AtmsApplication.class, args);
    }
}

