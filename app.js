const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const { PORT = 3000, DB_URL = "mongodb://localhost:27017/mestodb" } =
  process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// подключаемся к серверу mongo
mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use((req, res, next) => {
  req.user = {
    _id: "64f704fae3d7c753a1db2e6c",
  };

  next();
});

app.use("/users", require("./routes/users"));
app.use("/cards", require("./routes/cards"));

app.listen(PORT);
