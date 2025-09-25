package dev.roland.billing_program.service;

import dev.roland.billing_program.dto.LoginRequestDTO;
import dev.roland.billing_program.dto.LoginResponseDTO;
import dev.roland.billing_program.dto.RegistrationRequestDTO;
import dev.roland.billing_program.model.RefreshToken;
import dev.roland.billing_program.model.Role;
import dev.roland.billing_program.model.User;
import dev.roland.billing_program.repository.RefreshTokenRepository;
import dev.roland.billing_program.repository.RoleRepository;
import dev.roland.billing_program.repository.UserRepository;
import dev.roland.billing_program.security.JWTUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final RoleRepository roleRepository;
    private final JWTUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;
    private final CaptchaService captchaService;

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

        return new LoginResponseDTO(userDTO, generateTokens(user), false, "");
    }

    @Override
    public ResponseEntity<LoginResponseDTO> login(LoginRequestDTO loginRequestDTO) {
        User user = userRepository.findByUsername(loginRequestDTO.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (user.getFailedLoginAttempts() >= 3) {
            System.out.println(loginRequestDTO);
            if (loginRequestDTO.getCaptchaResponse() == null
                    || loginRequestDTO.getSessionId() == null
                    || !captchaService.validateCaptcha(loginRequestDTO.getSessionId(), loginRequestDTO.getCaptchaResponse())) {
                return ResponseEntity
                        .status(HttpStatus.UNAUTHORIZED)
                        .body(new LoginResponseDTO(null, null, true, "CAPTCHA required or invalid"));
            }
        }

        try {
            UsernamePasswordAuthenticationToken authInputToken = new UsernamePasswordAuthenticationToken(loginRequestDTO.getUsername(), loginRequestDTO.getPassword());
            authenticationManager.authenticate(authInputToken);

            user.setFailedLoginAttempts(0);
            user.setLastFailedLogin(null);
            userRepository.save(user);

            LoginResponseDTO.UserDTO userDTO = new LoginResponseDTO.UserDTO(
                    user.getName(),
                    user.getUsername(),
                    user.getRoles().stream().map(Role::getName).toList()
            );

            return ResponseEntity.ok(new LoginResponseDTO(userDTO, generateTokens(user),false, ""));
        } catch (Exception e) {
            user.setFailedLoginAttempts(user.getFailedLoginAttempts() + 1);
            user.setLastFailedLogin(LocalDateTime.now());
            userRepository.save(user);

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
        Role role = roleRepository.findByName(request.getRoleName())
                .orElseThrow(() -> new RuntimeException("Role not found: " + request.getRoleName()));


        User user = new User();
        user.setName(request.getName());
        user.setUsername(request.getUsername());
        user.setPassword(request.getPassword());
        user.setRoles(Collections.singleton(role));

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
