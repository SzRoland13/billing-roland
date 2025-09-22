package dev.roland.billing_program.dto;

import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
public class LoginTokens {

    private String accessToken;
    private String refreshToken;
}
