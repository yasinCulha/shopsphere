import { Link } from "react-router-dom";

type AccountMenuProps = {
  addressCount: number;
  orderCount: number;
};

const sectionLinkClass =
  "rounded-lg px-3 py-2 text-sm transition hover:bg-[#F7F4EE]";

function AccountMenu({ addressCount, orderCount }: AccountMenuProps) {
  return (
    <nav aria-label="Hesap menüsü" className="mt-6 grid gap-2">
      <div className="mt-2 border-t border-[#E5DFD5] pt-4">
        <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wide text-stone-500">
          Hesap menüsü
        </p>
        <div className="grid gap-2">
          <a href="#profile" className={`${sectionLinkClass} bg-[#F7F4EE]`}>
            Profilim
          </a>
          <a href="#addresses" className={sectionLinkClass}>
            Adreslerim ({addressCount})
          </a>
          <a href="#orders" className={sectionLinkClass}>
            Siparişlerim ({orderCount})
          </a>
          <Link to="/favorites" className={sectionLinkClass}>
            Favorilerim
          </Link>
          <Link to="/cupboard" className={sectionLinkClass}>
            Dolabim
          </Link>
          <Link to="/shopping-cart" className={sectionLinkClass}>
            Sepetim
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default AccountMenu;
