package dev.roland.billing_program.security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import dev.roland.billing_program.model.Role;
import dev.roland.billing_program.model.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;

@Component
public class JWTUtil {

    @Value("${jwt_secret}")
    private String secret;

    public String generateToken(User user) throws IllegalArgumentException, JWTCreationException {
        List<String> roleNames = user.getRoles().stream()
                .map(Role::getName)
                .toList();

        return JWT.create()
                .withSubject("User Details")
                .withClaim("username", user.getUsername())
                .withClaim("roles", roleNames)
                .withIssuedAt(new Date())
                .withIssuer("BILLING APPLICATION")
                .withExpiresAt(Date.from(LocalDateTime.now()
                        .plusMinutes(15)
                        .atZone(ZoneId.systemDefault())
                        .toInstant()))
                .sign(Algorithm.HMAC256(secret));

    }

    public DecodedJWT validateToken(String token) throws JWTVerificationException {
        JWTVerifier verifier = JWT.require(Algorithm.HMAC256(secret))
                .withSubject("User Details")
                .withIssuer("BILLING APPLICATION")
                .build();

        return verifier.verify(token);
    }

    public String getUsername(String token) {
        return validateToken(token).getClaim("username").asString();
    }

    public List<String> getRoles(String token) {
        return validateToken(token).getClaim("roles").asList(String.class);
    }

}
