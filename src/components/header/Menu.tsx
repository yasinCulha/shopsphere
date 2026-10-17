import { Link } from "react-router-dom";

const categories = [
  { label: "Kadın", path: "/women" },
  { label: "Erkek", path: "/man" },
  { label: "Aksesuarlar", path: "/accessories" },
  { label: "Yeni Ürünler", path: "/new-products" },
  { label: "İndirimler", path: "/sales" },
];

interface MenuProps {
  className?: string;
  onNavigate?: () => void;
}

function Menu({
  className = "flex items-center justify-center font-medium",
  onNavigate,
}: MenuProps) {
  return (
    <nav className={className} aria-label="Kategoriler">
      {categories.map((category) => (
        <Link
          key={category.path}
          to={category.path}
          onClick={onNavigate}
          className="transition hover:text-black hover:opacity-75"
        >
          {category.label}
        </Link>
      ))}
    </nav>
  );
}

export default Menu;
