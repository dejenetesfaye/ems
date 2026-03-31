import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  Box,
  Chip,
  Select,
  MenuItem,
  TextField,
  Alert
} from '@mui/material';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
const apiBase = 'https://ems-kd2d.onrender.com';

const BrideDashboard = () => {
  const [event, setEvent] = useState(null);
  const [requests, setRequests] = useState([]);
  const [resource, setResource] = useState('');
  const [quantity, setQuantity] = useState('');
  const [note, setNote] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvent();
    fetchRequests();
  }, []);

  const fetchEvent = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${apiBase}/api/events/bride`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEvent(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${apiBase}/api/requests/bride`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRequests(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendRequest = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${apiBase}/api/requests`, { resource, quantity, note }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchRequests();
      setResource('');
      setQuantity('');
      setNote('');
    } catch (err) {
      alert('Failed to send request');
    }
  };

  const handleConfirm = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${apiBase}/api/requests/${id}/confirm`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchRequests();
    } catch (err) {
      alert('Failed to confirm');
    }
  };

  const handleSignout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'approved': return 'info';
      case 'rejected': return 'error';
      case 'fulfilled': return 'success';
      case 'confirmed': return 'primary';
      default: return 'default';
    }
  };

  const costData = event ? event.resources.map(res => ({
    name: res.resource.name,
    cost: res.totalCost
  })) : [];

  const statusData = requests.reduce((acc, req) => {
    const status = acc.find(s => s.name === req.status);
    if (status) {
      status.value += 1;
    } else {
      acc.push({ name: req.status, value: 1 });
    }
    return acc;
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Bride Dashboard
        </Typography>
        <Button variant="contained" color="secondary" onClick={handleSignout}>
          Sign Out
        </Button>
      </Box>

      {event && (
        <>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Event Details
                  </Typography>
                  <Typography><strong>Event:</strong> {event.name}</Typography>
                  <Typography><strong>Type:</strong> {event.type}</Typography>
                  <Typography><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</Typography>
                  <Typography><strong>Manager:</strong> {event.manager.name}</Typography>
                  <Typography variant="h6" sx={{ mt: 2 }}><strong>Total Cost: ${event.totalCost}</strong></Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Cost Breakdown
                  </Typography>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={costData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="cost" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Event Resources
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Resource</TableCell>
                      <TableCell align="right">Quantity</TableCell>
                      <TableCell align="right">Unit Cost ($)</TableCell>
                      <TableCell align="right">Total Cost ($)</TableCell>
                      <TableCell>Description</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {event.resources.map((res, index) => (
                      <TableRow key={index}>
                        <TableCell>{res.resource.name}</TableCell>
                        <TableCell align="right">{res.quantity}</TableCell>
                        <TableCell align="right">{res.unitCost}</TableCell>
                        <TableCell align="right">{res.totalCost}</TableCell>
                        <TableCell>{res.resource.description}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>

          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Send New Request
                  </Typography>
                  <Box component="form" onSubmit={handleSendRequest} sx={{ mt: 2 }}>
                    <Select
                      fullWidth
                      value={resource}
                      onChange={(e) => setResource(e.target.value)}
                      displayEmpty
                      sx={{ mb: 2 }}
                    >
                      <MenuItem value="">
                        <em>Select Resource</em>
                      </MenuItem>
                      {event.resources.map((res, index) => (
                        <MenuItem key={index} value={res.resource.name}>{res.resource.name}</MenuItem>
                      ))}
                    </Select>
                    <TextField
                      fullWidth
                      type="number"
                      label="Quantity"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      sx={{ mb: 2 }}
                    />
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      label="Note"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      sx={{ mb: 2 }}
                    />
                    <Button type="submit" variant="contained" fullWidth>
                      Send Request
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Request Status Overview
                  </Typography>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                My Requests
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Resource</TableCell>
                      <TableCell align="right">Quantity</TableCell>
                      <TableCell>Note</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Requested At</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {requests.map((req) => (
                      <TableRow key={req._id}>
                        <TableCell>{req.resource}</TableCell>
                        <TableCell align="right">{req.quantity}</TableCell>
                        <TableCell>{req.note}</TableCell>
                        <TableCell>
                          <Chip label={req.status} color={getStatusColor(req.status)} />
                        </TableCell>
                        <TableCell>{new Date(req.createdAt).toLocaleString()}</TableCell>
                        <TableCell>
                          {req.status === 'fulfilled' && (
                            <Button variant="contained" size="small" onClick={() => handleConfirm(req._id)}>
                              Confirm
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </>
      )}

      {!event && (
        <Alert severity="info" sx={{ mt: 3 }}>
          No event assigned yet. Please contact your manager.
        </Alert>
      )}
    </Container>
  );
};

export default BrideDashboard;