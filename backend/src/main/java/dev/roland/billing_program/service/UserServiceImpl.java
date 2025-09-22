package dev.roland.billing_program.service;

import dev.roland.billing_program.model.User;
import dev.roland.billing_program.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public User getUserDetails() {
        String userName = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        Optional<User> optionalUser = userRepository.findByUsername(userName);

        if (optionalUser.isPresent()) {
            return optionalUser.get();
        } else throw new RuntimeException("User credentials not found");
    }
}
