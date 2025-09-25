import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  OutlinedInput,
  Checkbox,
  ListItemText,
  Pagination,
} from "@mui/material";
import { useAdminStore } from "../store/adminStore";
import type { Role } from "../utils/types";

const AdminPage = () => {
  const {
    users,
    roles,
    totalPages,
    page,
    fetchUsers,
    fetchRoles,
    updateUserRoles,
    deleteUser,
  } = useAdminStore();

  const [editingRoles, setEditingRoles] = useState<{ [key: number]: number[] }>(
    {}
  );

  useEffect(() => {
    fetchRoles();
    fetchUsers();
  }, [fetchRoles, fetchUsers]);

  const handleRoleChange = (userId: number, selectedRoleIds: number[]) => {
    setEditingRoles((prev) => ({ ...prev, [userId]: selectedRoleIds }));
  };

  const handleSaveRoles = (userId: number) => {
    const roleIds = editingRoles[userId];
    if (roleIds) updateUserRoles(userId, roleIds);
  };

  return (
    <Box
      p={3}
      display="flex"
      flexDirection="column"
      alignContent="center"
      gap={10}
      marginTop={8}
      marginLeft={14}
      marginRight={14}
    >
      <Typography variant="h4" gutterBottom sx={{ color: "black" }}>
        Admin Panel - Users
      </Typography>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Username</TableCell>
            <TableCell>Roles</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {users.map((user) => {
            const selectedRoles =
              editingRoles[user.id] || user.roles.map((r: Role) => r.id);
            return (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>
                  <FormControl sx={{ width: 250 }}>
                    <InputLabel>Roles</InputLabel>
                    <Select
                      multiple
                      value={selectedRoles}
                      onChange={(e) =>
                        handleRoleChange(
                          user.id,
                          typeof e.target.value === "string"
                            ? e.target.value.split(",").map(Number)
                            : e.target.value
                        )
                      }
                      input={<OutlinedInput label="Roles" />}
                      renderValue={(selected) =>
                        roles
                          .filter((r) => selected.includes(r.id))
                          .map((r) => r.name)
                          .join(", ")
                      }
                    >
                      {roles.map((role) => (
                        <MenuItem key={role.id} value={role.id}>
                          <Checkbox checked={selectedRoles.includes(role.id)} />
                          <ListItemText primary={role.name} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ mr: 1 }}
                    onClick={() => handleSaveRoles(user.id)}
                  >
                    Save
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => deleteUser(user.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <Box mt={2}>
        <Pagination
          count={totalPages}
          page={page + 1}
          onChange={(_, value) => fetchUsers(value - 1)}
        />
      </Box>
    </Box>
  );
};

export default AdminPage;
