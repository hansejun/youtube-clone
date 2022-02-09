import "regenerator-runtime";
import "dotenv/config";
import app from "./server.js";
import "./db";
import "./models/Video";
import "./models/User";
import "./models/Comment";

const PORT = 7070;

app.listen(PORT, () =>
  console.log(`✅ Server listening to ${PORT} port number! `)
);
