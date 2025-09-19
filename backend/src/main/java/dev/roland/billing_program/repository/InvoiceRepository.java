package dev.roland.billing_program.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import dev.roland.billing_program.model.Invoice;
import org.springframework.stereotype.Repository;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
}
