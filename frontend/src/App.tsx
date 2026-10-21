import Header from "./components/header/Header";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/storefront/HomePage";
import ProductsPage from "./pages/storefront/ProductsPage";
import CartPage from "./pages/storefront/CartPage";
import ProductDetailPage from "./pages/storefront/ProductDetailPage";
import FavoritesPage from "./pages/storefront/FavoritesPage";
import Footer from "./components/footer/Footer";
import MyAccountPage from "./pages/storefront/MyAccountPage";
import LoginPage from "./pages/storefront/LoginPage";
import RegisterPage from "./pages/storefront/RegisterPage";
import { loginSuccess, setAccessToken } from "./redux/slices/authSlice";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "./redux/store";
import { useEffect } from "react";

function App() {
  const dispach = useDispatch<AppDispatch>();

  useEffect(() => {
    async function refreshLogin() {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/auth/refresh`,
          {
            method: "POST",
            credentials: "include",
          },
        );
        if (!response.ok) {
          return;
        }
        const data = await response.json();
        dispach(loginSuccess(data.user));
        dispach(setAccessToken(data.accessToken));
      } catch {
        console.log("Oturum bilgisi alınamadı.");
      }
    }
    refreshLogin();
  },[dispach]);
  return (
    <div className="bg-cream flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/man" element={<ProductsPage />} />
          <Route path="/women" element={<ProductsPage />} />
          <Route path="/accessories" element={<ProductsPage />} />
          <Route path="/new-products" element={<ProductsPage />} />
          <Route path="/sales" element={<ProductsPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/shopping-cart" element={<CartPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/my-account" element={<MyAccountPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
