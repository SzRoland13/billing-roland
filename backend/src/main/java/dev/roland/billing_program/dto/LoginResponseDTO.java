package dev.roland.billing_program.dto;

import lombok.*;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
public class LoginResponseDTO {

    private UserDTO user;
    private TokensDTO tokens;
    private boolean captchaRequired = false;
    private String message;

    @NoArgsConstructor
    @AllArgsConstructor
    @Getter
    @Setter
    @ToString
    public static class UserDTO {
        private String name;
        private String username;
        private List<String> roles;
    }

    @NoArgsConstructor
    @AllArgsConstructor
    @Getter
    @Setter
    @ToString
    public static class TokensDTO {
        private String accessToken;
        private String refreshToken;
    }
}
