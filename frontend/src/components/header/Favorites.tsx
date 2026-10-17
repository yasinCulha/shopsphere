import { CiHeart } from "react-icons/ci";
import { Link } from "react-router-dom";

interface FavoritesProps {
  className?: string;
  onNavigate?: () => void;
}

function Favorites({ className, onNavigate }: FavoritesProps) {
  return (
    <Link
      to="/favorites"
      onClick={onNavigate}
      className={className ?? "mr-4 flex cursor-pointer items-center font-medium"}
    >
      <CiHeart size={21} className="shrink-0" aria-hidden="true" />
      <span className="text-sm">Favoriler</span>
    </Link>
  );
}

export default Favorites;
