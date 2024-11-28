import { Routes, Route, useLocation } from "react-router-dom";
import Product from "./pages/Product";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PageNotFound from "./pages/PageNotFound";
import Header from "./components/Header";
import ProductDetail from "./pages/ProductDetail";
import Profile from "./pages/Profile";
import PasswordChange from "./pages/Password";

function App() {

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Product />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/password" element={<PasswordChange />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/signin" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
}


export default App;
