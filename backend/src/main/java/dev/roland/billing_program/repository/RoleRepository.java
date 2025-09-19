package dev.roland.billing_program.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import dev.roland.billing_program.model.Role;
import org.springframework.stereotype.Repository;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {

}
