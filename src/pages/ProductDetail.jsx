import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { productDetailApi } from '../store/Slices/productSlice';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Rating,
  Button,
  Divider,
  Paper,
  Chip,
  CircularProgress
} from '@mui/material';
import { blue } from '@mui/material/colors';

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const productDetail = useSelector((state) => state.product.productDetail);
  const loading = useSelector((state) => state.product.loading); // assuming loading state is tracked
  const error = useSelector((state) => state.product.error); // assuming error state is tracked

  useEffect(() => {
    dispatch(productDetailApi({ id }));
  }, [id, dispatch]);

  // Early return if loading or error is present
  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error.message}</Typography>;

  // Destructure product details with default values to handle missing fields
  const {
    title = "Product Title Not Available",
    description = "No description available for this product.",
    category = "Not Specified",
    price = 0,
    discountPercentage = 0,
    rating = 0,
    stock = 0,
    tags = [],
    brand = "Unknown Brand",
    sku = "N/A",
    weight = 0,
    dimensions = { width: 0, height: 0, depth: 0 },
    warrantyInformation = "No warranty information available.",
    shippingInformation = "No shipping information available.",
    availabilityStatus = "Out of Stock",
    reviews = [],
    returnPolicy = "No return policy available.",
    minimumOrderQuantity = 0,
    meta = { barcode: "N/A", qrCode: "" },
    images = [],
    thumbnail = ""
  } = productDetail || {}; // Safely destructure with fallback if productDetail is undefined

  return (
    <Box sx={{ padding: 3 }}>
      {/* Product Title and Rating */}
      <Typography variant="h4" component="h1" gutterBottom>
        {title}
      </Typography>
      <Rating value={rating} readOnly precision={0.5} />

      <Grid container spacing={3} mt={3}>
        {/* Left Side - Product Images */}
        <Grid item xs={12} sm={6}>
          <Card sx={{ boxShadow: 3 }}>
            <CardMedia
              component="img"
              image={images?.[0] || thumbnail || '/default-image.jpg'}
              alt={title}
              sx={{ objectFit: 'contain', maxHeight: 400 }}
            />
          </Card>
        </Grid>

        {/* Right Side - Product Details */}
        <Grid item xs={12} sm={6}>
          <Card sx={{ padding: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Price: ${price}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                ${price * (1 + discountPercentage / 100)}
              </Typography>
              <Typography variant="body1" color="primary" fontWeight="bold">
                Discount: {discountPercentage.toFixed(2)}%
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ marginTop: 2 }}>
                {description}
              </Typography>

              <Box mt={2}>
                <Typography variant="body2" fontWeight="bold">Brand:</Typography>
                <Typography variant="body2" color="text.secondary">{brand}</Typography>
              </Box>

              <Box mt={2}>
                <Typography variant="body2" fontWeight="bold">SKU:</Typography>
                <Typography variant="body2" color="text.secondary">{sku}</Typography>
              </Box>

              <Box mt={2}>
                <Typography variant="body2" fontWeight="bold">Stock:</Typography>
                <Typography variant="body2" color={stock > 0 ? 'green' : 'red'}>
                  {stock > 0 ? 'In Stock' : 'Out of Stock'}
                </Typography>
              </Box>

              <Box mt={2}>
                <Button variant="contained" color="primary" fullWidth disabled={stock === 0}>
                  {stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                </Button>
              </Box>

              {/* Tags */}
              <Box mt={2}>
                {tags?.length > 0 ? (
                  tags.map((tag) => (
                    <Chip label={tag} sx={{ margin: '4px' }} color="primary" key={tag} />
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">No tags available.</Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Additional Information */}
      <Grid container spacing={3} mt={3}>
        <Grid item xs={12} sm={6}>
          <Paper sx={{ padding: 2, backgroundColor: blue[50] }}>
            <Typography variant="h6">Dimensions</Typography>
            <Typography variant="body2">Width: {dimensions.width} cm</Typography>
            <Typography variant="body2">Height: {dimensions.height} cm</Typography>
            <Typography variant="body2">Depth: {dimensions.depth} cm</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Paper sx={{ padding: 2, backgroundColor: blue[50] }}>
            <Typography variant="h6">Shipping & Warranty</Typography>
            <Typography variant="body2">Shipping: {shippingInformation}</Typography>
            <Typography variant="body2">Warranty: {warrantyInformation}</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Return Policy */}
      <Box mt={3}>
        <Typography variant="h6">Return Policy</Typography>
        <Typography variant="body2">{returnPolicy}</Typography>
      </Box>

      {/* Reviews Section */}
      <Divider sx={{ marginY: 3 }} />
      <Typography variant="h5">Customer Reviews</Typography>
      {reviews?.length > 0 ? (
        reviews.map((review, index) => (
          <Box key={index} sx={{ marginBottom: 2 }}>
            <Rating value={review.rating} readOnly precision={0.5} />
            <Typography variant="body2" color="text.secondary">
              {review.comment}
            </Typography>
            <Typography variant="body2" color="text.secondary" fontStyle="italic">
              - {review.reviewerName}, {new Date(review.date).toLocaleDateString()}
            </Typography>
          </Box>
        ))
      ) : (
        <Typography variant="body2" color="text.secondary">No reviews yet.</Typography>
      )}
    </Box>
  );
};

export default ProductDetail;
