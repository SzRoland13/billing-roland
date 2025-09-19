package dev.roland.billing_program.controller;

import dev.roland.billing_program.dto.LoginRequestDTO;
import dev.roland.billing_program.dto.RegistrationRequestDTO;
import dev.roland.billing_program.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    @Autowired
    private AuthService authService;


    @PostMapping("/register")
    public Map<String, Object> registerHandler(@RequestBody RegistrationRequestDTO user) {
        return authService.registrate(user);
    }

    @PostMapping("/login")
    public Map<String, Object> loginHandler(@RequestBody LoginRequestDTO body) {
        return authService.login(body);
    }
}
