import { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { createInvoice } from "../api/services/invoiceService";

const CreateInvoicePage = () => {
  const navigate = useNavigate();
  const [customerName, setCustomerName] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [itemName, setItemName] = useState("");
  const [comment, setComment] = useState("");
  const [price, setPrice] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createInvoice({
      customerName,
      issueDate: new Date(issueDate).toISOString(),
      dueDate: new Date(dueDate).toISOString(),
      itemName,
      comment,
      price: Number(price),
    });
    navigate("/invoices");
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignContent="center"
      gap={10}
      marginTop={8}
      marginLeft={14}
      marginRight={14}
    >
      <Typography variant="h4" mb={2} sx={{ color: "black" }}>
        Create Invoice
      </Typography>
      <Box display="flex" flexDirection="column" gap={2}>
        <TextField
          label="Customer Name"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
        />
        <TextField
          label="Issue Date"
          type="date"
          slotProps={{ inputLabel: { shrink: true } }}
          value={issueDate}
          onChange={(e) => setIssueDate(e.target.value)}
        />
        <TextField
          label="Due Date"
          type="date"
          slotProps={{ inputLabel: { shrink: true } }}
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <TextField
          label="Item Name"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
        />
        <TextField
          label="Comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <TextField
          label="Price"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <Box display="flex" gap={2}>
          <Button variant="outlined" onClick={() => navigate("/invoices")}>
            Back
          </Button>
          <Button variant="contained" onClick={handleSubmit}>
            Save
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default CreateInvoicePage;
