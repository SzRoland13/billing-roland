package dev.roland.billing_program.service;

import dev.roland.billing_program.dto.LoginRequestDTO;
import dev.roland.billing_program.dto.LoginResponseDTO;
import dev.roland.billing_program.dto.RegistrationRequestDTO;
import org.springframework.http.ResponseEntity;

import java.util.Map;

public interface AuthService {

    LoginResponseDTO handleRegistration(RegistrationRequestDTO registrationRequestDTO);

    LoginResponseDTO login(LoginRequestDTO loginRequestDTO);

    ResponseEntity<LoginResponseDTO.TokensDTO> handleRefresh(Map<String, String> request);
}
