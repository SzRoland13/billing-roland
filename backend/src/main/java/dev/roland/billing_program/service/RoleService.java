package dev.roland.billing_program.service;

import dev.roland.billing_program.model.Role;

import java.util.List;
import java.util.Set;

public interface RoleService {

    List<Role> getAllRoles();
    List<Role> findAllById(Set<Long> ids);
}
