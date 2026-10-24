import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { saveAdminToken } from "../../services/adminService";

function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/admin/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.message ?? "Giriş yapılamadı.");
        return;
      }
      saveAdminToken(data.accessToken);
      navigate("/admin", { replace: true });
    } catch {
      setError("Sunucuya bağlanılamadı. Backend çalışıyor mu kontrol et.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-stone-100 px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-stone-200 bg-white p-7 shadow-sm">
        <p className="text-sm font-medium text-stone-500">ShopSphere yönetim paneli</p>
        <h1 className="mt-2 text-2xl font-bold">Admin girişi</h1>
        <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
          <label className="grid gap-1.5 text-sm">E-posta
            <input type="email" autoComplete="username" required value={email} onChange={(event) => setEmail(event.target.value)} className="rounded-lg border border-stone-300 p-3" />
          </label>
          <label className="grid gap-1.5 text-sm">Şifre
            <input type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} className="rounded-lg border border-stone-300 p-3" />
          </label>
          {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
          <button disabled={isSubmitting} className="rounded-lg bg-stone-950 p-3 font-medium text-white disabled:opacity-60">
            {isSubmitting ? "Giriş yapılıyor..." : "Giriş yap"}
          </button>
        </form>
        <Link to="/" className="mt-5 inline-block text-sm text-stone-600 underline">Mağazaya dön</Link>
      </div>
    </main>
  );
}

export default AdminLoginPage;
