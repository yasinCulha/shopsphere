import { HiOutlineShoppingBag } from "react-icons/hi2";
import { Link } from "react-router-dom";

interface BasketProps {
  className?: string;
}

function Basket({ className }: BasketProps) {
  return (
    <Link
      to="/shopping-cart"
      className={`flex items-center gap-1.5 ${className ?? "mr-4 font-medium"}`}
    >
      <HiOutlineShoppingBag size={21} className="shrink-0" aria-hidden="true" />
      <span className="hidden text-xs font-medium lg:inline">Sepet</span>
    </Link>
  );
}

export default Basket;
