package dev.roland.billing_program.service;

import com.github.cage.Cage;
import com.github.cage.GCage;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class CaptchaService {

    private final Map<String, String> captchaStore = new ConcurrentHashMap<>();

    public byte[] generateCaptcha(String sessionId) throws IOException {
        Cage cage = new GCage();
        String token = cage.getTokenGenerator().next();
        captchaStore.put(sessionId, token);

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        cage.draw(token, baos);
        return baos.toByteArray();
    }

    public boolean validateCaptcha(String sessionId, String input) {
        String token = captchaStore.get(sessionId);
        if (token != null && token.equalsIgnoreCase(input)) {
            captchaStore.remove(sessionId);
            return true;
        }
        return false;
    }
}
