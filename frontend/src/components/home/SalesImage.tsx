import { Box, Grid, Typography, Button } from "@mui/material";
// import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Link } from "react-router-dom";

// Görsel yollarını projenin assets klasörüne göre ayarlayabilirsin
import accessoriesImg from "../../assets/accessoryBanner.jpg";
import discountImg from "../../assets/salesBanner.jpg";

export default function PromoBanners() {
  return (
    <Box sx={{ width: "100%", mx: "auto", my: 6 }}>
      <Grid container spacing={3}>
        {/* 1. Sol Banner: Aksesuar Koleksiyonu */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Box
            sx={{
              position: "relative",
              height: { xs: 260, sm: 320, md: 380 },
              overflow: "hidden",
              backgroundImage: `url(${accessoriesImg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end", // Yazıları sağdaki boş alana odaklar
              p: { xs: 3, sm: 5 },
              boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
            }}
          >
            {/* Metin İçerik Alanı */}
            <Box sx={{ maxWidth: { xs: "65%", sm: "55%" }, zIndex: 1 }}>
              <Typography
                variant="overline"
                sx={{
                  color: "#78716C",
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  fontSize: "0.75rem",
                  display: "block",
                }}
              >
                AKSESUAR KOLEKSİYONU
              </Typography>

              <Typography
                variant="h4"
                sx={{
                  fontFamily: "serif",
                  fontWeight: 700,
                  color: "#1C1917",
                  fontSize: { xs: "1.25rem", sm: "1.75rem" },
                  lineHeight: 1.25,
                  mt: 0.5,
                  mb: 2.5,
                }}
              >
                Tarzını Aksesuarlarla Tamamla
              </Typography>

              <Button
                component={Link}
                to="/accessories"
                variant="contained"
                sx={{
                  bgcolor: "#1C1917",
                  color: "#FFF",
                  textTransform: "none",
                  fontWeight: 500,
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                  px: 2.5,
                  py: 1,
                  borderRadius: 2,
                  "&:hover": {
                    bgcolor: "#292524",
                  },
                }}
              >
                Aksesuarları Keşfet
              </Button>
            </Box>
          </Box>
        </Grid>

        {/* 2. Sağ Banner: İndirim & Fırsatlar */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Box
            sx={{
              position: "relative",
              height: { xs: 260, sm: 320, md: 380 },
              overflow: "hidden",
              backgroundImage: `url(${discountImg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start", // Yazıları soldaki boş alana odaklar
              p: { xs: 3, sm: 5 },
              boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
            }}
          >
            {/* Metin İçerik Alanı */}
            <Box sx={{ maxWidth: { xs: "65%", sm: "55%" }, zIndex: 1 }}>
              <Typography
                variant="h2"
                sx={{
                  fontFamily: "sans-serif",
                  fontWeight: 900,
                  color: "#1C1917",
                  fontSize: { xs: "2rem", sm: "2.75rem" },
                  lineHeight: 1,
                  mb: 0.5,
                }}
              >
                %50
              </Typography>

              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  letterSpacing: "0.15em",
                  color: "#1C1917",
                  fontSize: { xs: "0.9rem", sm: "1.1rem" },
                  mb: 1,
                }}
              >
                İNDİRİM
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: "#57534E",
                  fontSize: { xs: "0.8rem", sm: "0.9rem" },
                  mb: 2.5,
                }}
              >
                Seçili Ürünlerde Özel Fırsatlar
              </Typography>

              <Button
                component={Link}
                to="/sales"
                variant="contained"
                sx={{
                  bgcolor: "#1C1917",
                  color: "#FFF",
                  textTransform: "none",
                  fontWeight: 500,
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                  px: 2.5,
                  py: 1,
                  borderRadius: 2,
                  "&:hover": {
                    bgcolor: "#292524",
                  },
                }}
              >
                İndirimleri Gör
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
