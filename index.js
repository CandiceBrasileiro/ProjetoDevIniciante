const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const router = require('./router/Router');
 const session = require('express-session');

const app = express();

app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'dogs are great',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true, maxAge: 3000000 }
}))

//database
mongoose
  .connect('mongodb://0.0.0.0:27017/candice_brasileiro', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Banco OK!');
  })
  .catch((err) => {
    console.log(err);
  });

app.use(cors());

//Body-parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(router);

app.listen(3131, async () => {
  console.log('Servidor rodando');
});
