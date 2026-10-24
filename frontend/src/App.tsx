import Header from "./components/header/Header";
import { Outlet, Route, Routes } from "react-router-dom";
import HomePage from "./pages/storefront/HomePage";
import ProductsPage from "./pages/storefront/ProductsPage";
import CartPage from "./pages/storefront/CartPage";
import ProductDetailPage from "./pages/storefront/ProductDetailPage";
import FavoritesPage from "./pages/storefront/FavoritesPage";
import CupboardPage from "./pages/storefront/CupboardPage";
import Footer from "./components/footer/Footer";
import MyAccountPage from "./pages/storefront/MyAccountPage";
import LoginPage from "./pages/storefront/LoginPage";
import RegisterPage from "./pages/storefront/RegisterPage";
import { loginSuccess, setAccessToken } from "./redux/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "./redux/store";
import { setFavorites } from "./redux/slices/productSlice";
import { getFavorites } from "./services/favoritesService";
import { API_URL } from "./services/apiConfig";
import { useEffect } from "react";
import { ToastProvider } from "./components/ui/ToastProvider";
import AdminGuard from "./components/admin/AdminGuard";
import AdminLayout from "./components/admin/AdminLayout";
import AdminLoginPage from "./pages/system-admin/LoginPage";
import AdminDashboardPage from "./pages/system-admin/DashboardPage";
import AdminProductsPage from "./pages/system-admin/ProductsPage";
import AdminUsersPage from "./pages/system-admin/UsersPage";
import AdminOrdersPage from "./pages/system-admin/OrdersPage";

function StorefrontLayout() {
  return (
    <div className="bg-cream flex min-h-screen flex-col">
      <Header />
      <main className="flex-1"><Outlet /></main>
      <Footer />
    </div>
  );
}

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  useEffect(() => {
    async function refreshLogin() {
      try {
        const response = await fetch(
          `${API_URL}/auth/refresh`,
          {
            method: "POST",
            credentials: "include",
          },
        );
        if (!response.ok) {
          return;
        }
        const data = await response.json();
        dispatch(loginSuccess(data.user));
        dispatch(setAccessToken(data.accessToken));
      } catch {
        console.log("Oturum bilgisi alınamadı.");
      }
    }
    refreshLogin();
  }, [dispatch]);

  useEffect(() => {
    async function loadFavorites() {
      dispatch(setFavorites([]));

      if (!accessToken) return;

      try {
        const favorites = await getFavorites(accessToken);
        dispatch(setFavorites(favorites));
      } catch (error) {
        console.error("Favoriler yüklenemedi:", error);
      }
    }

    loadFavorites();
  }, [accessToken, dispatch]);
  return (
    <ToastProvider>
      <Routes>
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin" element={<AdminGuard />}>
          <Route element={<AdminLayout />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="products" element={<AdminProductsPage />} />
            <Route path="users" element={<AdminUsersPage />} />
            <Route path="orders" element={<AdminOrdersPage />} />
          </Route>
        </Route>
        <Route element={<StorefrontLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/man" element={<ProductsPage />} />
          <Route path="/women" element={<ProductsPage />} />
          <Route path="/accessories" element={<ProductsPage />} />
          <Route path="/new-products" element={<ProductsPage />} />
          <Route path="/sales" element={<ProductsPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/cupboard" element={<CupboardPage />} />
          <Route path="/shopping-cart" element={<CartPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/my-account" element={<MyAccountPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
      </Routes>
    </ToastProvider>
  );
}

export default App;
