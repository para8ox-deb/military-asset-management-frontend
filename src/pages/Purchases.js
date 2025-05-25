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
  Grid
} from '@mui/material';
import axios from 'axios';

const Purchases = () => {
  const [purchases, setPurchases] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    assetId: '',
    assetName: '',
    assetType: 'weapon',
    baseId: '',
    quantity: '',
    unitPrice: '',
    vendor: ''
  });
  const [filters, setFilters] = useState({
    baseId: '',
    startDate: '',
    endDate: '',
    assetType: ''
  });

  useEffect(() => {
    fetchPurchases();
  }, [filters]);

  const fetchPurchases = async () => {
    try {
      const response = await axios.get('/purchases', { params: filters });
      setPurchases(response.data);
    } catch (error) {
      console.error('Error fetching purchases:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/purchases', formData);
      setOpen(false);
      setFormData({
        assetId: '',
        assetName: '',
        assetType: 'weapon',
        baseId: '',
        quantity: '',
        unitPrice: '',
        vendor: ''
      });
      fetchPurchases();
    } catch (error) {
      console.error('Error creating purchase:', error);
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

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Purchases
      </Typography>

      {/* Filters */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            label="Base ID"
            name="baseId"
            value={filters.baseId}
            onChange={handleFilterChange}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            label="Start Date"
            name="startDate"
            type="date"
            value={filters.startDate}
            onChange={handleFilterChange}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            label="End Date"
            name="endDate"
            type="date"
            value={filters.endDate}
            onChange={handleFilterChange}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth>
            <InputLabel>Asset Type</InputLabel>
            <Select
              name="assetType"
              value={filters.assetType}
              label="Asset Type"
              onChange={handleFilterChange}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="weapon">Weapon</MenuItem>
              <MenuItem value="vehicle">Vehicle</MenuItem>
              <MenuItem value="ammunition">Ammunition</MenuItem>
              <MenuItem value="equipment">Equipment</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Button variant="contained" onClick={() => setOpen(true)} sx={{ mb: 2 }}>
        Add Purchase
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Asset ID</TableCell>
              <TableCell>Asset Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Base ID</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Unit Price</TableCell>
              <TableCell>Total Price</TableCell>
              <TableCell>Vendor</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {purchases.map((purchase) => (
              <TableRow key={purchase._id}>
                <TableCell>{purchase.assetId}</TableCell>
                <TableCell>{purchase.assetName}</TableCell>
                <TableCell>{purchase.assetType}</TableCell>
                <TableCell>{purchase.baseId}</TableCell>
                <TableCell>{purchase.quantity}</TableCell>
                <TableCell>${purchase.unitPrice}</TableCell>
                <TableCell>${purchase.totalPrice}</TableCell>
                <TableCell>{purchase.vendor}</TableCell>
                <TableCell>{new Date(purchase.purchaseDate).toLocaleDateString()}</TableCell>
                <TableCell>{purchase.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add Purchase Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Purchase</DialogTitle>
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
            <FormControl fullWidth margin="normal">
              <InputLabel>Asset Type</InputLabel>
              <Select
                name="assetType"
                value={formData.assetType}
                label="Asset Type"
                onChange={handleChange}
              >
                <MenuItem value="weapon">Weapon</MenuItem>
                <MenuItem value="vehicle">Vehicle</MenuItem>
                <MenuItem value="ammunition">Ammunition</MenuItem>
                <MenuItem value="equipment">Equipment</MenuItem>
              </Select>
            </FormControl>
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
              label="Unit Price"
              name="unitPrice"
              type="number"
              value={formData.unitPrice}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Vendor"
              name="vendor"
              value={formData.vendor}
              onChange={handleChange}
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained">Add Purchase</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default Purchases;
