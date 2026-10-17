import { FaRegUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";

interface MyAccountProps {
  className?: string;
}

function MyAccount({ className }: MyAccountProps) {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <Link
      to={user ? "/my-account" : "/login"}
      className={`flex items-center gap-1.5 ${
        className ?? "cursor-pointer font-medium"
      }`}
    >
      <FaRegUser size={18} className="shrink-0" aria-hidden="true" />

      <span className="hidden text-xs font-medium lg:inline">
        {user ? "Hesabım" : "Giriş Yap"}
      </span>
    </Link>
  );
}

export default MyAccount;
