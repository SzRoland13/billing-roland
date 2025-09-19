package dev.roland.billing_program.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import dev.roland.billing_program.model.User;


public interface UserRepository extends JpaRepository<User, Long> {

}
