const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const router = require('./router/Router');
const session = require('express-session');
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: { origin: 'http://localhost:5173' },
});

app.set('trust proxy', 1); // trust first proxy
app.use(
  session({
    secret: 'dogs are great',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true, maxAge: 3000000 },
  }),
);

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

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log('usuário connectado', socket.id);

  socket.on('set_userName', (userName) => {
    socket.data.userName = userName;
    io.emit('online', { name: socket.data.userName });
  });
  socket.on('disconnect', (reason) => {
    console.log('Usuário desconectado', socket.id);
  });

  socket.on('message', (text) => {
    io.emit('receive_message', {
      text,
      authorId: socket.id,
      author: socket.data.userName,
    });
  });
});

server.listen(8181, async () => {
  console.log('Servidor rodando');
});
