import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../redux/store";
import { getProductsByCategories } from "../../redux/slices/productSlice";
import ProductCard from "../../components/common/ProductCard";

export default function ProductsPage() {
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();

  const { products, loading, error } = useSelector(
    (state: RootState) => state.products,
  );

  const categoryMap: Record<string, string[]> = {
    "/man": ["mens-shirts", "mens-shoes", "mens-watches"],
    "/women": [
      "womens-dresses",
      "womens-shoes",
      "womens-bags",
      "womens-jewellery",
    ],
    "/accessories": [
      "mens-watches",
      "womens-watches",
      "womens-jewellery",
      "sunglasses",
    ],
  };
  useEffect(() => {
    const category = categoryMap[location.pathname];

    if (category) {
      dispatch(getProductsByCategories(category));
    }
  }, [location.pathname, dispatch]);

  if (loading) return <p>Ürünler yükleniyor...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <section className="mx-auto w-full max-w-[1750px] px-4 py-12 sm:px-8">
        {error ? (
          <p role="alert" className="mt-6 text-red-700">
            {error}
          </p>
        ) : (
          <div
            className="mt-8 grid grid-cols-2 gap-4 pb-4 sm:gap-5 md:grid-cols-4 md:pb-0 lg:grid-cols-6"
          >
            {products.map((product) => (
              <ProductCard key={product.id} product={product} layout="grid" />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
