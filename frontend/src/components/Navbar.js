import React, { useState } from 'react';
import {
  AppBar, Toolbar, Typography, Box, Avatar, IconButton,
  Menu, MenuItem, ListItemIcon, Divider, Button,
} from '@mui/material';
import { AutoAwesome, Logout, Person } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleLogout = () => {
    setAnchorEl(null);
    logout();
    navigate('/login');
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: 'rgba(255,255,255,0.9)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #E2E8F0',
        color: '#1E293B',
      }}
    >
      <Toolbar sx={{ maxWidth: 680, width: '100%', mx: 'auto', px: { xs: 2, sm: 3 } }}>
        {/* Logo */}
        <Box
          component={Link}
          to="/"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            textDecoration: 'none',
            flex: 1,
          }}
        >
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.75,
              background: 'linear-gradient(135deg, #4F46E5, #EC4899)',
              borderRadius: 2,
              px: 1.5,
              py: 0.5,
            }}
          >
            <AutoAwesome sx={{ color: '#fff', fontSize: 18 }} />
            <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: '0.95rem' }}>
              SocialSpark
            </Typography>
          </Box>
        </Box>

        {/* Right side */}
        {user ? (
          <>
            <IconButton
              onClick={(e) => setAnchorEl(e.currentTarget)}
              sx={{ p: 0.5 }}
            >
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  fontSize: '0.85rem',
                  background: 'linear-gradient(135deg, #4F46E5, #EC4899)',
                }}
              >
                {user.username?.[0]?.toUpperCase()}
              </Avatar>
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
              PaperProps={{
                sx: {
                  borderRadius: 3,
                  boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                  minWidth: 200,
                  mt: 1,
                },
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <Box sx={{ px: 2, py: 1.5 }}>
                <Typography variant="subtitle2" fontWeight={700}>{user.username}</Typography>
                <Typography variant="caption" color="text.secondary">{user.email}</Typography>
              </Box>
              <Divider />
              <MenuItem onClick={handleLogout} sx={{ mt: 0.5, color: '#EF4444', borderRadius: 2, mx: 0.5 }}>
                <ListItemIcon><Logout fontSize="small" sx={{ color: '#EF4444' }} /></ListItemIcon>
                Sign Out
              </MenuItem>
            </Menu>
          </>
        ) : (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button component={Link} to="/login" variant="outlined" size="small" sx={{ borderColor: '#E2E8F0' }}>
              Log In
            </Button>
            <Button component={Link} to="/signup" variant="contained" size="small">
              Sign Up
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}
