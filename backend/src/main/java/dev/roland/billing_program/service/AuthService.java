package dev.roland.billing_program.service;

import dev.roland.billing_program.dto.LoginRequestDTO;
import dev.roland.billing_program.dto.RegistrationRequestDTO;
import dev.roland.billing_program.model.User;

import java.util.Map;

public interface AuthService {

    Map<String, Object> registrate(RegistrationRequestDTO registrationRequestDTO);

    Map<String, Object> login(LoginRequestDTO loginRequestDTO);

    User save(RegistrationRequestDTO request);
}
