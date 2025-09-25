package dev.roland.billing_program.facade;

import dev.roland.billing_program.model.User;

import java.util.Set;

public interface UserFacade {

    User updateUserRoles(Long userId, Set<Long> roleIds);
}
