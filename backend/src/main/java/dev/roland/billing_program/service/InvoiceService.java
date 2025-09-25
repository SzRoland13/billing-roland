package dev.roland.billing_program.service;

import dev.roland.billing_program.model.Invoice;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface InvoiceService {

    List<Invoice> getAllInvoices();
    Page<Invoice> getInvoices(Pageable pageable);
    Invoice getInvoiceById(Long id);
    Invoice createInvoice(Invoice invoice);
}
