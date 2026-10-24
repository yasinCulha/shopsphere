import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import ProductCard from "../../components/common/ProductCard";

function FavoritesPage() {
  const favorites = useSelector((state: RootState) => state.products.favorites);

  return (
    <section className="mx-auto w-full max-w-[1750px] px-4 py-10 sm:px-8 sm:py-12">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm text-stone-500">Kaydettiklerin</p>
          <h1 className="mt-1 text-2xl font-semibold text-stone-900 sm:text-3xl">
            Favorilerim
          </h1>
        </div>
        <span className="text-sm text-stone-500">
          {favorites.length} ürün
        </span>
      </div>

      {favorites.length === 0 ? (
        <div className="rounded-2xl border border-stone-200 bg-white px-6 py-14 text-center shadow-sm">
          <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-[#F7F4EE] text-2xl text-stone-500">
            ♡
          </div>
          <h2 className="mt-5 text-lg font-semibold text-stone-900">
            Henüz favori ürünün yok
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-stone-500">
            Beğendiğin ürünleri kalp simgesine dokunarak burada saklayabilirsin.
          </p>
          <Link
            to="/products"
            className="mt-6 inline-flex rounded-lg bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-stone-800"
          >
            Ürünleri keşfet
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-4 lg:grid-cols-6">
          {favorites.map((product) => (
            <ProductCard key={product.id} product={product} layout="grid" />
          ))}
        </div>
      )}
    </section>
  );
}

export default FavoritesPage;
