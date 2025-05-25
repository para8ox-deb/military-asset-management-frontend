import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authSlice';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/purchases', label: 'Purchases' },
    { path: '/transfers', label: 'Transfers' },
    { path: '/assignments', label: 'Assignments' },
  ];

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Military Asset Management
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {menuItems.map((item) => (
            <Button
              key={item.path}
              color="inherit"
              onClick={() => navigate(item.path)}
              sx={{
                backgroundColor: location.pathname === item.path ? 'rgba(255,255,255,0.1)' : 'transparent'
              }}
            >
              {item.label}
            </Button>
          ))}
          <Typography variant="body2" sx={{ alignSelf: 'center', mx: 2 }}>
            {user?.username} ({user?.role})
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
