import { useState } from "react";
import { HiOutlineBars3, HiXMark } from "react-icons/hi2";
import Basket from "./Cart";
import Favorites from "./Favorites";
import Logo from "./Logo";
import Menu from "./Menu";
import MyAccount from "./MyAccount";
import Search, { SearchIcon } from "./Search";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[#E5DFD5] bg-[#F7F4EE]">
      <div className="mx-auto flex h-16 max-w-[1750px] items-center justify-between px-4 sm:h-20 sm:px-8">
        <div className="flex shrink-0 items-center gap-2.5 sm:gap-4">
          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            className="p-1 text-gray-900 focus:outline-none md:hidden"
            aria-label={isMenuOpen ? "Menüyü kapat" : "Menüyü aç"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
          >
            {isMenuOpen ? (
              <HiXMark className="size-6 sm:size-7" />
            ) : (
              <HiOutlineBars3 className="size-6 sm:size-7" />
            )}
          </button>
          <Logo className="ml-0 text-xl tracking-tight sm:text-2xl" />
        </div>

        <Menu className="hidden items-center gap-8 text-sm text-gray-800 md:flex" />

        <div className="flex shrink-0 items-center gap-2 pr-2 text-gray-800 sm:gap-5 sm:pr-0">
          <Search />
          <button
            type="button"
            onClick={() => setIsSearchOpen((open) => !open)}
            className="p-1.5 text-gray-800 transition hover:text-black focus:outline-none md:hidden"
            aria-label={isSearchOpen ? "Aramayı kapat" : "Arama alanını aç"}
            aria-expanded={isSearchOpen}
            aria-controls="mobile-search"
          >
            <SearchIcon />
          </button>

          <Favorites className="hidden items-center gap-1.5 transition hover:text-black md:flex" />
          <Basket className="p-1.5 transition hover:text-black" />
          <MyAccount className="p-1.5 transition hover:text-black" />
        </div>
      </div>

      {isSearchOpen && (
        <div
          id="mobile-search"
          className="border-t border-[#E5DFD5] bg-[#F7F4EE] px-4 py-2.5 md:hidden"
        >
          <Search mobile />
        </div>
      )}

      <div
        id="mobile-navigation"
        aria-hidden={!isMenuOpen}
        className={`overflow-hidden border-t border-[#E5DFD5] bg-[#F7F4EE] transition-all duration-300 ease-in-out md:hidden ${
          isMenuOpen
            ? "max-h-96 py-4 opacity-100"
            : "pointer-events-none max-h-0 border-none py-0 opacity-0"
        }`}
      >
        <div className="flex flex-col divide-y divide-stone-200/60 px-6">
          <Menu
            onNavigate={closeMenu}
            className="flex flex-col space-y-3 pb-3 text-base font-medium text-gray-900"
          />
          <div className="pt-3">
            <Favorites
              onNavigate={closeMenu}
              className="flex items-center gap-2.5 text-base font-medium text-gray-900 transition hover:text-black"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
