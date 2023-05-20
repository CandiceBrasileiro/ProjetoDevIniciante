const router = require('express').Router();
const {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  authUser,
  onlineUsers,
  logout,
} = require('../controllers/UserController');

router.get('/', (req, res) => {
  res.send('Iniciado com sucesso.');
});

router.get('/users', getUsers);
router.post('/user', createUser);
router.put('/users/:userId', updateUser);
router.delete('/user/:userId', deleteUser);
router.post('/login', authUser);
router.get('/users/online', onlineUsers);
router.put('/logout/:userId', logout);

module.exports = router;
