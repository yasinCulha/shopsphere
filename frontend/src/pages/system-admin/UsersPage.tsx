import { useEffect, useState } from "react";
import { getAdminUsers, type AdminUser } from "../../services/adminService";

function UsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getAdminUsers().then((result) => setUsers(result.users)).catch((requestError: unknown) => {
      setError(requestError instanceof Error ? requestError.message : "Kullanıcılar alınamadı.");
    });
  }, []);

  return <div><h1 className="text-3xl font-bold">Kullanıcılar</h1><p className="mt-2 text-stone-600">Mağazaya kayıt olan müşteriler.</p>
    {error && <p role="alert" className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    <div className="mt-6 overflow-x-auto rounded-xl border border-stone-200 bg-white"><table className="w-full min-w-[600px] text-left text-sm"><thead className="bg-stone-50 text-stone-500"><tr><th className="p-4">Ad soyad</th><th className="p-4">E-posta</th><th className="p-4">Kayıt tarihi</th></tr></thead><tbody>{users.map((user) => <tr key={user.id} className="border-t border-stone-100"><td className="p-4">{user.firstName} {user.lastName}</td><td className="p-4">{user.email}</td><td className="p-4">{new Date(user.createdAt).toLocaleDateString("tr-TR")}</td></tr>)}</tbody></table>{users.length === 0 && <p className="p-5 text-stone-500">Kayıtlı müşteri bulunamadı.</p>}</div>
  </div>;
}

export default UsersPage;
