package dev.roland.billing_program.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class LoginRequestDTO {

    private String username;
    private String password;
    private String captchaResponse;
    private String sessionId;
}
