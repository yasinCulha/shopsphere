import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LuEye, LuEyeClosed } from "react-icons/lu";
import type { AppDispatch } from "../../redux/store";
import { loginSuccess, setAccessToken } from "../../redux/slices/authSlice";
import {
  registerSchema,
  type RegisterFormData,
} from "../../schemas/registerSchema";
import type { User } from "../../data/testUser";

type AuthUser = Omit<User, "password">;

type RegisterResponse = {
  message: string;
  accessToken: string;
  user: AuthUser;
};

type RegisterErrorResponse = {
  message?: string;
  errors?: Partial<Record<keyof RegisterFormData, string[]>>;
};

function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit(formData: RegisterFormData) {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(formData),
        },
      );

      const data = (await response.json()) as
        | RegisterResponse
        | RegisterErrorResponse;

      if (!response.ok) {
        const errorData = data as RegisterErrorResponse;

        if (errorData.errors) {
          for (const field of Object.keys(errorData.errors) as Array<
            keyof RegisterFormData
          >) {
            const message = errorData.errors[field]?.[0];

            if (message) {
              setError(field, { message });
            }
          }
        } else {
          setError("root.server", {
            message: errorData.message ?? "Kayıt işlemi başarısız.",
          });
        }

        return;
      }

      const userData = data as RegisterResponse;

      // API kullanıcının şifresini döndürmez; sadece hesap bilgilerini alırız.
      dispatch(loginSuccess(userData.user));
      dispatch(setAccessToken(userData.accessToken));
      navigate("/my-account");
    } catch {
      setError("root.server", {
        message: "Sunucuya bağlanılamadı. Lütfen tekrar dene.",
      });
    }
  }

  return (
    <div className="mx-auto max-w-md p-6">
      <h1 className="mb-6 text-3xl font-bold">Kayıt Ol</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div className="flex gap-2">
          <div className="min-w-0 flex-1">
            <input
              type="text"
              placeholder="Adınız"
              {...register("firstName")}
              className="w-full rounded-lg border p-3"
              autoComplete="given-name"
            />
            {errors.firstName && (
              <p className="mt-1 text-sm text-red-600">
                {errors.firstName.message}
              </p>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <input
              type="text"
              placeholder="Soyadınız"
              {...register("lastName")}
              className="w-full rounded-lg border p-3"
              autoComplete="family-name"
            />
            {errors.lastName && (
              <p className="mt-1 text-sm text-red-600">
                {errors.lastName.message}
              </p>
            )}
          </div>
        </div>

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
              autoComplete="new-password"
            />

            <button
              type="button"
              onClick={() => setShowPassword((previous) => !previous)}
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-800"
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

        {errors.root?.server && (
          <p className="text-sm text-red-600">{errors.root.server.message}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full cursor-pointer rounded-lg bg-black p-3 text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Hesap oluşturuluyor..." : "Kayıt Ol"}
        </button>
      </form>

      <div className="mt-4 flex flex-wrap justify-between gap-3">
        <Link to="/" className="underline">
          Alışverişe dön
        </Link>

        <div className="flex gap-1">
          <span>Hesabın var mı?</span>
          <Link to="/login" className="text-gray-500 hover:underline">
            Giriş Yap
          </Link>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
