const User = require('../models/UserModel.js');

const getUsers = async (req, res) => {
  try {
    const results = await User.find();
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json(err);
  }
};

const createUser = (req, res) => {
  const user = new User({
    name: req.body.name,
    cpf: req.body.cpf,
    password: req.body.password,
  });

  user
    .save()
    .then((newUser) => {
      return res.json(201).json({
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
  User.findOneAndUpdate(
    { _id: idUser },
    {
      $set: {
        name: req.body.name,
        cpf: req.body.cpf,
        password: req.body.password,
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
    if (password === doc.password) {
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

const onlineUsers =  async (req, res) => {

  try {
    const docs = await User.find({online: {$eq: true}});
    return res.status(200).json({userOnline: docs, message: 'Usuários encontrados'})
  } catch (err) {
    res.status(500).json(err);
  } 
};

module.exports = { getUsers, createUser, updateUser, deleteUser, authUser, onlineUsers };
