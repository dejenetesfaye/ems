import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Grid,
  Typography,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';

const statsConfig = [
  { key: 'totalEvents', label: 'Events', color: '#b49f5a' },
  { key: 'totalUsers', label: 'Users', color: '#1d4ed8' },
  { key: 'totalResources', label: 'Resources', color: '#10b981' },
  { key: 'upcoming', label: 'Upcoming', color: '#f59e0b' }
];

const formatMoney = (value) => `$${Number(value).toLocaleString()}`;

const ModernDashboard = () => {
  const theme = useTheme();
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [resources, setResources] = useState([]);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const fetchData = async () => {
    try {
      const [eventsRes, usersRes, resourcesRes] = await Promise.all([
        axios.get('https://ems-kd2d.onrender.com/api/events/all', config).catch(() => ({ data: [] })),
        axios.get('https://ems-kd2d.onrender.com/api/users', config).catch(() => ({ data: [] })),
        axios.get('https://ems-kd2d.onrender.com/api/resources', config).catch(() => ({ data: [] }))
      ]);

      setEvents(eventsRes.data || []);
      setUsers(usersRes.data || []);
      setResources(resourcesRes.data || []);
    } catch (err) {
      setError('Failed to load metrics. Please refresh.');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalEvents = events.length;
  const totalUsers = users.length;
  const totalResources = resources.length;
  const upcoming = events.filter((evt) => new Date(evt.date) > new Date()).length;

  const totalByMonth = events.reduce((acc, event) => {
    const date = new Date(event.date);
    if (!date.getTime()) return acc;
    const m = date.toLocaleString('default', { month: 'short' });
    const bucket = acc.find((b) => b.month === m);
    const eventTotal = event.totalCost ?? event.resources?.reduce((s, r) => s + Number(r.totalCost || 0), 0) || 0;
    if (bucket) {
      bucket.total += eventTotal;
      bucket.count += 1;
    } else {
      acc.push({ month: m, total: eventTotal, count: 1 });
    }
    return acc;
  }, []);

  const barData = events.map((evt) => ({ name: evt.name, total: evt.totalCost ?? evt.resources?.reduce((s, r) => s + (r.totalCost || 0), 0) || 0 }));

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, color: theme.palette.text.primary }}>
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>Dashboard</Typography>
          <Typography variant="subtitle2" color="text.secondary">Responsive modern admin view</Typography>
        </Box>
        <Button sx={{ bgcolor: '#b49f5a', color: '#fff', '&:hover': { bgcolor: '#a17d42' } }}>New Event</Button>
      </Box>

      {error && (
        <Paper sx={{ p: 2, mb: 2, bgcolor: '#fee2e2', color: '#b91c1c' }}>
          {error}
        </Paper>
      )}

      <Grid container spacing={2}>
        {statsConfig.map((stat) => (
          <Grid key={stat.key} item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 3, borderRadius: 3, boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08)', borderLeft: `4px solid ${stat.color}` }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>{stat.label}</Typography>
              <Typography variant="h3" sx={{ fontWeight: 800 }}>
                {stat.key === 'totalEvents' && totalEvents}
                {stat.key === 'totalUsers' && totalUsers}
                {stat.key === 'totalResources' && totalResources}
                {stat.key === 'upcoming' && upcoming}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 2, borderRadius: 3, boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08)' }}>
            <Typography variant="h6" mb={1}>Monthly Revenue (Events)</Typography>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={totalByMonth} margin={{ top: 5, right: 25, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => formatMoney(value)} />
                <Line type="monotone" dataKey="total" stroke="#b49f5a" strokeWidth={3} activeDot={{ r: 7 }} />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 2, borderRadius: 3, boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08)' }}>
            <Typography variant="h6" mb={1}>Event Cost Overview</Typography>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={barData} margin={{ top: 0, right: 16, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip formatter={(value) => formatMoney(value)} />
                <Bar dataKey="total" fill="#b49f5a" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, borderRadius: 3, boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08)' }}>
            <Typography variant="h6" mb={2}>Latest Events</Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Manager</TableCell>
                    <TableCell align="right">Cost</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {events.slice(0, 7).map((evt) => {
                    const cost = evt.totalCost ?? evt.resources?.reduce((s, r) => s + (r.totalCost || 0), 0) || 0;
                    return (
                      <TableRow key={evt._id || `${evt.name}-${evt.date}`}> 
                        <TableCell>{evt.name}</TableCell>
                        <TableCell>{evt.type}</TableCell>
                        <TableCell>{new Date(evt.date).toLocaleDateString()}</TableCell>
                        <TableCell>{evt.manager?.name ?? 'N/A'}</TableCell>
                        <TableCell align="right">{formatMoney(cost)}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ModernDashboard;
