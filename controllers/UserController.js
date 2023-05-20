const User = require('../models/UserModel.js');
const bcrypt = require('bcryptjs');

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

  function validarCPF(cpf = req.body.cpf) {
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf == '') return false;
    // Elimina CPF invalidos
    if (
      cpf.length != 11 ||
      cpf == '00000000000' ||
      cpf == '11111111111' ||
      cpf == '22222222222' ||
      cpf == '33333333333' ||
      cpf == '44444444444' ||
      cpf == '55555555555' ||
      cpf == '66666666666' ||
      cpf == '77777777777' ||
      cpf == '88888888888' ||
      cpf == '99999999999'
    )
      return false;
    // Valida 1o digito
    add = 0;
    for (i = 0; i < 9; i++) add += parseInt(cpf.charAt(i)) * (10 - i);
    rev = 11 - (add % 11);
    if (rev == 10 || rev == 11) rev = 0;
    if (rev != parseInt(cpf.charAt(9))) return false;
    // Valida 2o digito
    add = 0;
    for (i = 0; i < 10; i++) add += parseInt(cpf.charAt(i)) * (11 - i);
    rev = 11 - (add % 11);
    if (rev == 10 || rev == 11) rev = 0;
    if (rev != parseInt(cpf.charAt(10))) return false;
    return true;
  }

  const user = new User({
    name: req.body.name,
    cpf: validarCPF,
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
