package dev.roland.billing_program.service;

import dev.roland.billing_program.dto.LoginRequestDTO;
import dev.roland.billing_program.dto.LoginResponseDTO;
import dev.roland.billing_program.dto.RegistrationRequestDTO;
import dev.roland.billing_program.model.RefreshToken;
import dev.roland.billing_program.model.Role;
import dev.roland.billing_program.model.User;
import dev.roland.billing_program.repository.RefreshTokenRepository;
import dev.roland.billing_program.repository.UserRepository;
import dev.roland.billing_program.security.JWTUtil;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    @Autowired
    private JWTUtil jwtUtil;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public LoginResponseDTO handleRegistration(RegistrationRequestDTO registrationRequestDTO) {
        String encodedPass = passwordEncoder.encode(registrationRequestDTO.getPassword());
        registrationRequestDTO.setPassword(encodedPass);
        User user = save(registrationRequestDTO);

        LoginResponseDTO.UserDTO userDTO = new LoginResponseDTO.UserDTO(
                user.getName(),
                user.getUsername(),
                user.getRoles().stream().map(Role::getName).toList()
        );

        return new LoginResponseDTO(userDTO, generateTokens(user));
    }

    @Override
    public LoginResponseDTO login(LoginRequestDTO loginRequestDTO) {
        try {
            UsernamePasswordAuthenticationToken authInputToken = new UsernamePasswordAuthenticationToken(loginRequestDTO.getUsername(), loginRequestDTO.getPassword());
            authenticationManager.authenticate(authInputToken);
            User user = userRepository.findByUsername(loginRequestDTO.getUsername()).orElseThrow(() -> new RuntimeException("User not found"));

            LoginResponseDTO.UserDTO userDTO = new LoginResponseDTO.UserDTO(
                    user.getName(),
                    user.getUsername(),
                    user.getRoles().stream().map(Role::getName).toList()
            );

            return new LoginResponseDTO(userDTO, generateTokens(user));
        } catch (Exception e) {
            throw new RuntimeException("Invalid username/password.");
        }
    }

    @Override
    public ResponseEntity<LoginResponseDTO.TokensDTO> handleRefresh(Map<String, String> request) {
        String refreshToken = request.get("refreshToken");

        RefreshToken tokenEntity = refreshTokenRepository.findByToken(refreshToken)
                .orElseThrow(() -> new RuntimeException("Invalid refresh token"));

        if (tokenEntity.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Refresh token expired");
        }

        String newAccessToken = jwtUtil.generateToken(tokenEntity.getUser());
        return ResponseEntity.ok(new LoginResponseDTO.TokensDTO(newAccessToken, refreshToken));
    }

    private User save(RegistrationRequestDTO request) {
        User user = new User();
        user.setName(request.getName());
        user.setUsername(request.getUsername());
        user.setPassword(request.getPassword());
        user.setRoles(Collections.singleton(request.getRole()));

        return userRepository.save(user);
    }

    private void updateLastLogin(String username) {
        userRepository.updateLastLogin(username, LocalDateTime.now());
    }

    @Transactional
    private LoginResponseDTO.TokensDTO generateTokens(User user) {
        String refreshToken = UUID.randomUUID().toString();
        String accessToken = jwtUtil.generateToken(user);

        RefreshToken tokenEntity = new RefreshToken();
        tokenEntity.setToken(refreshToken);
        tokenEntity.setUser(user);
        tokenEntity.setExpiryDate(LocalDateTime.now().plusDays(7));
        refreshTokenRepository.save(tokenEntity);

        updateLastLogin(user.getUsername());

        return new LoginResponseDTO.TokensDTO(accessToken, refreshToken);
    }
}
