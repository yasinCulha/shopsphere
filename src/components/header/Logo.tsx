import { Link } from "react-router-dom";

interface LogoProps {
  className?: string;
}

function Logo({ className }: LogoProps) {
  return (
    <Link
      to="/"
      className={`font-serif font-bold text-gray-900 ${className ?? "ml-20"}`}
    >
      ShopSphere
    </Link>
  );
}

export default Logo;
