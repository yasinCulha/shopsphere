import { Link } from "react-router-dom";
import { LuHeart } from "react-icons/lu";
import type { Product } from "../../types/product";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../redux/store";
import { toggleFavorite } from "../../redux/slices/productSlice";
import { addFavorite, removeFavorite } from "../../services/favoritesService";
import { useToast } from "../ui/ToastProvider";

function ProductCard({
  product,
  layout = "carousel",
}: {
  product: Product;
  layout?: "carousel" | "grid";
}) {
  const dispatch = useDispatch<AppDispatch>();
  const { showToast } = useToast();
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const isFavorite = useSelector((state: RootState) =>
    state.products.favorites.some((item) => item.id === product.id),
  );

  async function handleFavoriteClick() {
    if (!accessToken) {
      showToast({
        title: "Giriş yapmalısın",
        message: "Favorilerini hesabında saklamak için giriş yap.",
        kind: "info",
        action: { label: "Giriş yap", to: "/login" },
      });
      return;
    }
    try {
      if (isFavorite) {
        await removeFavorite(accessToken, product.id);
      } else {
        await addFavorite(accessToken, product.id);
      }
      dispatch(toggleFavorite(product));
      showToast({
        title: isFavorite ? "Favorilerden çıkarıldı" : "Favorilere eklendi",
        message: product.title,
      });
    } catch (error) {
      showToast({
        title: "Favori işlemi başarısız",
        message: error instanceof Error ? error.message : "Bir hata oluştu.",
        kind: "error",
      });
    }
  }

  return (
    <article
      className={`${layout === "grid" ? "w-full" : "w-[78%] flex-none sm:w-[42%]"} overflow-hidden rounded-xl border border-stone-200/50 bg-white shadow-sm transition hover:shadow-md md:w-auto md:snap-align-none`}
    >
      <button
        onClick={handleFavoriteClick}
        className="mt-3 mr-3 ml-auto flex justify-end items-center cursor-pointer"
        aria-label={isFavorite ? "Favorilerden çıkar" : "Favorilere ekle"}
      >
        <LuHeart
          size={21}
          className={
            isFavorite
              ? "shrink-0 fill-red-600 text-red-600"
              : "shrink-0 fill-white text-black"
          }
          aria-hidden="true"
        />
      </button>

      <Link to={`/products/${product.id}`}>
        <div className="flex h-48 w-full items-center justify-center p-4 sm:h-56 lg:h-64">
          <img
            src={product.thumbnail}
            alt={product.title}
            className="h-full w-full object-contain transition-transform duration-300 hover:scale-105"
          />
        </div>

        <div className="p-3 pt-0 sm:p-4 sm:pt-0">
          <p className="mb-1 text-xs capitalize text-gray-400">
            {product.category}
          </p>
          <h3 className="min-h-10 line-clamp-2 text-sm font-semibold text-gray-900">
            {product.title}
          </h3>
          <p className="mt-2 text-base font-bold text-gray-900">
            {product.price.toLocaleString("tr-TR", {
              style: "currency",
              currency: "USD",
            })}
          </p>
        </div>
      </Link>
    </article>
  );
}

export default ProductCard;
