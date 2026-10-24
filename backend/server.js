require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();
const PORT = process.env.PORT || 5555;

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.use("/api", require("./routes/systemRoutes"));
app.use("/api/products", require("./routes/productsRoutes"));
app.use("/api", require("./routes/authRoutes"));

app.use("/api/cart", require("./routes/cartRoutes"));
app.use("/api/favorites", require("./routes/favoritesRoutes"));
app.use("/api/account", require("./routes/accountRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

app.listen(PORT, () => {
  console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor`);
});
