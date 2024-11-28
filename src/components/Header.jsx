import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Avatar, Menu, MenuItem, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const navigate = useNavigate();
    const [scrolling, setScrolling] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);

    const [authUser, setAuthUser] = useState(() => {
        const loggedInUser = localStorage.getItem('loggedInUser');
        return loggedInUser ? JSON.parse(loggedInUser) : null;
    });

    useEffect(() => {
        const handleScroll = () => {
            setScrolling(window.scrollY > 50);
        };
        setScrolling(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    const handleClickAvatar = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleLogout = () => {
        localStorage.removeItem('loggedInUser');
        setAuthUser(null);
    };
    return (
        <AppBar
            position="sticky"
            sx={{
                top: 0,
                backgroundColor: scrolling ? 'white' : '#faf8f5',
                boxShadow: scrolling ? '0px 2px 10px rgba(0, 0, 0, 0.1)' : 'none',
                borderBottom: scrolling ? '1px solid rgba(0, 0, 0, 0.1)' : 'none',
                transition: 'all 0.3s ease',
            }}
        >
            <Toolbar>
                <Typography variant="h6" color="primary" sx={{ flexGrow: 1 }}>
                    Zignuts
                </Typography>
                <Box sx={{ display: { md: 'block', sm: 'none', xs: 'none' }, mr: 4 }}>
                    <Button color="primary" onClick={() => navigate('/')}>Home</Button>
                    <Button color="primary">Shop</Button>
                    <Button color="primary">Blog</Button>
                    <Button color="primary">About</Button>
                    <Button color="primary">Contact</Button>
                </Box>

                {authUser ? (
                    <Avatar onClick={handleClickAvatar} sx={{ cursor: 'pointer' }}>
                        {authUser?.firstName?.charAt(0).toUpperCase()}
                    </Avatar>
                ) : (
                    <Avatar onClick={() => navigate('/signin')} />
                )}

                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                >
                    <MenuItem onClick={handleClose}>Profile</MenuItem>
                    <MenuItem onClick={handleClose}>Change Password</MenuItem>
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
