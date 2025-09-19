package dev.roland.billing_program.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import dev.roland.billing_program.model.Role;

public interface RoleRepository extends JpaRepository<Role, Long> {

}
