import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { productCategoryApi, productListApi } from '../store/Slices/productSlice';
import { Box, Grid, Card, CardContent, CardMedia, Typography, Pagination, ToggleButton, ToggleButtonGroup, TextField, InputAdornment, FormControl, InputLabel, Select, MenuItem, Avatar, Stack } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import ListIcon from '@mui/icons-material/List';
import SearchIcon from '@mui/icons-material/Search';
import AppsIcon from '@mui/icons-material/Apps';
import ProductGridView from './ProductGridView';
import ProductListView from './ProductListView';
import NoResultFound from '../assets/noresult.jpg';
import { useNavigate } from 'react-router-dom';

const Product = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [category, setCategory] = useState('');
  const [productFilter, setProductFilter] = useState('');
  const [heartClicked, setHeartClicked] = useState({}); // Track heart icon state per product
  const [limit, setLimit] = useState(30); // Limit per page
  const productList = useSelector((state) => state.product.productList);
  const productCategories = useSelector((state) => state.product.productCategories);
  const products = productList?.products || [];
  const total = productList?.total || 0;

  const [productView, setProductView] = useState('grid');

  const handleAlignment = (event, newProductView) => {
    setProductView(newProductView);
  };

  useEffect(() => {
    dispatch(productCategoryApi());
  }, [dispatch]);

  useEffect(() => {
    dispatch(productListApi({ skip: (currentPage - 1) * limit, limit, category, q: productFilter }));
  }, [dispatch, currentPage, limit, category, productFilter]);

  const handlePagination = (event, page) => {
    setCurrentPage(page);
  };

  const handleHeartClick = (productId) => {
    setHeartClicked((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  };

  const handleLimitChange = (e) => {
    const selectedLimit = Number(e.target.value);
    setLimit(selectedLimit);
  };

  return (
    <Box sx={{ backgroundColor: '#faf8f5', p: 5, minHeight: '100vh' }}>
      <Grid container justifyContent="center" spacing={2}>
        <Grid item xs={12} sx={{ paddingLeft: '0px !important', mb: 2 }}>
          <Box display={'flex'} flexDirection={'row'} justifyContent={'space-between'}>
            <ToggleButtonGroup value={productView} exclusive onChange={handleAlignment} aria-label="text productView">
              <ToggleButton value="grid" aria-label="left aligned">
                <AppsIcon />
              </ToggleButton>
              <ToggleButton value="list" aria-label="centered">
                <ListIcon />
              </ToggleButton>
            </ToggleButtonGroup>
            <Box sx={{ maxWidth: '720px' }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search products..."
                value={productFilter}
                onChange={(e) => setProductFilter(e?.target?.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  borderRadius: '30px',
                  backgroundColor: '#FFF',
                  '& .MuiOutlinedInput-root': {
                    padding: '5px 10px',
                    borderRadius: '30px', // Rounded corners for the search input
                  },
                  '& .MuiInputBase-input': {
                    padding: '10px', // Padding inside the text field
                  },
                }}
              />
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={3} sx={{ backgroundColor: '#FFF', p: 3 }}>
          <Box>
            <Typography variant="h6" mb={3}>Filters</Typography>
            <Box>
              <FormControl fullWidth>
                <InputLabel id="categories">Category</InputLabel>
                <Select
                  labelId="categories"
                  id="categories"
                  value={category}
                  label="Per Page"
                  onChange={(e) => setCategory(e?.target?.value)}
                  sx={{ backgroundColor: '#FFF' }}
                >
                  <MenuItem value={''} selected>All Category</MenuItem>
                  {productCategories && productCategories?.length > 0 ? (
                    productCategories.map((item, i) => {
                      return (
                        <MenuItem value={item}>{item}</MenuItem>
                      )
                    })
                  ) : (
                    <MenuItem value={''}>No Category Found</MenuItem>
                  )}
                </Select>
              </FormControl>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12} md={9}>
          <Box display={'flex'} flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'} mb={3}>
            <Typography>Total {total} results</Typography>
            <FormControl>
              <InputLabel id="limit">Per Page</InputLabel>
              <Select
                labelId="limit"
                id="limit"
                value={limit}
                label="Per Page"
                onChange={handleLimitChange}
                sx={{ backgroundColor: '#FFF', minWidth: '100px' }}
              >
                <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {products?.length > 0 ? (
            productView === 'grid' ? <ProductGridView products={products} handleHeartClick={handleHeartClick} heartClicked={heartClicked} navigate={navigate} /> : <ProductListView products={products} handleHeartClick={handleHeartClick} heartClicked={heartClicked} navigate={navigate} />
          ) : (
            <Box display={'flex'} justifyContent={'center'} alignItems={'center'} flexDirection={'column'}>
              <Avatar src={NoResultFound} sx={{ borderRadius: '0px', width: { lg: '550px', md: '450px', sm: '350px',xs:'250px' }, height: '100%',mb:3 }} />
              <Typography>No Result Found</Typography>
            </Box>
          )}

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
            <Pagination
              count={Math.ceil(total / limit)}
              page={currentPage}
              onChange={handlePagination}
              color="primary"
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Product;
