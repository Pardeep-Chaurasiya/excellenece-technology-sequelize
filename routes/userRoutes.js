const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const userController = require('../controller/userController');

const router = express.Router();

router.get('/getuser', authMiddleware, userController.getSingleUser);
router.delete('/deleteuser', authMiddleware, userController.deleteUser);

module.exports = router;
