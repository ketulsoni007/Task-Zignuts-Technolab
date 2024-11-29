import React, { useState, useEffect } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Avatar,
    Menu,
    MenuItem,
    Box,
    IconButton,
    Tooltip,
    Paper,
    ListItemIcon,
    Divider,
    ListItem,
    ListItemText,
    ListItemAvatar,
} from '@mui/material';
import { Logout } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import { useSelector } from 'react-redux';

const Header = () => {
    const navigate = useNavigate();
    const [scrolling, setScrolling] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [authUser, setAuthUser] = useState(null);
    const userLogIn = useSelector((state)=>state.product.userLogIn);

    useEffect(() => {
        const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
        if (loggedInUser) {
            setAuthUser(loggedInUser);
        }
    }, [userLogIn]);

    useEffect(() => {
        const handleScroll = () => setScrolling(window.scrollY > 50);
        setScrolling(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleClickAvatar = (event) => setAnchorEl(event.currentTarget);
    const handleCloseMenu = () => setAnchorEl(null);

    const handleMenuAction = (action) => {
        if (action === 'profile') navigate('/profile');
        else if (action === 'password') navigate('/password');
        setAnchorEl(null);
    };

    const handleLogout = () => {
        localStorage.removeItem('loggedInUser');
        setAuthUser(null);
        setAnchorEl(null);
        navigate('/signin');
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
                    <Tooltip title="Account settings">
                        <IconButton onClick={handleClickAvatar} size="small">
                            {authUser?.profilePicture ? (
                                <Avatar
                                    component={Paper}
                                    elevation={2}
                                    sx={{ width: 36, height: 36 }}
                                    src={authUser.profilePicture}
                                />
                            ) : (
                                <Avatar>
                                    {authUser?.firstName?.charAt(0).toUpperCase()}
                                </Avatar>
                            )}
                        </IconButton>
                    </Tooltip>
                ) : (
                    <Avatar onClick={() => navigate('/signin')} />
                )}
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleCloseMenu}
                    PaperProps={{
                        elevation: 4,
                        sx: {
                            mt: 1.5,
                            '& .MuiAvatar-root': {
                                width: 32,
                                height: 32,
                                ml: -0.5,
                                mr: 1,
                            },
                            '&::before': {
                                content: '""',
                                display: 'block',
                                position: 'absolute',
                                top: 0,
                                right: 14,
                                width: 10,
                                height: 10,
                                bgcolor: 'background.paper',
                                transform: 'translateY(-50%) rotate(45deg)',
                                zIndex: 0,
                            },
                        },
                    }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                    <MenuItem>
                        <ListItem sx={{ p: 0 }}>
                            <Avatar>
                                {authUser?.firstName?.charAt(0)?.toUpperCase()}
                            </Avatar>
                            <ListItemText
                                primary={`${authUser?.firstName} ${authUser?.lastName}`}
                                secondary={authUser?.email}
                                primaryTypographyProps={{ fontWeight: 'bold' }}
                                secondaryTypographyProps={{ color: 'text.secondary' }}
                            />
                        </ListItem>
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={() => handleMenuAction('profile')}>
                        <ListItemIcon>
                            <AssignmentIndIcon />
                        </ListItemIcon>
                        <ListItemText primary="Profile" />
                    </MenuItem>
                    <MenuItem onClick={() => handleMenuAction('password')}>
                        <ListItemIcon>
                            <LockOpenIcon />
                        </ListItemIcon>
                        <ListItemText primary="Change Password" />
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={handleLogout}>
                        <ListItemIcon>
                            <Logout fontSize="small" />
                        </ListItemIcon>
                        Logout
                    </MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
