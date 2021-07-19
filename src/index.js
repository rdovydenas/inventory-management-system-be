const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

const authRoutes = require("./routes/auth.js");
const contentRoutes = require("./routes/content.js");

app.use("/content", contentRoutes);
app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Working properly");
});

app.all("*", (req, res) => {
  res.status(404).send("404 Page Does Not Exist");
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on ${port} port`));
