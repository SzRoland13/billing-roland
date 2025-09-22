package dev.roland.billing_program.service;

import dev.roland.billing_program.dto.LoginRequestDTO;
import dev.roland.billing_program.dto.LoginTokens;
import dev.roland.billing_program.dto.RegistrationRequestDTO;
import org.springframework.http.ResponseEntity;

import java.util.Map;

public interface AuthService {

    LoginTokens handleRegistration(RegistrationRequestDTO registrationRequestDTO);

    LoginTokens login(LoginRequestDTO loginRequestDTO);

    ResponseEntity<Map<String, Object>> handleRefresh(Map<String, String> request);
}
