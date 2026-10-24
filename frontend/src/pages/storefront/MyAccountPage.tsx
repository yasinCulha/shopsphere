import { useEffect, useState, type FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import type { AppDispatch, RootState } from "../../redux/store";
import { loginSuccess, logout } from "../../redux/slices/authSlice";
import { useToast } from "../../components/ui/ToastProvider";
import {
  deleteAddress,
  getAccountProfile,
  getAddresses,
  getOrders,
  saveAddress,
  updateAccountProfile,
  type Address,
  type AddressForm,
  type Order,
} from "../../services/accountService";
import { addressSchema, profileSchema } from "../../schemas/accountSchema";
import AccountMenu from "../../components/account/AccountMenu";
import { API_URL } from "../../services/apiConfig";

const emptyAddress: AddressForm = {
  title: "",
  recipientName: "",
  phone: "",
  city: "",
  district: "",
  postalCode: "",
  addressLine: "",
  isDefault: false,
};

const orderStatus: Record<string, string> = {
  pending: "Beklemede",
  paid: "Ödeme alındı",
  preparing: "Hazırlanıyor",
  shipped: "Kargoya verildi",
  delivered: "Teslim edildi",
  cancelled: "İptal edildi",
};

function MyAccountPage() {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const { showToast } = useToast();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [profileForm, setProfileForm] = useState({ firstName: "", lastName: "" });
  const [addressForm, setAddressForm] = useState<AddressForm>(emptyAddress);
  const [editingAddressId, setEditingAddressId] = useState<number | null>(null);
  const [loadedToken, setLoadedToken] = useState<string | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);

  useEffect(() => {
    if (!accessToken) {
      return;
    }

    let isActive = true;
    async function loadAccount() {
      try {
        const [profileData, addressData, orderData] = await Promise.all([
          getAccountProfile(accessToken!),
          getAddresses(accessToken!),
          getOrders(accessToken!),
        ]);
        if (!isActive) return;
        dispatch(loginSuccess(profileData.user));
        setProfileForm({ firstName: profileData.user.firstName, lastName: profileData.user.lastName });
        setAddresses(addressData.addresses);
        setOrders(orderData.orders);
      } catch (error) {
        if (isActive) showToast({
          title: "Hesap bilgileri alınamadı",
          message: error instanceof Error ? error.message : "Bir hata oluştu.",
          kind: "error",
        });
      } finally {
        if (isActive) setLoadedToken(accessToken!);
      }
    }

    loadAccount();
    return () => { isActive = false; };
  }, [accessToken, dispatch, showToast]);

  async function handleLogout() {
    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch {
      console.log("Sunucuya ulaşılamadı; yerel oturum kapatılıyor.");
    }
    dispatch(logout());
    navigate("/login");
  }

  async function handleProfileSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!accessToken) return;
    const validation = profileSchema.safeParse(profileForm);
    if (!validation.success) {
      showToast({ title: "Bilgileri kontrol et", message: validation.error.issues[0].message, kind: "error" });
      return;
    }
    setSavingProfile(true);
    try {
      const result = await updateAccountProfile(accessToken, validation.data);
      dispatch(loginSuccess(result.user));
      showToast({ title: "Profil güncellendi", message: "Ad ve soyad bilgilerin kaydedildi." });
    } catch (error) {
      showToast({ title: "Profil güncellenemedi", message: error instanceof Error ? error.message : "Bir hata oluştu.", kind: "error" });
    } finally {
      setSavingProfile(false);
    }
  }

  function startAddressEdit(address: Address) {
    setEditingAddressId(address.id);
    setAddressForm({
      title: address.title,
      recipientName: address.recipientName,
      phone: address.phone,
      city: address.city,
      district: address.district,
      postalCode: address.postalCode,
      addressLine: address.addressLine,
      isDefault: address.isDefault,
    });
  }

  function resetAddressForm() {
    setEditingAddressId(null);
    setAddressForm(emptyAddress);
  }

  async function handleAddressSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!accessToken) return;
    const validation = addressSchema.safeParse(addressForm);
    if (!validation.success) {
      showToast({ title: "Adres bilgilerini kontrol et", message: validation.error.issues[0].message, kind: "error" });
      return;
    }
    setSavingAddress(true);
    try {
      const result = await saveAddress(accessToken, validation.data, editingAddressId ?? undefined);
      setAddresses((current) => {
        const next = editingAddressId
          ? current.map((address) => address.id === result.address.id ? result.address : address)
          : [result.address, ...current];
        return result.address.isDefault
          ? next.map((address) => ({ ...address, isDefault: address.id === result.address.id }))
          : next;
      });
      showToast({ title: editingAddressId ? "Adres güncellendi" : "Adres eklendi", message: result.address.title });
      resetAddressForm();
    } catch (error) {
      showToast({ title: "Adres kaydedilemedi", message: error instanceof Error ? error.message : "Bir hata oluştu.", kind: "error" });
    } finally {
      setSavingAddress(false);
    }
  }

  async function handleAddressDelete(id: number) {
    if (!accessToken) return;
    try {
      await deleteAddress(accessToken, id);
      setAddresses((current) => current.filter((address) => address.id !== id));
      if (editingAddressId === id) resetAddressForm();
      showToast({ title: "Adres silindi", message: "Adresin hesabından kaldırıldı." });
    } catch (error) {
      showToast({ title: "Adres silinemedi", message: error instanceof Error ? error.message : "Bir hata oluştu.", kind: "error" });
    }
  }

  if (!user) {
    return (
      <div className="p-6">
        <p>Hesabını görmek için giriş yapmalısın.</p>
        <button
          onClick={() => navigate("/login")}
          className="mt-4 rounded-lg bg-black px-5 py-3 text-white"
        >
          Giriş Yap
        </button>
      </div>
    );
  }

  if (accessToken && loadedToken !== accessToken) {
    return <div className="bg-cream px-4 py-16 text-center text-stone-600">Hesap bilgileri yükleniyor...</div>;
  }

  return (
    <div className="min-h-screen bg-cream px-4 py-10 text-black sm:px-6 lg:py-14">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm text-stone-500">ShopSphere hesabın</p>
            <h1 className="mt-1 text-3xl font-bold">Hesabım</h1>
          </div>
          <button onClick={handleLogout} className="rounded-lg border border-stone-300 px-4 py-2 text-sm hover:bg-white">
            Çıkış Yap
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="h-fit rounded-2xl border border-[#E5DFD5] bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EFE9DF] text-lg font-semibold">
                {user.firstName.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="truncate font-semibold">{user.firstName} {user.lastName}</p>
                <p className="truncate text-sm text-stone-500">{user.email}</p>
              </div>
            </div>
            <AccountMenu addressCount={addresses.length} orderCount={orders.length} />
          </aside>

          <div className="grid gap-6">
            <section id="profile" className="rounded-2xl border border-[#E5DFD5] bg-white p-5 shadow-sm sm:p-7">
              <h2 className="text-xl font-semibold">Profil bilgilerim</h2>
              <p className="mt-1 text-sm text-stone-500">E-posta adresin giriş bilgisi olarak kullanılır ve buradan değiştirilemez.</p>
              <form onSubmit={handleProfileSubmit} className="mt-5 grid gap-4 sm:grid-cols-2">
                <label className="grid gap-1.5 text-sm">Ad
                  <input required minLength={2} maxLength={50} value={profileForm.firstName} onChange={(event) => setProfileForm({ ...profileForm, firstName: event.target.value })} className="rounded-lg border border-stone-300 p-3" />
                </label>
                <label className="grid gap-1.5 text-sm">Soyad
                  <input required minLength={2} maxLength={50} value={profileForm.lastName} onChange={(event) => setProfileForm({ ...profileForm, lastName: event.target.value })} className="rounded-lg border border-stone-300 p-3" />
                </label>
                <label className="grid gap-1.5 text-sm sm:col-span-2">E-posta
                  <input disabled value={user.email} className="rounded-lg border border-stone-200 bg-stone-100 p-3 text-stone-500" />
                </label>
                <button disabled={savingProfile} className="rounded-lg bg-black px-5 py-3 text-sm font-medium text-white disabled:opacity-60 sm:col-span-2 sm:w-fit">
                  {savingProfile ? "Kaydediliyor..." : "Profili kaydet"}
                </button>
              </form>
            </section>

            <section id="addresses" className="rounded-2xl border border-[#E5DFD5] bg-white p-5 shadow-sm sm:p-7">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div><h2 className="text-xl font-semibold">Adreslerim</h2><p className="mt-1 text-sm text-stone-500">Teslimat adreslerini hesabında sakla.</p></div>
              </div>

              {addresses.length === 0 && <p className="mt-5 rounded-lg bg-[#F7F4EE] p-4 text-sm text-stone-600">Henüz kayıtlı adresin yok.</p>}
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {addresses.map((address) => (
                  <article key={address.id} className="rounded-xl border border-stone-200 p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div><h3 className="font-semibold">{address.title}</h3>{address.isDefault && <span className="mt-1 inline-block rounded-full bg-[#EFE9DF] px-2 py-0.5 text-xs">Varsayılan</span>}</div>
                      <div className="flex gap-2 text-sm"><button onClick={() => startAddressEdit(address)} className="underline">Düzenle</button><button onClick={() => handleAddressDelete(address.id)} className="text-red-700 underline">Sil</button></div>
                    </div>
                    <p className="mt-3 text-sm">{address.recipientName} · {address.phone}</p>
                    <p className="mt-1 text-sm text-stone-600">{address.addressLine}, {address.district}/{address.city} {address.postalCode}</p>
                  </article>
                ))}
              </div>

              <form onSubmit={handleAddressSubmit} className="mt-6 grid gap-3 border-t border-stone-200 pt-5 sm:grid-cols-2">
                <h3 className="font-semibold sm:col-span-2">{editingAddressId ? "Adresi düzenle" : "Yeni adres ekle"}</h3>
                {([
                  ["title", "Adres başlığı (Ev, İş gibi)"], ["recipientName", "Alıcı adı soyadı"],
                  ["phone", "Telefon"], ["city", "Şehir"], ["district", "İlçe"], ["postalCode", "Posta kodu"],
                ] as const).map(([key, label]) => (
                  <label key={key} className="grid gap-1 text-sm">{label}
                  <input required={key !== "postalCode"} maxLength={key === "phone" ? 11 : key === "postalCode" ? 20 : undefined} inputMode={key === "phone" ? "numeric" : undefined} type={key === "phone" ? "tel" : "text"} placeholder={key === "phone" ? "05XXXXXXXXX" : undefined} value={addressForm[key]} onChange={(event) => setAddressForm({ ...addressForm, [key]: key === "phone" ? event.target.value.replace(/\D/g, "").slice(0, 11) : event.target.value })} className="rounded-lg border border-stone-300 p-3" />
                  </label>
                ))}
                <label className="grid gap-1 text-sm sm:col-span-2">Açık adres
                  <textarea required minLength={8} rows={3} value={addressForm.addressLine} onChange={(event) => setAddressForm({ ...addressForm, addressLine: event.target.value })} className="rounded-lg border border-stone-300 p-3" />
                </label>
                <label className="flex items-center gap-2 text-sm sm:col-span-2"><input type="checkbox" checked={addressForm.isDefault} onChange={(event) => setAddressForm({ ...addressForm, isDefault: event.target.checked })} /> Varsayılan adres yap</label>
                <div className="flex gap-3 sm:col-span-2">
                  <button disabled={savingAddress} className="rounded-lg bg-black px-5 py-3 text-sm text-white disabled:opacity-60">{savingAddress ? "Kaydediliyor..." : editingAddressId ? "Adresi kaydet" : "Adres ekle"}</button>
                  {editingAddressId && <button type="button" onClick={resetAddressForm} className="rounded-lg border border-stone-300 px-5 py-3 text-sm">Vazgeç</button>}
                </div>
              </form>
            </section>

            <section id="orders" className="rounded-2xl border border-[#E5DFD5] bg-white p-5 shadow-sm sm:p-7">
              <div className="flex items-center justify-between gap-3"><div><h2 className="text-xl font-semibold">Siparişlerim</h2><p className="mt-1 text-sm text-stone-500">Geçmiş siparişlerini buradan takip edebilirsin.</p></div><span className="text-sm text-stone-500">{orders.length} sipariş</span></div>
              {orders.length === 0 ? (
                <div className="mt-5 rounded-xl bg-[#F7F4EE] p-6 text-center">
                  <p className="font-medium">Henüz siparişin yok</p><p className="mt-1 text-sm text-stone-500">Beğendiğin ürünlere göz atıp alışverişe başlayabilirsin.</p>
                  <Link to="/products" className="mt-4 inline-flex rounded-lg bg-black px-4 py-2 text-sm text-white">Ürünleri keşfet</Link>
                </div>
              ) : (
                <div className="mt-5 grid gap-3">{orders.map((order) => <article key={order.id} className="rounded-xl border border-stone-200 p-4"><div className="flex flex-wrap justify-between gap-2"><p className="font-semibold">Sipariş #{order.id}</p><span className="rounded-full bg-[#EFE9DF] px-3 py-1 text-xs">{orderStatus[order.status] ?? order.status}</span></div><p className="mt-2 text-sm text-stone-500">{new Date(order.createdAt).toLocaleDateString("tr-TR")}</p><p className="mt-2 text-sm">{order.items.map((item) => `${item.title} × ${item.quantity}`).join(", ")}</p><p className="mt-2 font-semibold">{order.total.toLocaleString("tr-TR", { style: "currency", currency: "USD" })}</p></article>)}</div>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyAccountPage;
