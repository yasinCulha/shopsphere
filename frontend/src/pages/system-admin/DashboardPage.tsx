import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getDashboardStats, type AdminStats } from "../../services/adminService";

function DashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getDashboardStats().then(setStats).catch((requestError: unknown) => {
      setError(requestError instanceof Error ? requestError.message : "Veriler alınamadı.");
    });
  }, []);

  const cards = [
    ["Ürünler", stats?.products, "/admin/products"],
    ["Müşteriler", stats?.customers, "/admin/users"],
    ["Siparişler", stats?.orders, "/admin/orders"],
    ["Satış toplamı", stats ? stats.sales.toLocaleString("tr-TR", { style: "currency", currency: "USD" }) : "—", "/admin/orders"],
  ] as const;

  return (
    <div>
      <p className="text-sm text-stone-500">ShopSphere yönetim</p>
      <h1 className="mt-1 text-3xl font-bold">Dashboard</h1>
      <p className="mt-2 text-stone-600">Mağazanın genel durumunu buradan takip et.</p>
      {error && <p role="alert" className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(([label, value, to]) => (
          <Link key={label} to={to} className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow">
            <p className="text-sm text-stone-500">{label}</p>
            <p className="mt-3 text-3xl font-bold">{value ?? "…"}</p>
          </Link>
        ))}
      </div>
      <section className="mt-7 rounded-xl border border-stone-200 bg-white p-5">
        <h2 className="font-semibold">Hızlı işlemler</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link to="/admin/products" className="rounded-lg bg-stone-950 px-4 py-2 text-sm text-white">Ürünleri yönet</Link>
          <Link to="/admin/orders" className="rounded-lg border border-stone-300 px-4 py-2 text-sm">Siparişleri gör</Link>
        </div>
      </section>
    </div>
  );
}

export default DashboardPage;
