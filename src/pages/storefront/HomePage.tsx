import Hero from "../../components/home/Hero";
import Featured from "../../components/home/Featured";
import NewSeason from "../../components/home/NewSeasonImage";
import NewProducts from "../../components/home/NewProducts";
import SalesImage from "../../components/home/SalesImage";
import BestSellers from "../../components/home/BestSellers";
function HomePage() {
  return (
    <div>
      <div className="bg-cream">
        <Hero />
      </div>
      <div>
        <Featured />
      </div>
      <div>
        <NewSeason />
      </div>
      <div>
        <NewProducts />
      </div>
      <div>
        <SalesImage />
      </div>
      <div>
        <BestSellers />
      </div>
    </div>
  );
}

export default HomePage;
