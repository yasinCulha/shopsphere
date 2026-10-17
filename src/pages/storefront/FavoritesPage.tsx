import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import ProductCard from "../../components/common/ProductCard";

function FavoritesPage() {
  const favorites = useSelector((state: RootState) => state.products.favorites);
  return (
    <div className="mx-auto w-full max-w-[1750px] px-4 py-12 sm:px-8">
      {favorites.length === 0 ? (
        <p>urun bulunamadi</p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 pb-4 sm:gap-5 md:grid-cols-4 md:pb-0 lg:grid-cols-6">
          {favorites.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default FavoritesPage;
