package com.crud.hello1;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class Hello1Application {
    @Autowired
    static UserController userController = new UserController();
    public static void main(String[] args) {
        SpringApplication.run(Hello1Application.class, args);
        userController.listUsers(null);
    }
}
