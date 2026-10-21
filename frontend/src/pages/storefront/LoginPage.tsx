import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LuEye, LuEyeClosed } from "react-icons/lu";
import type { AppDispatch } from "../../redux/store";
import { loginSuccess, setAccessToken } from "../../redux/slices/authSlice";
import { loginSchema, type LoginFormData } from "../../schemas/loginSchema";
import type { User } from "../../data/testUser";

type AuthUser = Omit<User, "password">;

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(formData: LoginFormData) {
    setServerError("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/auth/login`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setServerError(data.message || "Giriş yapılamadı.");
        return;
      }

      const user: AuthUser = data.user;

      dispatch(loginSuccess(user));
      dispatch(setAccessToken(data.accessToken));

      navigate("/my-account");
    } catch {
      setServerError("Sunucuya bağlanılamadı. Lütfen tekrar dene.");
    }
  }

  return (
    <div className="mx-auto max-w-md p-6">
      <h1 className="mb-6 text-3xl font-bold">Giriş Yap</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div>
          <input
            type="email"
            placeholder="E-posta adresi"
            {...register("email")}
            className="w-full rounded-lg border p-3"
            autoComplete="email"
          />

          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Şifre"
              {...register("password")}
              className="w-full rounded-lg border p-3 pr-12"
              autoComplete="current-password"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
              aria-label={showPassword ? "Şifreyi gizle" : "Şifreyi göster"}
            >
              {showPassword ? <LuEye size={20} /> : <LuEyeClosed size={20} />}
            </button>
          </div>

          {errors.password && (
            <p className="mt-1 text-sm text-red-600">
              {errors.password.message}
            </p>
          )}
        </div>

        {serverError && <p className="text-sm text-red-600">{serverError}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-black p-3 text-white disabled:opacity-60"
        >
          {isSubmitting ? "Giriş yapılıyor..." : "Giriş Yap"}
        </button>
      </form>

      <div className="mt-4 flex justify-between">
        <Link to="/" className="underline">
          Alışverişe dön
        </Link>

        <div className="flex gap-1">
          <span>Hesabın yoksa:</span>

          <Link to="/register" className="text-gray-500 hover:underline">
            Kayıt Ol
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
