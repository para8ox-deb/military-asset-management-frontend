import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { fetchDashboardMetrics } from '../store/dashboardSlice';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { metrics, loading } = useSelector(state => state.dashboard);
  const { user } = useSelector(state => state.auth);
  
  const [filters, setFilters] = useState({
    baseId: user?.role === 'base_commander' ? user.baseId : '',
    startDate: '',
    endDate: '',
    assetType: ''
  });
  
  const [detailDialog, setDetailDialog] = useState({ open: false, type: '', data: null });

  useEffect(() => {
    dispatch(fetchDashboardMetrics(filters));
  }, [dispatch, filters]);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleCardClick = (type) => {
    if (type === 'netMovement' && metrics) {
      setDetailDialog({
        open: true,
        type: 'Net Movement Details',
        data: [
          { label: 'Purchases', value: metrics.purchases },
          { label: 'Transfer In', value: metrics.transferIn },
          { label: 'Transfer Out', value: metrics.transferOut }
        ]
      });
    }
  };

  const chartData = metrics ? [
    { name: 'Opening', value: metrics.openingBalance },
    { name: 'Closing', value: metrics.closingBalance },
    { name: 'Assigned', value: metrics.assignedAssets },
    { name: 'Expended', value: metrics.expendedAssets }
  ] : [];

  if (loading) {
    return <Typography>Loading dashboard...</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Asset Management Dashboard
      </Typography>
      
      {/* Filters */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {user?.role === 'admin' && (
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="Base ID"
              name="baseId"
              value={filters.baseId}
              onChange={handleFilterChange}
            />
          </Grid>
        )}
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

      {/* Metrics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Opening Balance
              </Typography>
              <Typography variant="h4">
                {metrics?.openingBalance || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Closing Balance
              </Typography>
              <Typography variant="h4">
                {metrics?.closingBalance || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ cursor: 'pointer' }} onClick={() => handleCardClick('netMovement')}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Net Movement
              </Typography>
              <Typography variant="h4">
                {metrics?.netMovement || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Assigned Assets
              </Typography>
              <Typography variant="h4">
                {metrics?.assignedAssets || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Chart */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Asset Overview
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#1976d2" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={detailDialog.open} onClose={() => setDetailDialog({ open: false, type: '', data: null })}>
        <DialogTitle>{detailDialog.type}</DialogTitle>
        <DialogContent>
          <List>
            {detailDialog.data?.map((item, index) => (
              <ListItem key={index}>
                <ListItemText primary={item.label} secondary={item.value} />
              </ListItem>
            ))}
          </List>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Dashboard;
