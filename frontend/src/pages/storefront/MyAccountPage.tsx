
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { AppDispatch, RootState } from "../../redux/store";
import { logout } from "../../redux/slices/authSlice";

function MyAccountPage() {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

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

  return (
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="mb-6 text-3xl font-bold">Hesabım</h1>

      <div className="flex items-center gap-4 rounded-xl border p-5">
        <img
          src={user.image}
          alt={user.firstName}
          className="h-20 w-20 rounded-full"
        />

        <div>
          <h2 className="text-xl font-semibold">
            {user.firstName} {user.lastName}
          </h2>
          <p className="text-gray-500">{user.email}</p>
        </div>
      </div>

      <button
        onClick={() => {
          dispatch(logout());
          navigate("/login");
        }}
        className="mt-6 rounded-lg border px-5 py-3"
      >
        Çıkış Yap
      </button>
    </div>
  );
}

export default MyAccountPage;
