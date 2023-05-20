const User = require('../models/UserModel.js');
const bcrypt = require('bcryptjs');
const validarCPF = require('../helper/cpf');
const validarName = require('../helper/validarName');

const getUsers = async (req, res) => {
  try {
    const results = await User.find();
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json(err);
  }
};

const createUser = (req, res) => {
  const password = req.body.password;
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  const cpf = req.body.cpf;
  const name = req.body.name;

  if (!validarCPF(cpf)) {
    return res.json({ message: 'O cpf é inválido' });
  }

  if (!validarName(name)) {
    return res.json({ message: 'O campo deve ser preenchido' });
  }

  const user = new User({
    name: name,
    cpf: cpf,
    password: hash,
  });

  user
    .save()
    .then((newUser) => {
      return res.status(201).json({
        sucess: true,
        message: 'Novo usuário criado',
        Cause: newUser,
      });
    })
    .catch((error) => {
      res.status(500).json({
        sucess: false,
        message: 'Server error. Please try again.',
        Cause: error.message,
      });
    });
};

const updateUser = (req, res) => {
  console.log('aqui');
  const idUser = req.params.userId;
  const password = req.body.password;
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);

  User.findOneAndUpdate(
    { _id: idUser },
    {
      $set: {
        name: req.body.name,
        cpf: req.body.cpf,
        password: hash,
      },
    },
    { new: true },
  )
    .then((user) => {
      return res.status(200).json({
        success: true,
        message: 'Usuário alterado',
        Cause: user,
      });
    })
    .catch((e) => {
      res.status(500).json({
        success: false,
        message: 'Server error. Please try again.',
        error: e.message,
      });
    });
};

const deleteUser = (req, res) => {
  const idUser = req.params.userId;

  User.deleteOne({ _id: idUser })
    .then(() => {
      return res.status(200).json({
        success: true,
        message: 'Usuário excluído',
        Cause: null,
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: 'Server error. Please try again.',
        error: e.message,
      });
    });
};

const authUser = (req, res) => {
  const { cpf, password } = req.body;

  User.findOne({ cpf: cpf }).then((doc) => {
    if (!doc) {
      return res.status(400).json({ message: 'usuário não existe' });
    }

    const correct = bcrypt.compareSync(password, doc.password);

    if (correct) {
      req.session.doc = {
        cpf: doc.cpf,
      };
      User.findOneAndUpdate(
        { cpf: cpf },
        { $set: { online: true } },
        { new: true },
      ).then((user) => {
        return res.status(200).json(console.log('passou', doc));
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Rong password. Please try again.',
      });
    }
  });
};

const onlineUsers = async (req, res) => {
  try {
    const docs = await User.find({ online: { $eq: true } });
    return res
      .status(200)
      .json({ userOnline: docs, message: 'Usuários encontrados' });
  } catch (err) {
    res.status(500).json(err);
  }
};

const logout = (req, res) => {
  const idUser = req.params.userId;

  User.findOneAndUpdate(
    { _id: idUser },
    {
      $set: {
        online: false,
      },
    },
    { new: true },
  )
    .then((user) => {
      req.session.user = undefined;
      return res.status(200).json({
        success: true,
        message: 'logout',
      });
    })
    .catch((e) => {
      res.status(500).json({
        success: false,
        message: 'Server error. Please try again.',
        error: e.message,
      });
    });
};

module.exports = {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  authUser,
  onlineUsers,
  logout,
};
