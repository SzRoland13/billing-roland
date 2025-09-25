import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
} from "@mui/material";
import { register } from "../api/services/authService";

const roles = ["USER", "ACCOUNTANT"];

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("USER");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await register(name, username, password, role);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
      console.warn("Received error message: ", err);
    }
  };

  return (
    <Container maxWidth="xs">
      <Box mt={8} display="flex" flexDirection="column" alignItems="center">
        <Typography variant="h5">Register</Typography>
        <Box component="form" mt={2} onSubmit={handleSubmit} width="100%">
          <TextField
            label="Name"
            fullWidth
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            label="Username"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            label="Password"
            fullWidth
            margin="normal"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <TextField
            select
            label="Role"
            fullWidth
            margin="normal"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            {roles.map((r) => (
              <MenuItem key={r} value={r}>
                {r}
              </MenuItem>
            ))}
          </TextField>
          {error && <Typography color="error">{error}</Typography>}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 2, borderRadius: 2 }}
            disabled={!name || !username || !password || !role}
          >
            Register
          </Button>
          <Button
            fullWidth
            variant="text"
            sx={{ mt: 1 }}
            onClick={() => navigate("/login")}
          >
            Back to Login
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default RegisterPage;
