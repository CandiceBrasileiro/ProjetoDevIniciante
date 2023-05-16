const router = require("express").Router();
const {
  getUsers,
  createUser,
} = require("../controllers/UserController");

router.get("/", (req, res) => {
  res.send("Iniciado com sucesso.");
});

router.get("/users", getUsers);
router.post("/user", createUser);

module.exports = router;