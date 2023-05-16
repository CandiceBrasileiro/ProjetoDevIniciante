const router = require("express").Router();
const {
        getUsers,
        createUser,
        updateUser
} = require("../controllers/UserController");

router.get("/", (req, res) => {
  res.send("Iniciado com sucesso.");
});

router.get("/users", getUsers);
router.post("/user", createUser);
router.put("/users/:userId", updateUser);

module.exports = router;