import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import CryptoJS from 'crypto-js';
import { TextField, Button, Typography, Grid2, Card, CardContent, InputAdornment, IconButton } from '@mui/material';
import { NavLink, useNavigate } from 'react-router-dom';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { UserLogIn } from '../store/Slices/productSlice';
import { useDispatch } from 'react-redux';

const validationSchema = Yup.object({
    firstName: Yup.string().required('First Name is required'),
    lastName: Yup.string().required('Last Name is required'),
    email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
    mobile: Yup.string()
        .matches(/^[0-9]{10}$/, 'Mobile number must be 10 digits')
        .required('Mobile number is required'),
    password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Confirm Password is required'),
});

const setLoggedInUserToLocalStorage = (user) => {
    localStorage.setItem('loggedInUser', JSON.stringify(user));
};

const getUsersFromLocalStorage = () => {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
};

const setUsersToLocalStorage = (users) => {
    localStorage.setItem('users', JSON.stringify(users));
};

const Signup = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { control, handleSubmit, formState: { errors }, setError } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            mobile: '',
            password: '',
            confirmPassword: '',
        },
    });

    const handleClickShowPassword = () => setShowPassword((prev) => !prev);
    const handleClickShowConfirmPassword = () => setShowConfirmPassword((prev) => !prev);

    const onSubmit = (values) => {
        const { firstName, lastName, email, mobile, password } = values;
        const users = getUsersFromLocalStorage();
        const existingUser = users.find((user) => user.email === email);
        if (existingUser) {
            setError('email', { type: 'manual', message: 'Email already exists' });
            return;
        }
        const encryptedPassword = CryptoJS.AES.encrypt(password, 'secret-key').toString();
        const newUser = { firstName, lastName, email, mobile, password: encryptedPassword };
        if (users.length >= 5) {
            users.shift();
        }
        users.push(newUser);
        setUsersToLocalStorage(users);
        setLoggedInUserToLocalStorage(newUser);
        dispatch(UserLogIn(newUser));
        navigate('/');
    };

    return (
        <Grid2 container justifyContent="center" alignItems="center" sx={{ minHeight: 'calc(100vh - 70px)' }}>
            <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
                <Card>
                    <CardContent sx={{ padding: 3 }}>
                        <Typography variant="h5" gutterBottom align="center">
                            Signup
                        </Typography>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Grid2 container spacing={2} direction="column">
                                <Grid2 size={{ xs: 12 }}>
                                    <Controller
                                        name="firstName"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="First Name"
                                                fullWidth
                                                variant="outlined"
                                                size="small"
                                                error={!!errors.firstName}
                                                helperText={errors.firstName?.message}
                                            />
                                        )}
                                    />
                                </Grid2>
                                <Grid2 size={{ xs: 12 }}>
                                    <Controller
                                        name="lastName"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Last Name"
                                                fullWidth
                                                variant="outlined"
                                                size="small"
                                                error={!!errors.lastName}
                                                helperText={errors.lastName?.message}
                                            />
                                        )}
                                    />
                                </Grid2>
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
                                        name="mobile"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Mobile Number"
                                                fullWidth
                                                variant="outlined"
                                                size="small"
                                                error={!!errors.mobile}
                                                helperText={errors.mobile?.message}
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
                                    <Controller
                                        name="confirmPassword"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Confirm Password"
                                                fullWidth
                                                variant="outlined"
                                                size="small"
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                error={!!errors.confirmPassword}
                                                helperText={errors.confirmPassword?.message}
                                                InputProps={{
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <IconButton
                                                                aria-label="toggle password visibility"
                                                                onClick={handleClickShowConfirmPassword}
                                                                edge="end"
                                                            >
                                                                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
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
                                        Signup
                                    </Button>
                                </Grid2>
                                <Typography variant="body2" align="center">
                                    Already have an account?{' '}
                                    <NavLink to="/signin" replace>
                                        Login here
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

export default Signup;
