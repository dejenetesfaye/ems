import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import UsersList from './components/UsersList';
import ResourcesList from './components/ResourcesList';
import './App.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#b49f5a',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#4b5563',
    },
    background: {
      default: '#f6f6f4',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: ['Inter', 'Roboto', 'Arial', 'sans-serif'].join(','),
  },
});

const MainLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = !!localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const isAdmin = user && ['systemadmin', 'superadmin'].includes(user.role);

  return (
    <div className="app-shell">
      <AppBar position="sticky" elevation={4} sx={{ bgcolor: 'primary.main' }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              EMS Dashboard
            </Typography>
          </Box>
          {isLoggedIn && location.pathname !== '/login' && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" sx={{ color: '#fff', mr: 1, fontWeight: 500 }}>
                {user?.role?.toUpperCase() || 'UNKNOWN'}
              </Typography>
              <Button sx={{ color: '#fff' }} onClick={() => navigate('/dashboard')}>
                Dashboard
              </Button>
              {isAdmin && (
                <>
                  <Button sx={{ color: '#fff' }} onClick={() => navigate('/users')}>
                    Users
                  </Button>
                  <Button sx={{ color: '#fff' }} onClick={() => navigate('/resources')}>
                    Resources
                  </Button>
                </>
              )}
              <Button
                sx={{ color: '#fff' }}
                onClick={() => {
                  localStorage.removeItem('token');
                  localStorage.removeItem('user');
                  navigate('/login');
                }}
              >
                Sign Out
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Box component="main" sx={{ py: 3, minHeight: 'calc(100vh - 142px)' }}>
        <Container maxWidth="xl">{children}</Container>
      </Box>

      <Box component="footer" sx={{ py: 2, textAlign: 'center', mt: 4, bgcolor: '#faf7ea' }}>
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} EMS Project —  build with modern design and golden theme.
        </Typography>
      </Box>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <MainLayout>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/users" element={<UsersList />} />
            <Route path="/resources" element={<ResourcesList />} />
            <Route path="/" element={<Login />} />
          </Routes>
        </MainLayout>
      </Router>
    </ThemeProvider>
  );
}

export default App;