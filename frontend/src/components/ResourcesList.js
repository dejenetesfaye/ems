import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Card,
  CardContent,
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
  TextField,
  Grid
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';

const apiBase = 'https://ems-kd2d.onrender.com';

const ResourcesList = () => {
  const [resources, setResources] = useState([]);
  const [resourceName, setResourceName] = useState('');
  const [resourceDescription, setResourceDescription] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${apiBase}/api/resources`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setResources(res.data);
    } catch (err) {
      setError('Failed to fetch resources');
    }
  };

  const handleCreateResource = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${apiBase}/api/resources`, { name: resourceName, description: resourceDescription }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchResources();
      setSuccess('Resource created successfully');
      setResourceName('');
      setResourceDescription('');
    } catch (err) {
      setError('Failed to create resource');
    }
  };

  const handleDeleteResource = async (id) => {
    setError('');
    setSuccess('');
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${apiBase}/api/resources/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchResources();
      setSuccess('Resource deleted successfully');
    } catch (err) {
      setError('Failed to delete resource');
    }
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1">
          Resources Management
        </Typography>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
        >
          Back to Dashboard
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                Create Resource
              </Typography>
              <Box component="form" onSubmit={handleCreateResource}>
                <TextField
                  fullWidth
                  label="Resource Name"
                  value={resourceName}
                  onChange={(e) => setResourceName(e.target.value)}
                  required
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Description"
                  value={resourceDescription}
                  onChange={(e) => setResourceDescription(e.target.value)}
                  sx={{ mb: 2 }}
                />
                <Button type="submit" variant="contained" fullWidth startIcon={<AddIcon />}>
                  Create Resource
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                All Resources
              </Typography>
              {resources.length === 0 ? (
                <Typography variant="body1" color="text.secondary">
                  No resources found.
                </Typography>
              ) : (
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {resources.map((res) => (
                        <TableRow key={res._id}>
                          <TableCell>{res.name}</TableCell>
                          <TableCell>{res.description}</TableCell>
                          <TableCell>
                            <IconButton
                              color="error"
                              onClick={() => handleDeleteResource(res._id)}
                              title="Delete Resource"
                            >
                              <DeleteIcon />
                            </IconButton>
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
    </Container>
  );
};

export default ResourcesList;