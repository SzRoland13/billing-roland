package dev.roland.billing_program.dto;

import dev.roland.billing_program.model.Role;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class RegistrationRequestDTO {

    private String name;
    private String username;
    private String password;
    private String roleName;
}
