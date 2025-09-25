import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Select,
  MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useInvoiceStore } from "../store/invoiceStore";
import { ROLE } from "../utils/enums";
import { useUserStore } from "../store/userStore";

const InvoicesPage = () => {
  const navigate = useNavigate();
  const invoices = useInvoiceStore((state) => state.invoices);
  const totalPages = useInvoiceStore((state) => state.totalPages);
  const currentPage = useInvoiceStore((state) => state.currentPage);
  const fetchInvoices = useInvoiceStore((state) => state.fetchInvoicesPage);

  const [pageSize, setPageSize] = useState(10);

  const userRoles = useUserStore.getState().roles;
  const rolesToCreateInvoice = [ROLE.ACCOUNTANT, ROLE.ADMIN];

  useEffect(() => {
    fetchInvoices(0, pageSize);
  }, [fetchInvoices, pageSize]);

  const handlePrev = () => {
    if (currentPage > 0) fetchInvoices(currentPage - 1, pageSize);
  };

  const handleNext = () => {
    if (currentPage + 1 < totalPages) fetchInvoices(currentPage + 1, pageSize);
  };

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
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h4" sx={{ color: "black" }}>
          Invoices
        </Typography>
        <Box display="flex" alignItems="center" gap={2}>
          <Typography sx={{ color: "black" }}>Rows per page:</Typography>
          <Select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            size="small"
          >
            {[5, 10, 20, 50].map((size) => (
              <MenuItem key={size} value={size}>
                {size}
              </MenuItem>
            ))}
          </Select>

          {userRoles.some((role) =>
            rolesToCreateInvoice.includes(role as ROLE)
          ) && (
            <Button
              variant="contained"
              onClick={() => navigate("/create-invoice")}
            >
              Create Invoice
            </Button>
          )}
        </Box>
      </Box>

      <Box>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Issue Date</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Item</TableCell>
              <TableCell>Comment</TableCell>
              <TableCell>Price</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {invoices.map((inv) => (
              <TableRow
                key={inv.id}
                onClick={() => navigate(`/invoices/${inv.id}`)}
                style={{ cursor: "pointer" }}
              >
                <TableCell>{inv.id}</TableCell>
                <TableCell>{inv.customerName}</TableCell>
                <TableCell>
                  {new Date(inv.issueDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {new Date(inv.dueDate).toLocaleDateString()}
                </TableCell>
                <TableCell>{inv.itemName}</TableCell>
                <TableCell>{inv.comment}</TableCell>
                <TableCell>{inv.price}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Box
          mt={2}
          display="flex"
          justifyContent="center"
          gap={1}
          alignItems="center"
        >
          <Button disabled={currentPage === 0} onClick={handlePrev}>
            Prev
          </Button>
          <Typography sx={{ color: "black" }}>
            Page {currentPage + 1} of {totalPages}
          </Typography>
          <Button
            disabled={currentPage + 1 === totalPages}
            onClick={handleNext}
          >
            Next
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default InvoicesPage;
