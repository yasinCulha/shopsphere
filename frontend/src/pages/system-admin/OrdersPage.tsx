import { useEffect, useState } from "react";
import { getAdminOrders, type AdminOrder } from "../../services/adminService";

function OrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getAdminOrders().then((result) => setOrders(result.orders)).catch((requestError: unknown) => {
      setError(requestError instanceof Error ? requestError.message : "Siparişler alınamadı.");
    });
  }, []);

  return <div><h1 className="text-3xl font-bold">Siparişler</h1><p className="mt-2 text-stone-600">Müşteri sipariş geçmişi.</p>
    {error && <p role="alert" className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    <div className="mt-6 grid gap-3">{orders.map((order) => <article key={order.id} className="rounded-xl border border-stone-200 bg-white p-5"><div className="flex flex-wrap justify-between gap-2"><h2 className="font-semibold">Sipariş #{order.id}</h2><span className="rounded-full bg-stone-100 px-3 py-1 text-xs">{order.status}</span></div><p className="mt-2 text-sm text-stone-600">{order.email} · {new Date(order.createdAt).toLocaleDateString("tr-TR")}</p><p className="mt-2 text-sm">{order.items.map((item) => `${item.title} × ${item.quantity}`).join(", ") || "Ürün yok"}</p><p className="mt-3 font-semibold">{order.total.toLocaleString("tr-TR", { style: "currency", currency: "USD" })}</p></article>)}{orders.length === 0 && <p className="rounded-xl border border-stone-200 bg-white p-5 text-stone-500">Henüz sipariş yok. Ödeme/sipariş oluşturma akışı kurulunca siparişler burada görünür.</p>}</div>
  </div>;
}

export default OrdersPage;
