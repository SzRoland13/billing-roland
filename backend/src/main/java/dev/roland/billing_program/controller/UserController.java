package dev.roland.billing_program.controller;

import dev.roland.billing_program.facade.UserFacade;
import dev.roland.billing_program.model.User;
import dev.roland.billing_program.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.Set;


@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final UserFacade userFacade;

    @GetMapping("/info")
    public User getUserDetails() {
      return userService.getUserDetails();
    }

    @GetMapping
    public Page<User> getUsers(Pageable pageable) {
        return userService.getUsers(pageable);
    }

    @PutMapping("/{id}/roles")
    public User updateRoles(@PathVariable Long id, @RequestBody Set<Long> roleIds) {
        return userFacade.updateUserRoles(id, roleIds);
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
    }


}
