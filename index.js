const express = require("express");
const app = express();

const host = "127.0.0.1";
const port = 3001;

app.use(express.static("./"));

app.listen(port, () => {
  console.log(`Server running at http://${host}:${port}/`);
});
