import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { TextField, Button, Typography, Grid2, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const validationSchema = Yup.object({
    firstName: Yup.string().required('First Name is required'),
    lastName: Yup.string().required('Last Name is required'),
    email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
    mobile: Yup.string()
        .matches(/^[0-9]{10}$/, 'Mobile number must be 10 digits')
        .required('Mobile number is required'),
});

const Profile = () => {
    const navigate = useNavigate();
    const loggedInUserStorage = localStorage.getItem('loggedInUser');
    const authUser = loggedInUserStorage ? JSON.parse(loggedInUserStorage) : null;

    if (!authUser) {
        navigate('/signin');
        return null;
    }

    const { control, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            firstName: authUser?.firstName || '',
            lastName: authUser?.lastName || '',
            email: authUser?.email || '',
            mobile: authUser?.mobile || '',
        },
    });

    const onSubmit = (updatedData) => {
        const users = getUsersFromLocalStorage();
        const updatedUsers = users.map((user) =>
            user.email === authUser.email ? { ...user, ...updatedData } : user
        );
        setUsersToLocalStorage(updatedUsers);
        setLoggedInUserToLocalStorage(updatedData);
        alert('Profile updated successfully!');
        navigate('/');
    };

    const getUsersFromLocalStorage = () => {
        const usersStorage = localStorage.getItem('users');
        return usersStorage ? JSON.parse(usersStorage) : [];
    };

    const setUsersToLocalStorage = (users) => {
        localStorage.setItem('users', JSON.stringify(users));
    };

    const setLoggedInUserToLocalStorage = (updatedUser) => {
        const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser')) || {};
        const updatedLoggedInUser = { ...loggedInUser, ...updatedUser };
        localStorage.setItem('loggedInUser', JSON.stringify(updatedLoggedInUser));
    };

    return (
        <Grid2 container justifyContent="center" alignItems="center" sx={{ minHeight: 'calc(100vh - 70px)' }}>
            <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
                <Card>
                    <CardContent sx={{ padding: 3 }}>
                        <Typography variant="h5" gutterBottom align="center">
                            Profile Update
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
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        fullWidth
                                        size="small"
                                    >
                                        Update
                                    </Button>
                                </Grid2>
                            </Grid2>
                        </form>
                    </CardContent>
                </Card>
            </Grid2>
        </Grid2>
    );
};

export default Profile;
