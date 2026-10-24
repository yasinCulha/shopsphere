import { useEffect, useState, type FormEvent } from "react";
import type { Product } from "../../types/product";
import {
  createAdminProduct,
  deleteAdminProduct,
  getAdminProducts,
  updateAdminProduct,
  type AdminProductForm,
} from "../../services/adminService";

const emptyProduct: AdminProductForm = {
  title: "",
  description: "",
  category: "",
  price: 0,
  discountPercentage: 0,
  stock: 0,
  thumbnail: "",
  images: [],
};

function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<AdminProductForm>(emptyProduct);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  async function loadProducts() {
    try {
      const result = await getAdminProducts();
      setProducts(result.products);
      setError("");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Ürünler yüklenemedi.");
    } finally {
      setHasLoaded(true);
    }
  }

  useEffect(() => {
    let isActive = true;
    getAdminProducts()
      .then((result) => {
        if (isActive) setProducts(result.products);
      })
      .catch((requestError: unknown) => {
        if (isActive) setError(requestError instanceof Error ? requestError.message : "Ürünler yüklenemedi.");
      })
      .finally(() => {
        if (isActive) setHasLoaded(true);
      });
    return () => { isActive = false; };
  }, []);

  function startAdd() {
    setEditingId(null);
    setForm(emptyProduct);
    setIsFormOpen(true);
  }

  function startEdit(product: Product) {
    setEditingId(product.id);
    setForm({
      title: product.title,
      description: product.description,
      category: product.category,
      price: product.price,
      discountPercentage: product.discountPercentage,
      stock: product.stock,
      thumbnail: product.thumbnail,
      images: product.images,
    });
    setIsFormOpen(true);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setError("");
    try {
      const productData = { ...form, images: [form.thumbnail] };
      if (editingId) await updateAdminProduct(editingId, productData);
      else await createAdminProduct(productData);
      setIsFormOpen(false);
      setForm(emptyProduct);
      setEditingId(null);
      await loadProducts();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Ürün kaydedilemedi.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(product: Product) {
    if (!window.confirm(`“${product.title}” ürününü silmek istiyor musun?`)) return;
    try {
      await deleteAdminProduct(product.id);
      setProducts((current) => current.filter((item) => item.id !== product.id));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Ürün silinemedi.");
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div><p className="text-sm text-stone-500">Katalog yönetimi</p><h1 className="mt-1 text-3xl font-bold">Ürünler</h1></div>
        <button onClick={startAdd} className="rounded-lg bg-stone-950 px-4 py-2.5 text-sm font-medium text-white">Yeni ürün ekle</button>
      </div>
      {error && <p role="alert" className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      {isFormOpen && (
        <form onSubmit={handleSubmit} className="mt-6 grid gap-4 rounded-xl border border-stone-200 bg-white p-5 sm:grid-cols-2">
          <h2 className="text-lg font-semibold sm:col-span-2">{editingId ? "Ürünü düzenle" : "Yeni ürün"}</h2>
          <label className="grid gap-1 text-sm">Ürün adı<input required minLength={2} value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} className="rounded-lg border border-stone-300 p-3" /></label>
          <label className="grid gap-1 text-sm">Kategori<input required value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} className="rounded-lg border border-stone-300 p-3" /></label>
          <label className="grid gap-1 text-sm">Fiyat<input required type="number" min="0" step="0.01" value={form.price} onChange={(event) => setForm({ ...form, price: Number(event.target.value) })} className="rounded-lg border border-stone-300 p-3" /></label>
          <label className="grid gap-1 text-sm">İndirim yüzdesi<input type="number" min="0" max="100" step="0.01" value={form.discountPercentage} onChange={(event) => setForm({ ...form, discountPercentage: Number(event.target.value) })} className="rounded-lg border border-stone-300 p-3" /></label>
          <label className="grid gap-1 text-sm">Stok<input required type="number" min="0" step="1" value={form.stock} onChange={(event) => setForm({ ...form, stock: Number(event.target.value) })} className="rounded-lg border border-stone-300 p-3" /></label>
          <label className="grid gap-1 text-sm">Görsel URL<input required type="url" value={form.thumbnail} onChange={(event) => setForm({ ...form, thumbnail: event.target.value })} className="rounded-lg border border-stone-300 p-3" /></label>
          <label className="grid gap-1 text-sm sm:col-span-2">Açıklama<textarea rows={3} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} className="rounded-lg border border-stone-300 p-3" /></label>
          <div className="flex gap-3 sm:col-span-2">
            <button disabled={isSaving} className="rounded-lg bg-stone-950 px-4 py-2.5 text-sm text-white disabled:opacity-60">{isSaving ? "Kaydediliyor..." : "Kaydet"}</button>
            <button type="button" onClick={() => setIsFormOpen(false)} className="rounded-lg border border-stone-300 px-4 py-2.5 text-sm">İptal</button>
          </div>
        </form>
      )}

      <div className="mt-6 overflow-hidden rounded-xl border border-stone-200 bg-white">
        {!hasLoaded ? <p className="p-6 text-stone-500">Ürünler yükleniyor...</p> : products.length === 0 ? <p className="p-6 text-stone-500">Henüz ürün yok.</p> : (
          <div className="overflow-x-auto"><table className="w-full min-w-[700px] text-left text-sm">
            <thead className="bg-stone-50 text-stone-500"><tr><th className="p-4">Ürün</th><th className="p-4">Kategori</th><th className="p-4">Fiyat</th><th className="p-4">Stok</th><th className="p-4">İşlem</th></tr></thead>
            <tbody>{products.map((product) => <tr key={product.id} className="border-t border-stone-100">
              <td className="p-4"><div className="flex items-center gap-3"><img src={product.thumbnail} alt="" className="h-12 w-12 rounded-lg object-contain" /><span className="max-w-xs truncate font-medium">{product.title}</span></div></td>
              <td className="p-4 capitalize">{product.category}</td>
              <td className="p-4">{product.price.toLocaleString("tr-TR", { style: "currency", currency: "USD" })}</td>
              <td className="p-4">{product.stock}</td>
              <td className="p-4"><div className="flex gap-3"><button onClick={() => startEdit(product)} className="underline">Düzenle</button><button onClick={() => handleDelete(product)} className="text-red-700 underline">Sil</button></div></td>
            </tr>)}</tbody>
          </table></div>
        )}
      </div>
    </div>
  );
}

export default ProductsPage;
