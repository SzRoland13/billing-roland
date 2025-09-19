package dev.roland.billing_program.controller;

import dev.roland.billing_program.model.User;
import dev.roland.billing_program.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api/v1/user")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/info")
    public User getUserDetails() {
      return userService.getUserDetails();
    }
}
