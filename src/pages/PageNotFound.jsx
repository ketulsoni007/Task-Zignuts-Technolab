import { Avatar, Grid2, Typography } from '@mui/material';
import React from 'react';
import notFound from '../assets/404.png'

const PageNotFound = () => {
  return (
    <Grid2 container justifyContent="center" alignItems="center" sx={{ minHeight: 'calc(100vh - 70px)' }}>
      <Grid2>
        <Avatar src={notFound} sx={{width:'320px',borderRadius:0,height:'auto'}} />
      </Grid2>
    </Grid2>
  )
}

export default PageNotFound;