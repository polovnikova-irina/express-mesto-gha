const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { errors } = require('celebrate');

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

app.use("/", require("./routes/index"));

app.use("*", (req, res) => {
  res.status(404).send({ message: "Страница не найдена" });
});

// обработчики ошибок
app.use(errors()); // обработчик ошибок celebrate

// // централизованный обработчик
// app.use((err, req, res, next) => {
//   res.send({ message: err.message });
// });


app.listen(PORT);
