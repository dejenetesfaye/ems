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
  IconButton,
  Alert,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import ModernCard from './ui/ModernCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import DeleteIcon from '@mui/icons-material/Delete';
import LogoutIcon from '@mui/icons-material/Logout';
import AddIcon from '@mui/icons-material/Add';

const ManagerDashboard = () => {
  const [events, setEvents] = useState([]);
  const [brides, setBrides] = useState([]);
  const [resources, setResources] = useState([]);
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [date, setDate] = useState('');
  const [brideId, setBrideId] = useState('');
  const [selectedResource, setSelectedResource] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unitCost, setUnitCost] = useState('');
  const [eventResources, setEventResources] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
    fetchBrides();
    fetchResources();
  }, []);

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/events/manager', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEvents(res.data);
    } catch (err) {
      setError('Failed to fetch events');
    }
  };

  const fetchBrides = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/users/brides', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBrides(res.data);
    } catch (err) {
      setError('Failed to fetch brides');
    }
  };

  const fetchResources = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/resources', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setResources(res.data);
    } catch (err) {
      setError('Failed to fetch resources');
    }
  };

  const addResource = () => {
    if (selectedResource && quantity && unitCost) {
      setEventResources([...eventResources, {
        resource: selectedResource,
        quantity: parseInt(quantity),
        unitCost: parseFloat(unitCost)
      }]);
      setSelectedResource('');
      setQuantity('');
      setUnitCost('');
    }
  };

  const removeResource = (index) => {
    setEventResources(eventResources.filter((_, i) => i !== index));
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/events', { name, type, date, brideId, resources: eventResources }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchEvents();
      setSuccess('Event created successfully');
      setName('');
      setType('');
      setDate('');
      setBrideId('');
      setEventResources([]);
    } catch (err) {
      setError('Failed to create event');
    }
  };

  const handleSignout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const eventCostData = events.map((event) => {
    const total = event.totalCost || event.resources?.reduce((sum, r) => sum + (r.totalCost || (r.quantity * r.unitCost || 0)), 0) || 0;
    return { name: event.name, total: Math.round(total) };
  });

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1">
          Manager Dashboard
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
          <ModernCard title="Event Cost Overview">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={eventCostData} margin={{ top: 10, right: 16, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" hide={eventCostData.length > 5} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total" fill="#b49f5a" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ModernCard>
        </Grid>

        <Grid item xs={12} xl={6}>
          <ModernCard title="Quick Actions">
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button variant="contained" onClick={fetchEvents}>
                Refresh Events
              </Button>
              <Button variant="outlined" onClick={() => navigate('/dashboard')}>
                Go to Dashboard Home
              </Button>
            </Box>
          </ModernCard>
        </Grid>

        <Grid item xs={12}>
          <ModernCard title="Create Event">
            <Box component="form" onSubmit={handleCreateEvent}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Event Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Event Type"
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Date"
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Bride</InputLabel>
                      <Select value={brideId} onChange={(e) => setBrideId(e.target.value)} required>
                        <MenuItem value="">
                          <em>Select Bride</em>
                        </MenuItem>
                        {brides.map(bride => (
                          <MenuItem key={bride._id} value={bride._id}>
                            {bride.name} ({bride.email})
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>

                <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
                  Add Resources
                </Typography>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth>
                      <InputLabel>Resource</InputLabel>
                      <Select value={selectedResource} onChange={(e) => setSelectedResource(e.target.value)}>
                        <MenuItem value="">
                          <em>Select Resource</em>
                        </MenuItem>
                        {resources.map(res => (
                          <MenuItem key={res._id} value={res._id}>{res.name}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <TextField
                      fullWidth
                      label="Quantity"
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      fullWidth
                      label="Unit Cost"
                      type="number"
                      step="0.01"
                      value={unitCost}
                      onChange={(e) => setUnitCost(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Button
                      variant="outlined"
                      startIcon={<AddIcon />}
                      onClick={addResource}
                      fullWidth
                    >
                      Add
                    </Button>
                  </Grid>
                </Grid>

                {eventResources.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle1">Selected Resources:</Typography>
                    <List>
                      {eventResources.map((res, index) => {
                        const resource = resources.find(r => r._id === res.resource);
                        return (
                          <ListItem key={index} secondaryAction={
                            <IconButton edge="end" onClick={() => removeResource(index)}>
                              <DeleteIcon />
                            </IconButton>
                          }>
                            <ListItemText
                              primary={`${resource?.name} - Qty: ${res.quantity} - Cost: $${res.unitCost}`}
                            />
                          </ListItem>
                        );
                      })}
                    </List>
                  </Box>
                )}

                <Button type="submit" variant="contained" sx={{ mt: 3 }} fullWidth>
                  Create Event
                </Button>
              </Box>
            </ModernCard>
          </Grid>

          <Grid item xs={12}>
            <ModernCard title="Events">
              {events.length === 0 ? (
                <Typography variant="body1" color="text.secondary">
                  No events yet. Create your first event.
                </Typography>
              ) : (
                events.map(event => (
                  <Box key={event._id} sx={{ mb: 3 }}>
                    <Typography variant="h6">{event.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Bride: {event.bride.name} | Date: {new Date(event.date).toLocaleDateString()} | Total Cost: ${event.totalCost}
                    </Typography>
                    <Typography variant="subtitle2" sx={{ mt: 1 }}>Resources:</Typography>
                    <List dense>
                      {event.resources.map((res, index) => (
                        <ListItem key={index}>
                          <ListItemText
                            primary={`${res.resource.name} - Qty: ${res.quantity} - Total Cost: $${res.totalCost}`}
                          />
                        </ListItem>
                      ))}
                    </List>
                    <Divider sx={{ mt: 2 }} />
                  </Box>
                ))
              )}
            </ModernCard>
          </Grid>
        </Grid>
      </Container>
  );
};

export default ManagerDashboard;