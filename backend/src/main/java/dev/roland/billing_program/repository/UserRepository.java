package dev.roland.billing_program.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import dev.roland.billing_program.model.User;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);

}
