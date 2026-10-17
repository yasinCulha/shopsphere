import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../../redux/slices/productSlice";
import type { AppDispatch, RootState } from "../../redux/store";
import { Link } from "react-router-dom";
import { IoIosArrowRoundForward } from "react-icons/io";
import ProductCard from "../common/ProductCard";

function Featured() {
  const dispatch = useDispatch<AppDispatch>();
  const { products, error } = useSelector((state: RootState) => state.products);

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  return (
    <section className="mx-auto w-full max-w-[1750px] px-4 py-12 sm:px-8">
      {/* Başlık Alanı */}
      <div className="flex items-center justify-between border-b border-stone-200/60 pb-5">
        <h2 className="text-2xl font-bold font-serif text-gray-900 sm:text-3xl">
          Öne Çıkan Ürünler
        </h2>
        <Link
          to="/products"
          className="group flex items-center gap-1.5 text-sm font-semibold text-gray-800 transition hover:text-black md:mt-5 sm:mt-2"
        >
          <span>Tüm Ürünleri Gör</span>
          <IoIosArrowRoundForward
            size={24}
            className="transition-transform group-hover:translate-x-1"
          />
        </Link>
      </div>

      {error ? (
        <p role="alert" className="mt-6 text-red-700">
          {error}
        </p>
      ) : (
        <div
          aria-label="Öne çıkan ürünler"
          className="mt-8 flex  gap-4 overflow-x-auto overscroll-x-contain pb-4 sm:gap-5 md:grid md:grid-cols-4 md:snap-none md:overflow-visible md:pb-0 lg:grid-cols-6"
        >
          {products.slice(0, 6).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}

export default Featured;
