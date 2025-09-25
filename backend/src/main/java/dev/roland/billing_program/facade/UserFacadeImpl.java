package dev.roland.billing_program.facade;

import dev.roland.billing_program.model.Role;
import dev.roland.billing_program.model.User;
import dev.roland.billing_program.service.RoleService;
import dev.roland.billing_program.service.UserService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class UserFacadeImpl implements UserFacade {

    private final UserService userService;
    private  final RoleService roleService;

    @Override
    @Transactional
    public User updateUserRoles(Long userId, Set<Long> roleIds) {
       User user = userService.findById(userId)
               .orElseThrow(() -> new RuntimeException("User not found"));

       Set<Role> roles = new HashSet<>(roleService.findAllById(roleIds));

       user.setRoles(roles);

       return userService.save(user);
    }
}
