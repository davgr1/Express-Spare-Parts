import mongoose from "mongoose";
import { config } from "./config.js";
import dns from "dns";

// Forzar el uso de DNS públicos para evitar el error 'querySrv ECONNREFUSED'
dns.setServers(['8.8.8.8', '1.1.1.1']);

mongoose
  .connect(config.db.URI)
  .then(() => console.log("DB is connected"))
  .catch((error) => console.log("DB connection error: " + error));

const connection = mongoose.connection;

connection.on("disconnected", () => {
  console.log("DB is disconnected");
});

connection.on("error", (error) => {
  console.log("DB error: " + error);
});