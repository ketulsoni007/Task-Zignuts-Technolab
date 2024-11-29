import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { productDetailApi } from '../store/Slices/productSlice';
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';
import { Box, Grid2, Typography, Divider, Rating, Stack, Chip, Avatar, Skeleton } from '@mui/material';
import useWindowWidth from '../hooks/useWindowWidth';
import StarIcon from '@mui/icons-material/Star';

const ProductDetail = () => {
  const { id } = useParams();
  const width = useWindowWidth();
  const dispatch = useDispatch();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const productDetail = useSelector((state) => state.product.productDetail);
  const isApiStatus = useSelector((state) => state.product.isApiStatus);
  const detailLoading = isApiStatus?.productDetailApi === 'loading';
  const reviews = productDetail?.reviews || [];

  const category = productDetail?.category?.toUpperCase() || '';
  const title = productDetail?.title || '';
  const description = productDetail?.description || '';
  const price = productDetail?.price || '';
  const discountPercentage = productDetail?.discountPercentage || 0;
  const rating = productDetail?.rating || 0;
  const stock = productDetail?.stock || 0;
  const warrantyInformation = productDetail?.warrantyInformation || '';
  const shippingInformation = productDetail?.shippingInformation || '';
  const returnPolicy = productDetail?.returnPolicy || '';
  const brand = productDetail?.brand || '';
  const sku = productDetail?.sku || '';
  const weight = productDetail?.weight || 0;
  const dimensions = productDetail?.dimensions || {};
  const tags = productDetail?.tags || [];
  const qrCode = productDetail?.meta?.qrCode || '';

  useEffect(() => {
    if (id) {
      dispatch(productDetailApi({ id }));
    }
  }, [id, dispatch]);

  const images = productDetail?.images?.map(image => ({
    original: image,
    thumbnail: image
  })) || [];

  const renderImage = (image) => (
    <img
      src={image.original}
      alt=""
      style={{
        width: '100%',
        height: isFullscreen ? 'calc(100vh - 120px)' : width < 900 ? '300px' : '650px',
        objectFit: 'contain'
      }}
    />
  );

  const handleScreenChange = (isFull) => {
    setIsFullscreen(isFull);
  };

  const renderReviews = () => {
    return reviews.map((review, index) => (
      <Box key={index} sx={{ marginTop: 2, display: 'flex', alignItems: 'center' }}>
        <Avatar sx={{ marginRight: 2 }}>
          {review?.reviewerName?.charAt(0)?.toUpperCase()}
        </Avatar>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
            {review.reviewerName}
          </Typography>
          <Rating value={review.rating} precision={0.1} readOnly />
          <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'rgba(0,0,0,0.6)' }}>
            {review.comment}
          </Typography>
          <Typography variant="body2" sx={{ fontSize: '0.75rem', color: 'rgba(0,0,0,0.4)' }}>
            {new Date(review.date).toLocaleDateString()}
          </Typography>
        </Box>
      </Box>
    ));
  };

  const ratingDistribution = reviews.length
    ? [5, 4, 3, 2, 1].map(star => reviews.filter(review => review.rating === star).length)
    : [0, 0, 0, 0, 0];

  const maxRatingCount = Math.max(...ratingDistribution);

  return (
    <Box sx={{ padding: 3 }}>
      {detailLoading ? (
        <Grid2 container spacing={5} justifyContent="center" alignItems="flex-start">
          <Grid2 item size={{ md: 6, xl: 6, sm: 12 }}>
            <Skeleton variant="text" width="100%" height={600} sx={{ marginBottom: 0.5 }} />
          </Grid2>
          <Grid2 item size={{ md: 6, xl: 6, sm: 12 }}>
            <Skeleton variant="text" width="100%" height={300} sx={{ marginBottom: 0.5 }} />
            <Skeleton variant="text" width="100%" height={300} sx={{ marginBottom: 0.5 }} />
          </Grid2>
        </Grid2>
      ) : (
        <Grid2 container spacing={5} justifyContent="center" alignItems="flex-start">
          <Grid2 item size={{ md: 6, xl: 6 }} sx={{ backgroundColor: '#F9F6F4' }}>
            <ImageGallery
              items={images}
              showFullscreenButton={true}
              showPlayButton={false}
              useBrowserFullscreen={true}
              renderItem={renderImage}
              onScreenChange={handleScreenChange}
            />
          </Grid2>
          <Grid2 item size={{ md: 6, xl: 6 }}>
            <Box sx={{ padding: 2 }}>
              <Typography variant="body2" sx={{ color: 'rgba(0,0,0,0.5)' }}>
                {category}
              </Typography>
              <Typography variant="h5">{title}</Typography>
              <Typography variant="body1" sx={{ marginTop: 2 }}>
                {description}
              </Typography>
              <Typography variant="h6" sx={{ marginTop: 2 }}>
                ${price}{' '}
                <span style={{ textDecoration: 'line-through', marginLeft: 8 }}>
                  ${((price * (1 + discountPercentage / 100)).toFixed(2))}
                </span>
              </Typography>

              <Box sx={{ marginTop: 2 }}>
                <Rating value={rating} precision={0.1} readOnly />
              </Box>

              <Typography variant="body2" sx={{ marginTop: 1 }}>
                In Stock: {stock}
              </Typography>
              <Typography variant="body2" sx={{ marginTop: 1 }}>
                SKU: {sku}
              </Typography>
              <Typography variant="body2" sx={{ marginTop: 1 }}>
                Brand: {brand}
              </Typography>
              <Typography variant="body2" sx={{ marginTop: 1 }}>
                Weight: {weight} kg
              </Typography>
              <Typography variant="body2" sx={{ marginTop: 1 }}>
                Dimensions: {dimensions.width} x {dimensions.height} x {dimensions.depth} cm
              </Typography>
              <Typography variant="body2" sx={{ marginTop: 1 }}>
                Warranty: {warrantyInformation}
              </Typography>
              <Typography variant="body2" sx={{ marginTop: 1 }}>
                Shipping Info: {shippingInformation}
              </Typography>
              <Typography variant="body2" sx={{ marginTop: 1 }}>
                Return Policy: {returnPolicy}
              </Typography>

              <Divider sx={{ marginTop: 2 }} />

              <Box sx={{ marginTop: 3 }}>
                <Typography variant="h6">Product Tags:</Typography>
                <Stack direction="row" spacing={1}>
                  {tags.map((tag, index) => (
                    <Chip key={index} label={tag} color="primary" size="small" />
                  ))}
                </Stack>
              </Box>

              {qrCode && (
                <Box sx={{ marginTop: 3 }}>
                  <Typography variant="h6">Scan QR Code for More Info:</Typography>
                  <img src={qrCode} alt="QR Code" style={{ width: '150px', height: '150px' }} />
                </Box>
              )}
            </Box>
          </Grid2>
          <Grid2 item size={{ md: 6, xl: 6, sm: 12 }}>
            <Stack display={'flex'} flexDirection={'row'} alignItems={'center'}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, padding: 2, maxWidth: '200px' }}>
                <Box sx={{ position: 'relative' }}>
                  <StarIcon sx={{ fontSize: 120, color: 'gold' }} /> {/* Star icon */}
                  <Typography
                    variant="body1"
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      color: '#FFF',
                    }}
                  >
                    {rating} {/* Display the rating number centrally */}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ marginTop: 3, width: '100%' }}>
                {[5, 4, 3, 2, 1].map((star, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', marginTop: 1 }}>
                    <Typography variant="body2" sx={{ minWidth: '30px', whiteSpace: 'nowrap', mr: 2 }}>
                      {star} Stars
                    </Typography>
                    <Box sx={{ width: '100%', height: 8, backgroundColor: '#EEE', borderRadius: 1 }}>
                      <Box
                        sx={{
                          width: `${(ratingDistribution[index] / maxRatingCount) * 100}%`,
                          height: '100%',
                          backgroundColor: 'gold',
                          borderRadius: 1,
                        }}
                      />
                    </Box>
                    <Typography variant="body2" sx={{ marginLeft: 2 }}>
                      {ratingDistribution[index]}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Stack>
          </Grid2>
          <Grid2 item size={{ md: 6, xl: 6, sm: 12 }}>
            <Typography variant="h5">Customer Reviews:</Typography>
            {renderReviews()}
          </Grid2>
        </Grid2>
      )}
    </Box>
  );
};

export default ProductDetail;
