import app from "./server.js";
import "./models/Video";

const PORT = 7070;

app.listen(PORT, () =>
  console.log(`✅ Server listening to ${PORT} port number! `)
);
