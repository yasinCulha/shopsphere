import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { IoTrashOutline } from "react-icons/io5";
import { LuHeart } from "react-icons/lu";
import type { AppDispatch, RootState } from "../../redux/store";
import {
  toggleFavorite,
} from "../../redux/slices/productSlice";
import truncateText from "../../utils/truncateText";
import { useEffect, useState } from "react";
import {
  getCart,
  removeProductFromCart,
  updateCartQuantity,
} from "../../services/cartService";
import Loading from "../../components/Loading";

const formatPrice = (price: number) =>
  price.toLocaleString("tr-TR", {
    style: "currency",
    currency: "USD",
  });

function CartPage() {
  const dispatch = useDispatch<AppDispatch>();

  const [basket, setBasket] = useState<
    {
      product: {
        id: number;
        title: string;
        category: string;
        price: number;
        thumbnail: string;
      };
      quantity: number;
    }[]
  >([]);
  const [loading, setLoading] = useState(true);

  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  useEffect(() => {
    async function loadCart() {
      if (!accessToken) {
        setBasket([]);
        setLoading(false);
        return;
      }

      try {
        const data = await getCart(accessToken);
        setBasket(data.items);
      } catch (error) {
        console.error("Sepet yüklenemedi:", error);
      } finally {
        setLoading(false);
      }
    }

    loadCart();
  }, [accessToken]);

  const totalPrice = basket.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0,
  );
  async function handleQuantityChange(productId: number, quantity: number) {
    if (!accessToken || quantity < 1) return;

    try {
      await updateCartQuantity(accessToken, productId, quantity);

      setBasket((current) =>
        current.map((item) =>
          item.product.id === productId ? { ...item, quantity } : item,
        ),
      );
    } catch (error) {
      console.error("Ürün miktarı güncellenemedi:", error);
    }
  }
  async function handleRemove(productId: number) {
    if (!accessToken) return;

    try {
      await removeProductFromCart(accessToken, productId);
      setBasket((current) =>
        current.filter((item) => item.product.id !== productId),
      );
    } catch (error) {
      console.error("Ürün sepetten silinemedi:", error);
    }
  }
  if (loading) {
    return <Loading />;
  }
  return (
    <section className="bg-cream py-8 text-black antialiased md:py-16">
      <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
        <h1 className="text-xl font-semibold sm:text-2xl">Alışveriş Sepeti</h1>

        {basket.length === 0 ? (
          <div className="mt-8 rounded-xl border border-cream bg-white p-8 text-center shadow-sm">
            <p className="text-stone-600">Sepetiniz şu anda boş.</p>
            <Link
              to="/"
              className="mt-4 inline-flex rounded-lg bg-[#B0A493] px-5 py-2.5 text-sm font-medium text-black transition-colors hover:bg-[#A39480]"
            >
              Alışverişe devam et
            </Link>
          </div>
        ) : (
          <div className="mt-6 grid gap-8 lg:mt-8 lg:grid-cols-[1fr_360px]">
            <div className="space-y-4">
              {basket.map(({ product, quantity }) => (
                <article
                  key={product.id}
                  className="rounded-xl border border-cream bg-white p-4 shadow-sm md:p-6"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <Link
                      to={`/products/${product.id}`}
                      className="flex h-28 w-full shrink-0 items-center justify-center sm:h-24 sm:w-24"
                    >
                      <img
                        className="h-full w-full object-contain"
                        src={product.thumbnail}
                        alt={product.title}
                      />
                    </Link>

                    <div className="min-w-0 flex-1">
                      <Link
                        to={`/products/${product.id}`}
                        className="font-medium text-black hover:underline"
                      >
                        {product.title}
                      </Link>
                      <p className="mt-1 text-sm capitalize text-stone-500">
                        {product.category}
                      </p>
                      <p className="mt-2 font-semibold text-black">
                        {formatPrice(product.price)}
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            handleQuantityChange(product.id, quantity - 1)
                          }
                          aria-label={`${product.title} miktarını azalt`}
                          className="cursor-pointer inline-flex h-8 w-8 items-center justify-center rounded-md border border-cream bg-cream text-lg text-black transition-colors hover:bg-cream-dark"
                        >
                          −
                        </button>
                        <span
                          className="min-w-6 text-center text-sm font-medium text-black"
                          aria-live="polite"
                        >
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            handleQuantityChange(product.id, quantity + 1)
                          }
                          aria-label={`${product.title} miktarını artır`}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md border cursor-pointer border-cream bg-cream text-lg text-black transition-colors hover:bg-cream-dark"
                        >
                          +
                        </button>
                      </div>
                      <p className="font-bold text-black">
                        {formatPrice(product.price * quantity)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-4 border-t border-cream pt-4">
                    <button
                      type="button"
                      onClick={() => dispatch(toggleFavorite(product))}
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-stone-600 transition-colors hover:text-black cursor-pointer"
                    >
                      <LuHeart aria-hidden="true" />
                      Favorilere ekle
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemove(product.id)}
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-[#9C4A3C] hover:underline cursor-pointer"
                    >
                      <IoTrashOutline aria-hidden="true" />
                      Sepetten çıkar
                    </button>
                  </div>
                </article>
              ))}

              <Link
                to="/"
                className="inline-flex text-sm font-medium text-stone-700 underline hover:text-black hover:no-underline"
              >
                Alışverişe devam et
              </Link>
            </div>

            <aside className="h-fit space-y-4 rounded-xl border border-cream bg-white p-4 shadow-sm sm:p-6">
              <h2 className="text-lg font-semibold text-black">
                Sipariş özeti
              </h2>
              {basket.map(({ product, quantity }) => (
                <div className="flex justify-between">
                  <div className="flex ">
                    <p className="mr-2">{truncateText(product.title, 25)}</p>
                    <span>x</span>
                    <p className="ml-2">{quantity}</p>
                  </div>

                  <p>{formatPrice(product.price * quantity)}</p>
                </div>
              ))}
              <div className="flex items-center justify-between border-t border-cream pt-4">
                <span className="font-medium text-black">Toplam</span>
                <span className="text-xl font-bold text-black">
                  {formatPrice(totalPrice)}
                </span>
              </div>
              <button
                type="button"
                disabled
                className="w-full cursor-not-allowed rounded-lg bg-[#B0A493] px-5 py-2.5 text-sm font-medium text-black opacity-60"
              >
                Ödeme yakında kullanılabilir
              </button>
            </aside>
          </div>
        )}
      </div>
    </section>
  );
}

export default CartPage;
