import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Button, TextField, Typography } from "@mui/material";
import type { Invoice } from "../utils/types";
import { fetchInvoiceById } from "../api/services/invoiceService";

const InvoiceViewPage = () => {
  const { id } = useParams<{ id: string }>();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    const numId = Number(id);
    if (Number.isNaN(numId)) {
      setError("Invalid invoice id");
      return;
    }

    setLoading(true);
    fetchInvoiceById(numId)
      .then((inv) => {
        setInvoice(inv);
      })
      .catch((err: any) =>
        setError(err?.response?.data?.message || "Failed to load invoice")
      )
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!invoice) return <Typography>No invoice found</Typography>;

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignContent="center"
      gap={20}
      marginTop={8}
      marginLeft={14}
      marginRight={14}
    >
      <Typography variant="h4" mb={2} sx={{ color: "black" }}>
        Invoice Details
      </Typography>
      <Box display="flex" flexDirection="column" gap={2}>
        <TextField
          label="Customer Name"
          value={invoice.customerName}
          slotProps={{ input: { readOnly: true } }}
        />
        <TextField
          label="Issue Date"
          value={new Date(invoice.issueDate).toLocaleDateString()}
          slotProps={{ input: { readOnly: true } }}
        />
        <TextField
          label="Due Date"
          value={new Date(invoice.dueDate).toLocaleDateString()}
          slotProps={{ input: { readOnly: true } }}
        />
        <TextField
          label="Item Name"
          value={invoice.itemName}
          slotProps={{ input: { readOnly: true } }}
        />
        <TextField
          label="Comment"
          value={invoice.comment}
          slotProps={{ input: { readOnly: true } }}
        />
        <TextField
          label="Price"
          value={invoice.price}
          slotProps={{ input: { readOnly: true } }}
        />
      </Box>
      <Box mt={2}>
        <Button variant="outlined" onClick={() => navigate("/invoices")}>
          Back
        </Button>
      </Box>
    </Box>
  );
};

export default InvoiceViewPage;
