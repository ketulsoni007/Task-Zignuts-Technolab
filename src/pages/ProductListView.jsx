import React from 'react';
import { List, ListItem, Card, CardContent, CardMedia, Typography, Box } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';

const ProductListView = (props) => {
  const { products, handleHeartClick, heartClicked,navigate } = props;

  return (
    <List>
      {products.map((product) => (
        <ListItem key={product.id} sx={{ display: 'flex', marginBottom: 3 }} onClick={()=>navigate(`/product/${product.id}`)}>
          <Card sx={{ display: 'flex', width: '100%' }}>
            <Box sx={{ position: 'relative', width: '150px', height: '150px' }}>
              {/* Heart Icon on Top Right */}
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
                height="100%"
                image={product.thumbnail}
                alt={product.title}
                sx={{
                  objectFit: 'contain',
                }}
              />
            </Box>

            {/* Product Details */}
            <CardContent sx={{ flex: 1 }}>
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
        </ListItem>
      ))}
    </List>
  );
};

export default ProductListView;
