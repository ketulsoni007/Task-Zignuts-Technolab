import { combineReducers } from "redux";
import productReducer from "./Slices/productSlice";

const reducer = combineReducers({
  product: productReducer,
});

export default reducer;