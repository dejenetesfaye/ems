import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert
} from '@mui/material';
import ModernCard from './ui/ModernCard';
import LogoutIcon from '@mui/icons-material/Logout';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const apiBase = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const SuperAdminDashboard = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('manager');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [events, setEvents] = useState([]);
  const [eventsError, setEventsError] = useState('');
  const navigate = useNavigate();

  // Get current user role
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const currentUserRole = user.role;

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${apiBase}/api/events/all`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEvents(res.data);
      } catch (err) {
        setEventsError('Failed to load events for superadmin');
      }
    };

    if (currentUserRole === 'systemadmin' || currentUserRole === 'superadmin') {
      fetchEvents();
    }
  }, [currentUserRole]);

  // Define available roles based on current user role
  const getAvailableRoles = () => {
    if (currentUserRole === 'systemadmin') {
      return [
        { value: 'superadmin', label: 'Super Admin' },
        { value: 'manager', label: 'Manager' },
        { value: 'supervisor', label: 'Supervisor' },
        { value: 'bride', label: 'Bride' }
      ];
    } else if (currentUserRole === 'superadmin') {
      return [
        { value: 'manager', label: 'Manager' },
        { value: 'supervisor', label: 'Supervisor' },
        { value: 'bride', label: 'Bride' }
      ];
    }
    return [];
  };

  const availableRoles = getAvailableRoles();

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${apiBase}/api/auth/register`, { name, email, password, role }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('User created successfully');
      setName('');
      setEmail('');
      setPassword('');
    } catch (err) {
      setError('Failed to create user');
    }
  };

  const handleSignout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const eventCostData = events.map((event) => ({
    name: event.name,
    total: event.totalCost || event.resources?.reduce((sum, r) => sum + (r.totalCost ?? (r.quantity * r.unitCost)), 0) || 0
  }));

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1">
          Super Admin Dashboard
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

      <Grid container spacing={4}>
        <Grid item xs={12} xl={6}>
          <ModernCard title="Create User">
            <Box component="form" onSubmit={handleCreateUser}>
              <TextField
                fullWidth
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                sx={{ mb: 2 }}
              />
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Role</InputLabel>
                <Select value={role} onChange={(e) => setRole(e.target.value)}>
                  {availableRoles.map((roleOption) => (
                    <MenuItem key={roleOption.value} value={roleOption.value}>
                      {roleOption.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button type="submit" variant="contained" fullWidth>
                Create User
              </Button>
            </Box>
          </ModernCard>
        </Grid>

        <Grid item xs={12} xl={6}>
          <ModernCard title="Management Actions">
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => navigate('/users')}
              >
                View All Users
              </Button>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => navigate('/resources')}
              >
                Manage Resources
              </Button>
            </Box>
          </ModernCard>
        </Grid>
      </Grid>

      <Grid container spacing={4} sx={{ mt: 2 }}>
        <Grid item xs={12} xl={7}>
          <ModernCard title="Manager Events Table">
            {eventsError && <Alert severity="error">{eventsError}</Alert>}
            <TableContainer component={Paper} sx={{ maxHeight: 380 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Bride</TableCell>
                    <TableCell>Manager</TableCell>
                    <TableCell align="right">Total Cost</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {events.map((event) => (
                    <TableRow key={event._id} hover>
                      <TableCell>{event.name}</TableCell>
                      <TableCell>{event.type}</TableCell>
                      <TableCell>{new Date(event.date).toLocaleDateString()}</TableCell>
                      <TableCell>{event.bride?.name || 'Unknown'}</TableCell>
                      <TableCell>{event.manager?.name || 'Unknown'}</TableCell>
                      <TableCell align="right">${event.totalCost?.toFixed(2) || 0}</TableCell>
                    </TableRow>
                  ))}
                  {events.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} align="center">No events found</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </ModernCard>
        </Grid>

        <Grid item xs={12} xl={5}>
          <ModernCard title="Manager Event Cost Chart">
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={eventCostData} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} angle={-20} textAnchor="end" interval={0} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total" fill="#b49f5a" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ModernCard>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SuperAdminDashboard;