import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import {
    TextField,
    Button,
    Typography,
    Grid2,
    Card,
    CardContent,
    InputAdornment,
    IconButton,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const validationSchema = Yup.object({
    currentPassword: Yup.string().required('Current Password is required'),
    newPassword: Yup.string()
        .min(6, 'New Password must be at least 6 characters')
        .required('New Password is required'),
    confirmNewPassword: Yup.string()
        .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
        .required('Confirm New Password is required'),
});

const PasswordChange = () => {
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
    const loggedInUserStorage = localStorage.getItem('loggedInUser');
    const authUser = loggedInUserStorage ? JSON.parse(loggedInUserStorage) : null;

    if (!authUser) {
        navigate('/signin'); // Redirect if no logged-in user is found
        return null;
    }

    const { control, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            confirmNewPassword: '',
        },
    });

    const handleClickShowCurrentPassword = () => setShowCurrentPassword((prev) => !prev);
    const handleClickShowNewPassword = () => setShowNewPassword((prev) => !prev);
    const handleClickShowConfirmNewPassword = () => setShowConfirmNewPassword((prev) => !prev);

    const onSubmit = (data) => {
        const { oldPassword, newPassword } = data;
    
        // Fetch stored user
        const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
        if (!loggedInUser) {
          setError('oldPassword', { type: 'manual', message: 'User not found!' });
          return;
        }
    
        // Decrypt and compare old password
        const decryptedPassword = CryptoJS.AES.decrypt(
          loggedInUser.password,
          'secret-key'
        ).toString(CryptoJS.enc.Utf8);
    
        if (decryptedPassword !== oldPassword) {
          setError('oldPassword', { type: 'manual', message: 'Old Password is incorrect' });
          return;
        }
    
        // Encrypt new password and update user
        const encryptedNewPassword = CryptoJS.AES.encrypt(newPassword, 'secret-key').toString();
        loggedInUser.password = encryptedNewPassword;
    
        localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
        alert('Password changed successfully!');
      };

    return (
        <Grid2 container justifyContent="center" alignItems="center" sx={{ minHeight: 'calc(100vh - 70px)' }}>
            <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
                <Card>
                    <CardContent>
                        <Typography variant="h5" gutterBottom align="center">
                            Change Password
                        </Typography>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Grid2 container spacing={2} direction="column">
                                <Grid2 size={{ xs: 12 }}>
                                    <Controller
                                        name="currentPassword"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Current Password"
                                                fullWidth
                                                size='small'
                                                type={showCurrentPassword ? 'text' : 'password'}
                                                error={!!errors.currentPassword}
                                                helperText={errors.currentPassword?.message}
                                                InputProps={{
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <IconButton
                                                                onClick={handleClickShowCurrentPassword}
                                                                edge="end"
                                                            >
                                                                {showCurrentPassword ? (
                                                                    <VisibilityOff />
                                                                ) : (
                                                                    <Visibility />
                                                                )}
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
                                        name="newPassword"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="New Password"
                                                fullWidth
                                                size='small'
                                                type={showNewPassword ? 'text' : 'password'}
                                                error={!!errors.newPassword}
                                                helperText={errors.newPassword?.message}
                                                InputProps={{
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <IconButton
                                                                onClick={handleClickShowNewPassword}
                                                                edge="end"
                                                            >
                                                                {showNewPassword ? (
                                                                    <VisibilityOff />
                                                                ) : (
                                                                    <Visibility />
                                                                )}
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
                                        name="confirmNewPassword"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Confirm New Password"
                                                fullWidth
                                                type={showConfirmNewPassword ? 'text' : 'password'}
                                                error={!!errors.confirmNewPassword}
                                                helperText={errors.confirmNewPassword?.message}
                                                size='small'
                                                InputProps={{
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <IconButton
                                                                onClick={handleClickShowConfirmNewPassword}
                                                                edge="end"
                                                            >
                                                                {showConfirmNewPassword ? (
                                                                    <VisibilityOff />
                                                                ) : (
                                                                    <Visibility />
                                                                )}
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
                                    >
                                        Change Password
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

export default PasswordChange;
