import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
  path: "./env",
});

const PORT = process.env.PORT || 8000;

connectDB()
  .then(() => {
    app.on("error", () => {
      console.log("🔉▶️  Server Running Failed 🟥", error);
    });
    app.listen(PORT, () => {
      console.log(` 🚀🚀 Server Running at port ${PORT} 🚀🚀`);
    });
  })
  .catch((error) => {
    console.log("MONGO db connection failed!!!", error);
  });
