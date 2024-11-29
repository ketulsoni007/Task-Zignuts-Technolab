import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { productCategoryApi, productListApi } from '../store/Slices/productSlice';
import { Box, Grid2, Typography, Pagination, ToggleButton, ToggleButtonGroup, TextField, InputAdornment, FormControl, InputLabel, Select, MenuItem, Avatar, Skeleton } from '@mui/material';
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
  const [heartClicked, setHeartClicked] = useState({});
  const [limit, setLimit] = useState(30);
  const productList = useSelector((state) => state.product.productList);
  const productCategories = useSelector((state) => state.product.productCategories);
  const isApiStatus = useSelector((state) => state.product.isApiStatus);
  const productLoading = isApiStatus?.productListApi === 'loading';
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
      <Grid2 container justifyContent="center" spacing={3}>
        <Grid2 item size={{ xs: 12 }} sx={{ paddingLeft: '0px !important', mb: 2 }}>
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
                    borderRadius: '30px',
                  },
                  '& .MuiInputBase-input': {
                    padding: '10px',
                  },
                }}
              />
            </Box>
          </Box>
        </Grid2>
        <Grid2 item size={{ md: 3, xs: 12 }} sx={{ backgroundColor: '#FFF', p: 3 }}>
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
                        <MenuItem value={item} key={i}>{item}</MenuItem>
                      )
                    })
                  ) : (
                    <MenuItem value={''}>No Category Found</MenuItem>
                  )}
                </Select>
              </FormControl>
            </Box>
          </Box>
        </Grid2>
        <Grid2 item size={{ md: 9, xs: 12 }}>
          <Box display={'flex'} flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'} mb={3}>
            <Typography>Total {total} results</Typography>
            <FormControl>
              <InputLabel id="limit">Per Page</InputLabel>
              <Select
                labelId="limit"
                id="limit"
                value={limit}
                label="Per Page"
                size='small'
                onChange={handleLimitChange}
                sx={{ backgroundColor: '#FFF', minWidth: '100px' }}
              >
                <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
              </Select>
            </FormControl>
          </Box>
          {productLoading ? (
            <Box>
              {[...Array(3)].map((_, index) => {
                return (
                  <React.Fragment key={index}>
                  {productView === 'grid' ? (
                    <Grid2 container justifyContent="center" spacing={3}>
                    <Grid2 item mb={2} size={{ lg:4, md: 6, xs: 12 }}>
                      <Skeleton variant="rectangular" width="100%" height={200} sx={{ borderRadius: 2 }} />
                    </Grid2>
                    <Grid2 item mb={2} size={{ lg:4, md: 6, xs: 12 }}>
                      <Skeleton variant="rectangular" width="100%" height={200} sx={{ borderRadius: 2 }} />
                    </Grid2>
                    <Grid2 item mb={2} size={{ lg:4, md: 6, xs: 12 }}>
                      <Skeleton variant="rectangular" width="100%" height={200} sx={{ borderRadius: 2 }} />
                    </Grid2>
                    </Grid2>
                  ) : (
                    <Grid2 item mb={2}>
                      <Skeleton variant="rectangular" width="100%" height={200} sx={{ borderRadius: 2 }} />
                    </Grid2>
                  )}
                  </React.Fragment>
                )
              })}
            </Box>
          ) :
            products?.length > 0 ? (
              productView === 'grid' ? <ProductGridView products={products} handleHeartClick={handleHeartClick} heartClicked={heartClicked} navigate={navigate} /> : <ProductListView products={products} handleHeartClick={handleHeartClick} heartClicked={heartClicked} navigate={navigate} />
            ) : (
              <Box display={'flex'} justifyContent={'center'} alignItems={'center'} flexDirection={'column'}>
                <Avatar src={NoResultFound} sx={{ borderRadius: '0px', width: { lg: '550px', md: '450px', sm: '350px', xs: '250px' }, height: '100%', mb: 3 }} />
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
        </Grid2>
      </Grid2>
    </Box>
  );
};

export default Product;
