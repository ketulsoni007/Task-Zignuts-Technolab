import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import CryptoJS from 'crypto-js';
import { TextField, Button, Typography, Grid2, Card, CardContent, InputAdornment, IconButton } from '@mui/material';
import { useDispatch } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { UserLogIn } from '../store/Slices/productSlice';

const validationSchema = Yup.object({
    email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
    password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
});

const getUsersFromLocalStorage = () => {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
};

const setLoggedInUserToLocalStorage = (user) => {
    localStorage.setItem('loggedInUser', JSON.stringify(user));
};

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const { control, handleSubmit, formState: { errors }, setError } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const handleClickShowPassword = () => {
        setShowPassword((prev) => !prev);
    };

    const onSubmit = async (values) => {
        try {
            const { email, password } = values;
            const users = getUsersFromLocalStorage();
            const user = users.find((user) => user.email === email);
            if (!user) {
                setError('email', { type: 'manual', message: 'Email does not exist' });
                return;
            }
            const decryptedPassword = CryptoJS.AES.decrypt(user.password, 'secret-key').toString(CryptoJS.enc.Utf8);
            if (decryptedPassword !== password) {
                setError('password', { type: 'manual', message: 'Incorrect password' });
                return;
            }
            setLoggedInUserToLocalStorage(user);
            dispatch(UserLogIn(true));
            navigate('/');
        } catch (error) {
            console.error('Error:', error.message);
            setError('email', { type: 'manual', message: 'An error occurred while logging in' });
        }
    };

    return (
        <Grid2 container justifyContent="center" alignItems="center" sx={{ minHeight: 'calc(100vh - 70px)' }}>
            <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
                <Card>
                    <CardContent sx={{ padding: 3 }}>
                        <Typography variant="h5" gutterBottom align="center">
                            Login
                        </Typography>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Grid2 container spacing={2} direction="column">
                                <Grid2 size={{ xs: 12 }}>
                                    <Controller
                                        name="email"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Email"
                                                fullWidth
                                                variant="outlined"
                                                size="small"
                                                error={!!errors.email}
                                                helperText={errors.email?.message}
                                            />
                                        )}
                                    />
                                </Grid2>
                                <Grid2 size={{ xs: 12 }}>
                                    <Controller
                                        name="password"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Password"
                                                fullWidth
                                                variant="outlined"
                                                size="small"
                                                type={showPassword ? 'text' : 'password'}
                                                error={!!errors.password}
                                                helperText={errors.password?.message}
                                                InputProps={{
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <IconButton
                                                                aria-label="toggle password visibility"
                                                                onClick={handleClickShowPassword}
                                                                edge="end"
                                                            >
                                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                        )}
                                    />
                                </Grid2>
                                <Grid2 size={{ xs: 12 }}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        fullWidth
                                        size="small"
                                    >
                                        Login
                                    </Button>
                                </Grid2>
                                <Typography variant="body2">
                                    Don't have an account?{' '}
                                    <NavLink to="/signup" replace>
                                        Sign up here
                                    </NavLink>
                                </Typography>
                            </Grid2>
                        </form>
                    </CardContent>
                </Card>
            </Grid2>
        </Grid2>
    );
};

export default Login;
