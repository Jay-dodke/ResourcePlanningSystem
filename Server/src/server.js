import "dotenv/config";
import app from "./app.js";
import {connectDb} from "./config/db.js";
import env from "./config/env.js";

const PORT = Number(env.PORT) || 5000;

const start = async () => {
  try {
    await connectDb(env.MONGO_URI);
    const server = app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });

    const shutdown = () => {
      console.log("Shutting down server...");
      server.close(() => {
        process.exit(0);
      });
    };

    process.on("SIGTERM", shutdown);
    process.on("SIGINT", shutdown);
  } catch (err) {
    console.error("Failed to start server", err);
    process.exit(1);
  }
};

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled rejection", reason);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught exception", err);
  process.exit(1);
});

start();
