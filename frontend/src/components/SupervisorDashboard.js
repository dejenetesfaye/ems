import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Alert,
  Chip
} from '@mui/material';
import ModernCard from './ui/ModernCard';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LogoutIcon from '@mui/icons-material/Logout';

const apiBase = 'https://ems-kd2d.onrender.com';

const SupervisorDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${apiBase}/api/requests/supervisor`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRequests(res.data);
    } catch (err) {
      setError('Failed to fetch requests');
    }
  };

  const handleFulfill = async (id) => {
    setError('');
    setSuccess('');
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${apiBase}/api/requests/${id}/fulfill`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchRequests();
      setSuccess('Request fulfilled successfully');
    } catch (err) {
      setError('Failed to fulfill request');
    }
  };

  const handleSignout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1">
          Supervisor Dashboard
        </Typography>
        <Button
          variant="outlined"
          startIcon={<LogoutIcon />}
          onClick={handleSignout}
        >
          Sign Out
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <ModernCard title="Approved Requests">
          {requests.length === 0 ? (
            <Typography variant="body1" color="text.secondary">
              No approved requests to fulfill.
            </Typography>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Resource</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Bride</TableCell>
                    <TableCell>Event</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {requests.map((req) => (
                    <TableRow key={req._id}>
                      <TableCell>{req.resource}</TableCell>
                      <TableCell>{req.quantity}</TableCell>
                      <TableCell>{req.bride.name}</TableCell>
                      <TableCell>{req.event.name}</TableCell>
                      <TableCell>
                        <Chip
                          label={req.status}
                          color={req.status === 'approved' ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton
                          color="primary"
                          onClick={() => handleFulfill(req._id)}
                          title="Fulfill Request"
                        >
                          <CheckCircleIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
      </ModernCard>
    </Container>
  );
};

export default SupervisorDashboard;