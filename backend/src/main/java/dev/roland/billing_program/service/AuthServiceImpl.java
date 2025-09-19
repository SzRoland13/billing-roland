package dev.roland.billing_program.service;

import dev.roland.billing_program.dto.LoginRequestDTO;
import dev.roland.billing_program.dto.RegistrationRequestDTO;
import dev.roland.billing_program.model.User;
import dev.roland.billing_program.repository.UserRepository;
import dev.roland.billing_program.security.JWTUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Map;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JWTUtil jwtUtil;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public Map<String, Object> registrate(RegistrationRequestDTO registrationRequestDTO) {
        String encodedPass = passwordEncoder.encode(registrationRequestDTO.getPassword());
        registrationRequestDTO.setPassword(encodedPass);
        User user = save(registrationRequestDTO);

        String token = jwtUtil.generateToken(user.getUsername());
        return Collections.singletonMap("jwt-token", token);
    }

    @Override
    public Map<String, Object> login(LoginRequestDTO loginRequestDTO) {
        try {
            UsernamePasswordAuthenticationToken authInputToken = new UsernamePasswordAuthenticationToken(loginRequestDTO.getUsername(), loginRequestDTO.getPassword());
            authenticationManager.authenticate(authInputToken);

            String token = jwtUtil.generateToken(loginRequestDTO.getUsername());
            return Collections.singletonMap("jwt-token", token);
        } catch (Exception e) {
            throw new RuntimeException("Invalid username/password.");
        }
    }

    @Override
    public User save(RegistrationRequestDTO request) {
        User user = new User();
        user.setName(request.getName());
        user.setUsername(request.getUsername());
        user.setPassword(request.getPassword());
        user.setRoles(Collections.singleton(request.getRole()));

        return userRepository.save(user);
    }
}
