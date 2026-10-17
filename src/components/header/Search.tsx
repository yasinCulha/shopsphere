import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { CiSearch } from "react-icons/ci";
import type { AppDispatch, RootState } from "../../redux/store";
import {
  clearSearchResults,
  searchProducts,
} from "../../redux/slices/productSlice";

interface SearchProps {
  mobile?: boolean;
}

export function SearchIcon() {
  return <CiSearch className="size-5" aria-hidden="true" />;
}

function Search({ mobile = false }: SearchProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { searchResults, searchLoading, searchError } = useSelector(
    (state: RootState) => state.products,
  );
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const normalizedQuery = query.trim();
    if (!normalizedQuery) {
      dispatch(clearSearchResults());
      return;
    }

    let abortRequest: (() => void) | undefined;
    const timeoutId = window.setTimeout(() => {
      abortRequest = dispatch(searchProducts(normalizedQuery)).abort;
    }, 200);

    return () => {
      window.clearTimeout(timeoutId);
      abortRequest?.();
    };
  }, [dispatch, query]);

  const searchClassName = mobile
    ? "w-full rounded-full border border-stone-300 bg-white py-2 pl-9 pr-4 text-xs outline-none focus:border-[#B0A493]"
    : "w-40 rounded-full border border-stone-200 bg-white/70 py-1.5 pl-9 pr-4 text-xs outline-none transition-all focus:w-56 focus:border-[#B0A493] focus:bg-white";

  return (
    <div className={mobile ? "relative" : "relative hidden md:block"}>
      <CiSearch
        className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400"
        aria-hidden="true"
      />
      <input
        type="search"
        aria-label="Ürün, kategori veya marka ara"
        aria-autocomplete="list"
        aria-expanded={isOpen && query.trim().length > 0}
        aria-controls="product-search-suggestions"
        placeholder={mobile ? "Ürün, kategori veya marka ara..." : "Ara..."}
        autoFocus={mobile}
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          setIsOpen(true);
          dispatch(clearSearchResults());
        }}
        onFocus={() => setIsOpen(true)}
        onKeyDown={(event) => {
          if (event.key === "Escape") setIsOpen(false);
        }}
        className={searchClassName}
      />

      {isOpen && query.trim() && (
        <div
          id="product-search-suggestions"
          role="listbox"
          aria-label="Ürün önerileri"
          className="absolute left-0 right-0 top-full z-[60] mt-2 max-h-96 min-w-72 overflow-y-auto rounded-xl border border-[#E5DFD5] bg-white p-2 shadow-lg md:min-w-80"
        >
          {searchLoading ? (
            <p className="px-2 py-3 text-sm text-stone-500">
              Ürünler aranıyor...
            </p>
          ) : searchError ? (
            <p role="alert" className="px-2 py-3 text-sm text-red-700">
              {searchError}
            </p>
          ) : searchResults.length > 0 ? (
            searchResults.slice(0, 6).map((product) => (
              <Link
                key={product.id}
                role="option"
                aria-selected="false"
                to={`/products/${product.id}`}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 rounded-lg p-2 text-left transition-colors hover:bg-[#F7F4EE] focus:bg-[#F7F4EE] focus:outline-none"
              >
                <img
                  src={product.thumbnail}
                  alt=""
                  className="size-11 shrink-0 object-contain"
                />
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium text-stone-900">
                    {product.title}
                  </span>
                  <span className="block text-xs capitalize text-stone-500">
                    {product.category}
                  </span>
                </span>
              </Link>
            ))
          ) : (
            <p className="px-2 py-3 text-sm text-stone-500">
              Bu aramayla eşleşen ürün bulunamadı.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default Search;
