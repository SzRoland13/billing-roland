package dev.roland.billing_program.service;

import dev.roland.billing_program.model.Role;
import dev.roland.billing_program.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class RoleServiceImpl implements RoleService {
    
    private final RoleRepository roleRepository;


    @Override
    public List<Role> getAllRoles() {
        return roleRepository.findAll();
    }

    @Override
    public List<Role> findAllById(Set<Long> ids) {
        return roleRepository.findAllById(ids);
    }
}
