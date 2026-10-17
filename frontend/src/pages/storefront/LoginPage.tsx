import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import type { AppDispatch } from "../../redux/store";
import { loginSuccess } from "../../redux/slices/authSlice";
import { testUser } from "../../data/testUser";

function LoginPage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (
      email.trim().toLowerCase() !== testUser.email ||
      password !== testUser.password
    ) {
      setError("E-posta veya şifre hatalı.");
      return;
    }

    const { password: _, ...user } = testUser;

    dispatch(loginSuccess(user));
    navigate("/my-account");
  }

  return (
    <div className="mx-auto max-w-md p-6">
      <h1 className="mb-6 text-3xl font-bold">Giriş Yap</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="E-posta adresi"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border p-3"
          required
        />

        <input
          type="password"
          placeholder="Şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border p-3"
          required
        />

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          className="w-full rounded-lg bg-black p-3 text-white"
        >
          Giriş Yap
        </button>
      </form>

      <p className="mt-4 text-sm text-gray-500">
        Demo hesabı: test@shopsphere.com
      </p>

      <Link to="/" className="mt-4 inline-block underline">
        Alışverişe dön
      </Link>
    </div>
  );
}

export default LoginPage;
