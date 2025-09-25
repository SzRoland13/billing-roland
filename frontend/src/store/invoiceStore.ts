import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import axiosClient from "../api/axiosClient";
import type { Invoice } from "../utils/types";

interface InvoiceState {
  invoices: Invoice[];
  totalPages: number;
  currentPage: number;
  setInvoices: (data: Invoice[]) => void;
  fetchInvoices: () => Promise<void>;
  fetchInvoicesPage: (page: number, size: number) => Promise<void>;
  fetchInvoiceById: (id: number) => Promise<Invoice>;
  createInvoice: (invoice: Omit<Invoice, "id">) => Promise<void>;
}

export const useInvoiceStore = create(
  immer<InvoiceState>((set) => ({
    invoices: [],
    totalPages: 0,
    currentPage: 0,

    setInvoices: (data) =>
      set((state) => {
        state.invoices = data;
      }),

    fetchInvoices: async () => {
      const res = await axiosClient.get("/invoices");
      set((state) => {
        state.invoices = res.data;
      });
    },

    fetchInvoicesPage: async (page = 0, size = 10) => {
      const res = await axiosClient.get(
        `/invoices/page?page=${page}&size=${size}`
      );
      set((state) => {
        state.invoices = res.data.content;
        state.totalPages = res.data.totalPages;
        state.currentPage = res.data.number;
      });
    },

    fetchInvoiceById: async (id) => {
      return (await axiosClient.get(`/invoices/${id}`)).data;
    },

    createInvoice: async (invoice) => {
      const res = await axiosClient.post("/invoices", invoice);
      set((state) => {
        state.invoices.push(res.data);
      });
    },
  }))
);
