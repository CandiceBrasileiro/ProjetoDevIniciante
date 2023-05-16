const router = require("express").Router();

router.get("/", (req, res) => {
  res.send("Iniciado com sucesso.");
});

module.exports = router;