package dev.roland.billing_program.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import dev.roland.billing_program.model.Invoice;

public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
}
