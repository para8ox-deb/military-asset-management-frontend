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

const Transfers = () => {
  const [transfers, setTransfers] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    assetId: '',
    assetName: '',
    fromBaseId: '',
    toBaseId: '',
    quantity: '',
    reason: ''
  });
  const [filters, setFilters] = useState({
    baseId: '',
    status: ''
  });

  useEffect(() => {
    fetchTransfers();
  }, [filters]);

  const fetchTransfers = async () => {
    try {
      const response = await axios.get('/transfers', { params: filters });
      setTransfers(response.data);
    } catch (error) {
      console.error('Error fetching transfers:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/transfers', formData);
      setOpen(false);
      setFormData({
        assetId: '',
        assetName: '',
        fromBaseId: '',
        toBaseId: '',
        quantity: '',
        reason: ''
      });
      fetchTransfers();
    } catch (error) {
      console.error('Error creating transfer:', error);
    }
  };

  const handleApprove = async (transferId) => {
    try {
      await axios.patch(`/transfers/${transferId}/approve`);
      fetchTransfers();
    } catch (error) {
      console.error('Error approving transfer:', error);
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
      case 'pending': return 'warning';
      case 'approved': return 'info';
      case 'completed': return 'success';
      case 'rejected': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Asset Transfers
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
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="approved">Approved</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Button variant="contained" onClick={() => setOpen(true)} sx={{ mb: 2 }}>
        Initiate Transfer
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Asset ID</TableCell>
              <TableCell>Asset Name</TableCell>
              <TableCell>From Base</TableCell>
              <TableCell>To Base</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Reason</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transfers.map((transfer) => (
              <TableRow key={transfer._id}>
                <TableCell>{transfer.assetId}</TableCell>
                <TableCell>{transfer.assetName}</TableCell>
                <TableCell>{transfer.fromBaseId}</TableCell>
                <TableCell>{transfer.toBaseId}</TableCell>
                <TableCell>{transfer.quantity}</TableCell>
                <TableCell>{transfer.reason}</TableCell>
                <TableCell>{new Date(transfer.transferDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Chip 
                    label={transfer.status} 
                    color={getStatusColor(transfer.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {transfer.status === 'pending' && (
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => handleApprove(transfer._id)}
                    >
                      Approve
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Transfer Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Initiate Asset Transfer</DialogTitle>
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
              label="From Base ID"
              name="fromBaseId"
              value={formData.fromBaseId}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="To Base ID"
              name="toBaseId"
              value={formData.toBaseId}
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
              label="Reason"
              name="reason"
              multiline
              rows={3}
              value={formData.reason}
              onChange={handleChange}
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained">Initiate Transfer</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default Transfers;
