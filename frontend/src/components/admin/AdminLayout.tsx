import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { clearAdminToken } from "../../services/adminService";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `block rounded-lg px-3 py-2 text-sm ${isActive ? "bg-white text-black" : "text-stone-300 hover:bg-stone-800 hover:text-white"}`;

function AdminLayout() {
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await fetch(`${import.meta.env.VITE_BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } finally {
      clearAdminToken();
      navigate("/admin/login");
    }
  }

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 md:grid md:grid-cols-[240px_1fr]">
      <aside className="bg-stone-950 p-5 text-white">
        <Link to="/admin" className="text-xl font-bold">ShopSphere Admin</Link>
        <nav className="mt-8 grid gap-2" aria-label="Admin menüsü">
          <NavLink to="/admin" end className={linkClass}>Dashboard</NavLink>
          <NavLink to="/admin/products" className={linkClass}>Ürünler</NavLink>
          <NavLink to="/admin/orders" className={linkClass}>Siparişler</NavLink>
          <NavLink to="/admin/users" className={linkClass}>Kullanıcılar</NavLink>
          <Link to="/" className="mt-4 rounded-lg px-3 py-2 text-sm text-stone-300 hover:bg-stone-800">Mağazaya dön</Link>
          <button onClick={handleLogout} className="text-left rounded-lg px-3 py-2 text-sm text-stone-300 hover:bg-stone-800">Çıkış yap</button>
        </nav>
      </aside>
      <main className="min-w-0 p-5 sm:p-8"><Outlet /></main>
    </div>
  );
}

export default AdminLayout;
