package dev.roland.billing_program.service;

import dev.roland.billing_program.dto.LoginRequestDTO;
import dev.roland.billing_program.dto.LoginTokens;
import dev.roland.billing_program.dto.RegistrationRequestDTO;
import dev.roland.billing_program.model.RefreshToken;
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
    public LoginTokens handleRegistration(RegistrationRequestDTO registrationRequestDTO) {
        String encodedPass = passwordEncoder.encode(registrationRequestDTO.getPassword());
        registrationRequestDTO.setPassword(encodedPass);
        User user = save(registrationRequestDTO);

        return generateTokens(user);
    }

    @Override
    public LoginTokens login(LoginRequestDTO loginRequestDTO) {
        try {
            UsernamePasswordAuthenticationToken authInputToken = new UsernamePasswordAuthenticationToken(loginRequestDTO.getUsername(), loginRequestDTO.getPassword());
            authenticationManager.authenticate(authInputToken);

            return generateTokens(loginRequestDTO.getUsername());
        } catch (Exception e) {
            throw new RuntimeException("Invalid username/password.");
        }
    }

    @Override
    public ResponseEntity<Map<String, Object>> handleRefresh(Map<String, String> request) {
        String refreshToken = request.get("refreshToken");

        RefreshToken tokenEntity = refreshTokenRepository.findByToken(refreshToken)
                .orElseThrow(() -> new RuntimeException("Invalid refresh token"));

        if (tokenEntity.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Refresh token expired");
        }

        String newAccessToken = jwtUtil.generateToken(tokenEntity.getUser());
        return ResponseEntity.ok(Map.of("accessToken", newAccessToken));
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

    private LoginTokens generateTokens(String username) {
        Optional<User> user = userRepository.findByUsername(username);

        if (user.isPresent()) {
            return generateTokens(user.get());
        } else throw new RuntimeException("User not found");
    }

    @Transactional
    private LoginTokens generateTokens(User user) {
        String refreshToken = UUID.randomUUID().toString();
        String accessToken = jwtUtil.generateToken(user);

        RefreshToken tokenEntity = new RefreshToken();
        tokenEntity.setToken(refreshToken);
        tokenEntity.setUser(user);
        tokenEntity.setExpiryDate(LocalDateTime.now().plusDays(7));
        refreshTokenRepository.save(tokenEntity);

        updateLastLogin(user.getUsername());

        return new LoginTokens(accessToken, refreshToken);
    }
}
