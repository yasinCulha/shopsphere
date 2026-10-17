import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import { LuHeart } from "react-icons/lu";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../redux/store";
import {
  getProductByID,
  toggleFavorite,
  addToBasket,
} from "../../redux/slices/productSlice";
import "swiper/css";
import "swiper/css/pagination";
function ProductDetailPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useParams();

  const product = useSelector((state: RootState) => {
    const productId = Number(id);
    return (
      state.products.products.find((item) => item.id === productId) ??
      state.products.searchResults.find((item) => item.id === productId) ??
      (state.products.selectedProduct?.id === productId
        ? state.products.selectedProduct
        : null)
    );
  });
  useEffect(() => {
    if (!id || product) return;

    const request = dispatch(getProductByID(id));
    return () => request.abort();
  }, [dispatch, id, product]);

  if (!product) {
    return (
      <p className="bg-cream px-4 py-8">
        {id ? "Ürün yükleniyor..." : "Ürün bulunamadı."}
      </p>
    );
  }

  return (
    <div>
      <section className="py-8 bg-cream text-black md:py-16  antialiased">
        <div className="max-w-screen-xl px-4 mx-auto 2xl:px-0">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 xl:gap-16">
            <div className="shrink-0 max-w-md lg:max-w-lg mx-auto">
              <Swiper
                className="product-image-swiper"
                modules={[Pagination]}
                pagination={{ clickable: true }}
                spaceBetween={10}
                slidesPerView={1}
              >
                {product.images.map((item, index) => (
                  <SwiperSlide key={index}>
                    <img
                      src={item}
                      alt={`${product.title} ${index + 1}`}
                      className="h-80 w-full object-contain"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            <div className="mt-6 sm:mt-8 lg:mt-0">
              <h1 className="text-xl font-semibold sm:text-2xl ">
                {product.title}
              </h1>
              <div className="mt-4 sm:items-center sm:gap-4 sm:flex">
                <p className="text-2xl font-extrabold  sm:text-3xl ">
                  {product.price}
                </p>

                <div className="flex items-center gap-2 mt-2">
                  <p className="text-sm font-medium leading-none text-gray-500">
                    ⭐ {product.rating}
                  </p>

                  <Link
                    to="/reviews"
                    className="text-sm font-medium leading-none underline hover:no-underline"
                  >
                    {product.reviews.length} yorum
                  </Link>
                </div>
              </div>

              <div className="mt-6 sm:gap-4 sm:items-center sm:flex sm:mt-8">
                <button
                  onClick={() => dispatch(toggleFavorite(product))}
                  title=""
                  className="flex items-center bg-[#B0A493] justify-center py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none rounded-lg border border-[#A39480]  hover:bg-[#A39480] cursor-pointer hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-100 "
                  role="button"
                >
                  <LuHeart size={18} className="shrink-0 mr-2" />
                  Favorilere Ekle
                </button>

                <button
                  onClick={() => dispatch(addToBasket(product))}
                  title=""
                  className="text-white cursor-pointer bg-black mt-4 sm:mt-0 bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-primary-600  focus:outline-none dark:focus:ring-primary-800 flex items-center justify-center"
                  role="button"
                >
                  <HiOutlineShoppingBag
                    size={21}
                    className="shrink-0 mr-2"
                    aria-hidden="true"
                  />
                  Sepeet Ekle
                </button>
              </div>

              <hr className="my-6 md:my-8 border-gray-200" />

              <p className="mb-6 text-gray-500 dark:text-gray-400">
               {product.description}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ProductDetailPage;
