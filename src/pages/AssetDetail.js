import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tabs,
  Tab,
  Alert
} from '@mui/material';
import { ArrowBack, Edit, Delete } from '@mui/icons-material';
import axios from 'axios';

const AssetDetail = () => {
  const { assetId } = useParams();
  const navigate = useNavigate();
  const [asset, setAsset] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [history, setHistory] = useState({
    purchases: [],
    transfers: [],
    assignments: []
  });

  useEffect(() => {
    fetchAssetDetails();
    fetchAssetHistory();
  }, [assetId]);

  const fetchAssetDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/assets/${assetId}`);
      setAsset(response.data);
    } catch (error) {
      setError('Failed to fetch asset details');
      console.error('Error fetching asset:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAssetHistory = async () => {
    try {
      const [purchasesRes, transfersRes, assignmentsRes] = await Promise.all([
        axios.get(`/purchases?assetId=${assetId}`),
        axios.get(`/transfers?assetId=${assetId}`),
        axios.get(`/assignments?assetId=${assetId}`)
      ]);

      setHistory({
        purchases: purchasesRes.data,
        transfers: transfersRes.data,
        assignments: assignmentsRes.data
      });
    } catch (error) {
      console.error('Error fetching asset history:', error);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'maintenance': return 'warning';
      case 'retired': return 'error';
      default: return 'default';
    }
  };

  if (loading) {
    return <Typography>Loading asset details...</Typography>;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!asset) {
    return <Alert severity="error">Asset not found</Alert>;
  }

  const availableQuantity = asset.quantity - asset.assignedQuantity;

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/assets')}
          sx={{ mr: 2 }}
        >
          Back to Assets
        </Button>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Asset Details: {asset.name}
        </Typography>
        <Button
          startIcon={<Edit />}
          variant="outlined"
          sx={{ mr: 1 }}
          onClick={() => navigate(`/assets/${assetId}/edit`)}
        >
          Edit
        </Button>
        <Button
          startIcon={<Delete />}
          variant="outlined"
          color="error"
        >
          Delete
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Basic Information */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Basic Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">
                    Asset ID
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {asset.assetId}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">
                    Type
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {asset.type}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">
                    Base ID
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {asset.baseId}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">
                    Status
                  </Typography>
                  <Chip
                    label={asset.status}
                    color={getStatusColor(asset.status)}
                    size="small"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Quantity Information */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quantity Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">
                    Total Quantity
                  </Typography>
                  <Typography variant="h4" color="primary">
                    {asset.quantity}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">
                    Available
                  </Typography>
                  <Typography variant="h4" color="success.main">
                    {availableQuantity}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">
                    Assigned
                  </Typography>
                  <Typography variant="h4" color="warning.main">
                    {asset.assignedQuantity}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">
                    Expended
                  </Typography>
                  <Typography variant="h4" color="error.main">
                    {asset.expendedQuantity}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Specifications */}
        {asset.specifications && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Specifications
                </Typography>
                <Grid container spacing={2}>
                  {Object.entries(asset.specifications).map(([key, value]) => (
                    <Grid item xs={12} sm={6} md={4} key={key}>
                      <Typography variant="body2" color="textSecondary">
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </Typography>
                      <Typography variant="body1" fontWeight="bold">
                        {value}
                      </Typography>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* History Tabs */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Asset History
              </Typography>
              <Tabs value={tabValue} onChange={handleTabChange}>
                <Tab label={`Purchases (${history.purchases.length})`} />
                <Tab label={`Transfers (${history.transfers.length})`} />
                <Tab label={`Assignments (${history.assignments.length})`} />
              </Tabs>

              {/* Purchases Tab */}
              {tabValue === 0 && (
                <TableContainer sx={{ mt: 2 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Quantity</TableCell>
                        <TableCell>Unit Price</TableCell>
                        <TableCell>Total Price</TableCell>
                        <TableCell>Vendor</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {history.purchases.map((purchase) => (
                        <TableRow key={purchase._id}>
                          <TableCell>
                            {new Date(purchase.purchaseDate).toLocaleDateString()}
                          </TableCell>
                          <TableCell>{purchase.quantity}</TableCell>
                          <TableCell>${purchase.unitPrice}</TableCell>
                          <TableCell>${purchase.totalPrice}</TableCell>
                          <TableCell>{purchase.vendor}</TableCell>
                          <TableCell>
                            <Chip label={purchase.status} size="small" />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}

              {/* Transfers Tab */}
              {tabValue === 1 && (
                <TableContainer sx={{ mt: 2 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>From Base</TableCell>
                        <TableCell>To Base</TableCell>
                        <TableCell>Quantity</TableCell>
                        <TableCell>Reason</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {history.transfers.map((transfer) => (
                        <TableRow key={transfer._id}>
                          <TableCell>
                            {new Date(transfer.transferDate).toLocaleDateString()}
                          </TableCell>
                          <TableCell>{transfer.fromBaseId}</TableCell>
                          <TableCell>{transfer.toBaseId}</TableCell>
                          <TableCell>{transfer.quantity}</TableCell>
                          <TableCell>{transfer.reason}</TableCell>
                          <TableCell>
                            <Chip label={transfer.status} size="small" />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}

              {/* Assignments Tab */}
              {tabValue === 2 && (
                <TableContainer sx={{ mt: 2 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Assigned To</TableCell>
                        <TableCell>Quantity</TableCell>
                        <TableCell>Purpose</TableCell>
                        <TableCell>Expected Return</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {history.assignments.map((assignment) => (
                        <TableRow key={assignment._id}>
                          <TableCell>
                            {new Date(assignment.assignmentDate).toLocaleDateString()}
                          </TableCell>
                          <TableCell>{assignment.assignedTo}</TableCell>
                          <TableCell>{assignment.quantity}</TableCell>
                          <TableCell>{assignment.purpose}</TableCell>
                          <TableCell>
                            {assignment.expectedReturnDate
                              ? new Date(assignment.expectedReturnDate).toLocaleDateString()
                              : 'N/A'
                            }
                          </TableCell>
                          <TableCell>
                            <Chip label={assignment.status} size="small" />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AssetDetail;
