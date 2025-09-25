package dev.roland.billing_program.service;

import dev.roland.billing_program.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;
import java.util.Set;

public interface UserService {

    User getUserDetails();
    Page<User> getUsers(Pageable pageable);
    User updateUserRoles(Long userId, Set<Long> roleIds);
    void deleteUser(Long userId);
    Optional<User> findById(Long id);
    User save(User user);
}
