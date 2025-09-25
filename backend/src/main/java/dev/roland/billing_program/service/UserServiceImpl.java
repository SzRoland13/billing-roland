package dev.roland.billing_program.service;

import dev.roland.billing_program.model.User;
import dev.roland.billing_program.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    public User getUserDetails() {
        String userName = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        Optional<User> optionalUser = userRepository.findByUsername(userName);

        if (optionalUser.isPresent()) {
            return optionalUser.get();
        } else throw new RuntimeException("User credentials not found");
    }

    @Override
    public Page<User> getUsers(Pageable pageable) {
        return userRepository.findAll(pageable);
    }

    @Override
    public User updateUserRoles(Long userId, Set<Long> roleIds) {
        return null;
    }

    @Override
    public void deleteUser(Long userId) {

    }

    @Override
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    @Override
    public User save(User user) {
        return userRepository.save(user);
    }
}
