import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Chip
} from '@mui/material';
import axios from 'axios';

const Assignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    assetId: '',
    assetName: '',
    baseId: '',
    assignedTo: '',
    quantity: '',
    expectedReturnDate: '',
    purpose: ''
  });
  const [filters, setFilters] = useState({
    baseId: '',
    status: ''
  });

  useEffect(() => {
    fetchAssignments();
  }, [filters]);

  const fetchAssignments = async () => {
    try {
      const response = await axios.get('/assignments', { params: filters });
      setAssignments(response.data);
    } catch (error) {
      console.error('Error fetching assignments:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/assignments', formData);
      setOpen(false);
      setFormData({
        assetId: '',
        assetName: '',
        baseId: '',
        assignedTo: '',
        quantity: '',
        expectedReturnDate: '',
        purpose: ''
      });
      fetchAssignments();
    } catch (error) {
      console.error('Error creating assignment:', error);
    }
  };

  const handleExpend = async (assignmentId) => {
    try {
      await axios.patch(`/assignments/${assignmentId}/expend`);
      fetchAssignments();
    } catch (error) {
      console.error('Error marking as expended:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'assigned': return 'primary';
      case 'returned': return 'success';
      case 'expended': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Asset Assignments
      </Typography>

      {/* Filters */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Base ID"
            name="baseId"
            value={filters.baseId}
            onChange={handleFilterChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              name="status"
              value={filters.status}
              label="Status"
              onChange={handleFilterChange}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="assigned">Assigned</MenuItem>
              <MenuItem value="returned">Returned</MenuItem>
              <MenuItem value="expended">Expended</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Button variant="contained" onClick={() => setOpen(true)} sx={{ mb: 2 }}>
        Assign Asset
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Asset ID</TableCell>
              <TableCell>Asset Name</TableCell>
              <TableCell>Base ID</TableCell>
              <TableCell>Assigned To</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Purpose</TableCell>
              <TableCell>Assignment Date</TableCell>
              <TableCell>Expected Return</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {assignments.map((assignment) => (
              <TableRow key={assignment._id}>
                <TableCell>{assignment.assetId}</TableCell>
                <TableCell>{assignment.assetName}</TableCell>
                <TableCell>{assignment.baseId}</TableCell>
                <TableCell>{assignment.assignedTo}</TableCell>
                <TableCell>{assignment.quantity}</TableCell>
                <TableCell>{assignment.purpose}</TableCell>
                <TableCell>{new Date(assignment.assignmentDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  {assignment.expectedReturnDate 
                    ? new Date(assignment.expectedReturnDate).toLocaleDateString() 
                    : 'N/A'
                  }
                </TableCell>
                <TableCell>
                  <Chip 
                    label={assignment.status} 
                    color={getStatusColor(assignment.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {assignment.status === 'assigned' && (
                    <Button
                      size="small"
                      variant="contained"
                      color="error"
                      onClick={() => handleExpend(assignment._id)}
                    >
                      Mark Expended
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Assignment Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Assign Asset</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              fullWidth
              margin="normal"
              label="Asset ID"
              name="assetId"
              value={formData.assetId}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Asset Name"
              name="assetName"
              value={formData.assetName}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Base ID"
              name="baseId"
              value={formData.baseId}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Assigned To"
              name="assignedTo"
              value={formData.assignedTo}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Quantity"
              name="quantity"
              type="number"
              value={formData.quantity}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Expected Return Date"
              name="expectedReturnDate"
              type="date"
              value={formData.expectedReturnDate}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Purpose"
              name="purpose"
              multiline
              rows={3}
              value={formData.purpose}
              onChange={handleChange}
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained">Assign Asset</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default Assignments;
