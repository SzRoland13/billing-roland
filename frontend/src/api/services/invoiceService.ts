import { useInvoiceStore } from "../../store/invoiceStore";
import type { Invoice } from "../../utils/types";

export const fetchInvoices = () => useInvoiceStore.getState().fetchInvoices();

export const fetchInvoiceById = (id: number) =>
  useInvoiceStore.getState().fetchInvoiceById(id);

export const createInvoice = (invoice: Omit<Invoice, "id">) =>
  useInvoiceStore.getState().createInvoice(invoice);

export const getInvoices = () => useInvoiceStore.getState().invoices;

export const fetchInvoicesPage = async (page = 0, size = 10) => {
  await useInvoiceStore.getState().fetchInvoicesPage(page, size);
};
