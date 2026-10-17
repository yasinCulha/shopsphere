import { Box } from "@mui/material";
import { IoIosArrowRoundForward } from "react-icons/io";
import { Link } from "react-router-dom";
import newSeasonImage from "../../assets/newSeason.jpg";

function BackgroundImageExample() {
  return (
    <Box
      sx={{
        backgroundImage: `url(${newSeasonImage})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "top",
        width: "100vw",
        height: "520px",
        display: "flex",
        justifyContent: "start",
        alignItems: "center",
      }}
    >
      <div className="flex flex-col ml-2 sm:ml-5 md:ml-24">
        <div className="items-start">
          <h3 className="text-gray-700 text-2xl font-medium">YENI SEZON</h3>
          <h1 className="text-gray-900 text-6xl font-medium mt-1">
            Zamansiz <br /> Koleksiyon
          </h1>
          <p className="text-gray-500 text-md  mt-2">
            Modern Tasarimlar,kaliteli kumaslar ve <br />
            ozel koleksiyonlar tarzinizi tamamlayin.
          </p>
        </div>
        <div className="mt-2 flex items-center justify-center">
          <Link
            to="/new-products"
            className="bg-black text-white rounded-md w-45 h-14 flex items-center justify-center"
          >
            Koleksiyonu Kesfet{" "}
            <IoIosArrowRoundForward
              size={24}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </Box>
  );
}

export default BackgroundImageExample;
