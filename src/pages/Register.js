import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { register, clearError } from '../store/authSlice';
import { useFormValidation } from '../hooks/useFormValidation';
import { registerValidationSchema } from '../utils/validation';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector(state => state.auth);

  const initialFormData = {
    username: '',
    email: '',
    password: '',
    role: 'logistics_officer',
    baseId: ''
  };

  const {
    formData,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateAllFields
  } = useFormValidation(
    initialFormData,
    registerValidationSchema
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateAllFields()) {
      return;
    }
    
    dispatch(clearError());
    const result = await dispatch(register(formData));
    if (result.type === 'auth/register/fulfilled') {
      navigate('/dashboard');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Paper elevation={3} sx={{ padding: 4, width: '100%' }}>
          <Typography component="h1" variant="h4" align="center" gutterBottom>
            Register
          </Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              value={formData.username}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.username && !!errors.username}
              helperText={touched.username && errors.username}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.email && !!errors.email}
              helperText={touched.email && errors.email}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.password && !!errors.password}
              helperText={touched.password && errors.password || "Must include uppercase, lowercase, number and be at least 8 characters"}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel id="role-label">Role</InputLabel>
              <Select
                labelId="role-label"
                id="role"
                name="role"
                value={formData.role}
                label="Role"
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.role && !!errors.role}
              >
                <MenuItem value="logistics_officer">Logistics Officer</MenuItem>
                <MenuItem value="base_commander">Base Commander</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>
            {formData.role === 'base_commander' && (
              <TextField
                margin="normal"
                required
                fullWidth
                id="baseId"
                label="Base ID"
                name="baseId"
                value={formData.baseId}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.baseId && !!errors.baseId}
                helperText={touched.baseId && errors.baseId || "Format: 3-15 characters (A-Z, 0-9, _)"}
              />
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? 'Registering...' : 'Register'}
            </Button>
            <Box textAlign="center">
              <Link to="/login">
                Already have an account? Sign In
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register;
