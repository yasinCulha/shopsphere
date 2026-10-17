import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { heroSlides } from "../../data/slides";

function Hero() {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  const showPreviousSlide = () => {
    setActiveSlideIndex((currentIndex) =>
      currentIndex === 0 ? heroSlides.length - 1 : currentIndex - 1,
    );
  };

  const showNextSlide = () => {
    setActiveSlideIndex((currentIndex) =>
      currentIndex === heroSlides.length - 1 ? 0 : currentIndex + 1,
    );
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlideIndex(
        (currentIndex) => (currentIndex + 1) % heroSlides.length,
      );
    }, 6000); // Her slayt 6 saniye kalır

    return () => clearInterval(timer);
  }, []);

  return (
    <section
      aria-label="Öne çıkan koleksiyonlar"
      className="relative isolate mx-auto h-[35rem] max-w-10xl overflow-hidden bg-neutral-950 sm:h-[38rem]"
    >
      {/* 1. KATMAN: Arka Plan Görselleri (Kesintisiz & Yavaş Erime) */}
      <div className="absolute inset-0 -z-20 h-full w-full">
        {heroSlides.map((slide, index) => {
          const isActive = index === activeSlideIndex;
          return (
            <img
              key={slide.id}
              src={slide.imageUrl}
              alt={slide.alt}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1500 ease-in-out ${
                isActive ? "opacity-100" : "opacity-0"
              }`}
            />
          );
        })}
      </div>

      {/* 2. KATMAN: Karartma (Parlama engelleyici sabit degrade) */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/85 via-black/55 to-black/20" />

      {/* 3. KATMAN: Metinler ve İçerikler */}
      {heroSlides.map((slide, index) => {
        const isActive = index === activeSlideIndex;

        return (
          <div
            key={slide.id}
            aria-hidden={!isActive}
            className={`absolute inset-0 flex items-center transition-all duration-1000 ease-out ${
              isActive
                ? "opacity-100 z-10 pointer-events-auto"
                : "opacity-0 z-0 pointer-events-none"
            }`}
          >
            <div className="flex max-w-2xl flex-col items-start px-8 text-white sm:px-16">
              <p
                className={`mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-white/80 transition-all duration-1000 delay-150 ${
                  isActive
                    ? "translate-y-0 opacity-100"
                    : "translate-y-3 opacity-0"
                }`}
              >
                {slide.subtitle}
              </p>

              <h1
                className={`mb-4 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl transition-all duration-1000 delay-300 ${
                  isActive
                    ? "translate-y-0 opacity-100"
                    : "translate-y-3 opacity-0"
                }`}
              >
                {slide.title}
              </h1>

              <p
                className={`mb-8 max-w-xl text-base text-white/85 sm:text-lg transition-all duration-1000 delay-500 ${
                  isActive
                    ? "translate-y-0 opacity-100"
                    : "translate-y-3 opacity-0"
                }`}
              >
                {slide.description}
              </p>

              <Link
                to={slide.buttonLink}
                tabIndex={isActive ? 0 : -1}
                className={`rounded-md bg-white px-6 py-3 text-sm font-semibold text-gray-900 shadow-md transition-all duration-1000 delay-700 hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                  isActive
                    ? "translate-y-0 opacity-100"
                    : "translate-y-3 opacity-0"
                }`}
              >
                {slide.buttonText}
              </Link>
            </div>
          </div>
        );
      })}

      {/* Navigasyon Okları */}
      <button
        type="button"
        onClick={showPreviousSlide}
        aria-label="Önceki slayt"
        className="absolute left-4 top-1/2 z-20 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-black/40 text-2xl text-white backdrop-blur-sm transition hover:bg-black/70 focus-visible:outline-2 focus-visible:outline-white"
      >
        <span aria-hidden="true">‹</span>
      </button>

      <button
        type="button"
        onClick={showNextSlide}
        aria-label="Sonraki slayt"
        className="absolute right-4 top-1/2 z-20 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-black/40 text-2xl text-white backdrop-blur-sm transition hover:bg-black/70 focus-visible:outline-2 focus-visible:outline-white"
      >
        <span aria-hidden="true">›</span>
      </button>

      {/* Alt Göstergeler (Indicators) */}
      <div
        aria-label="Slayt seçimi"
        className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2.5"
      >
        {heroSlides.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            onClick={() => setActiveSlideIndex(index)}
            aria-label={`${index + 1}. slayta git`}
            aria-current={index === activeSlideIndex ? "true" : undefined}
            className={`h-2 rounded-full transition-all duration-500 ${
              index === activeSlideIndex
                ? "w-8 bg-white"
                : "w-2 bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>
    </section>
  );
}

export default Hero;
