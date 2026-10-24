import { Link } from "react-router-dom";

function CupboardPage() {
  return (
    <section className="min-h-[50vh] bg-cream px-4 py-12 text-black sm:px-6 lg:py-16">
      <div className="mx-auto max-w-4xl">
        <p className="text-sm text-stone-500">Hesabım</p>
        <h1 className="mt-1 text-3xl font-bold">Cupboard</h1>

        <div className="mt-8 rounded-2xl border border-[#E5DFD5] bg-white px-6 py-12 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#F7F4EE] text-2xl text-stone-600">
            ♧
          </div>
          <h2 className="mt-5 text-xl font-semibold">Dolabın şimdilik boş</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-stone-500">
            Beğendiğin ürünleri dijital dolabında toplamaya burada başlayabilirsin.
          </p>
          <Link
            to="/products"
            className="mt-6 inline-flex rounded-lg bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-stone-800"
          >
            Ürünleri keşfet
          </Link>
        </div>
      </div>
    </section>
  );
}

export default CupboardPage;
