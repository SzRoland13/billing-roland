package dev.roland.billing_program.controller;

import dev.roland.billing_program.dto.LoginRequestDTO;
import dev.roland.billing_program.dto.LoginTokens;
import dev.roland.billing_program.dto.RegistrationRequestDTO;
import dev.roland.billing_program.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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
    public LoginTokens handleRegistration(@RequestBody RegistrationRequestDTO body) {
        return authService.handleRegistration(body);
    }

    @PostMapping("/login")
    public LoginTokens handleLogin(@RequestBody LoginRequestDTO body) {
        return authService.login(body);
    }

    @PostMapping("/refresh")
    public ResponseEntity<Map<String, Object>> handleRefresh(@RequestBody Map<String, String> request) {
        return authService.handleRefresh(request);
    }
}
