const express = require('express');
const mongoose = require('mongoose');

const app = express();

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use('/users', require('./routes/users'));

app.listen(3000, () => {
  console.log('Сервер запущен на порту 3000');
});