const User = require("../models/UserModel");

const getUsers = async(req, res) => {
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
    password: req.body.password
  });

  user
    .save()
    .then((newUser) => {
      return res.json(201).json({
        sucess: true,
        message: "Novo usuário criado",
        Cause: newUser,
      })
    })
}

module.exports = {getUsers, createUser};