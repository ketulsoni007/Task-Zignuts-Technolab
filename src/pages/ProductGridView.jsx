import React from 'react';
import { Grid2, Card, CardContent, CardMedia, Typography, Box } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useParams } from 'react-router-dom';

const ProductGridView = (props) => {
    const { products, handleHeartClick, heartClicked, navigate } = props;
    return (
        <Grid2 container spacing={3}>
            {products.map((product) => (
                <Grid2 item size={{ xs: 12, sm: 6, lg: 4 }} md={4} key={product.id}>
                    <Card onClick={() => navigate(`/product/${product.id}`)} sx={{cursor:'pointer'}}>
                        <Box sx={{ position: 'relative' }}>
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: 10,
                                    right: 10,
                                    zIndex: 1,
                                    cursor: 'pointer',
                                }}
                                onClick={() => handleHeartClick(product.id)}
                            >
                                {heartClicked[product.id] ? (
                                    <FavoriteIcon sx={{ color: 'red' }} />
                                ) : (
                                    <FavoriteBorderIcon sx={{ color: 'gray' }} />
                                )}
                            </Box>

                            {product.category && (
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        top: 10,
                                        left: 10,
                                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                        color: 'white',
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                    }}
                                >
                                    {product.category}
                                </Box>
                            )}

                            <CardMedia
                                component="img"
                                height="250"
                                image={product.thumbnail}
                                alt={product.title}
                                sx={{
                                    objectFit: 'contain',
                                }}
                            />
                        </Box>
                        <CardContent>
                            <Typography
                                gutterBottom
                                variant="h6"
                                component="div"
                                sx={{
                                    display: '-webkit-box',
                                    WebkitBoxOrient: 'vertical',
                                    WebkitLineClamp: 1,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                }}
                            >
                                {product.title}
                            </Typography>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                    display: '-webkit-box',
                                    WebkitBoxOrient: 'vertical',
                                    WebkitLineClamp: 2,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                }}
                            >
                                {product.description}
                            </Typography>
                            <Typography variant="body2" color="text.primary">
                                Price: ${product.price} | Rating: {product.rating}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid2>
            ))}
        </Grid2>
    );
};

export default ProductGridView;
