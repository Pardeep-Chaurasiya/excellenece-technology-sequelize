const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/userTable');

const register = async (req, res) => {
  const {
    firstName, lastName, userName, password, email,
  } = req.body;

  try {
    const existingUserEmail = await User.findOne({
      where: { email },
    });
    if (existingUserEmail) {
      return res.status(409).json({ message: 'Email already register' });
    }
    const existingUserName = await User.findOne({
      where: { userName },
    });
    if (existingUserName) {
      return res.status(409).json({ message: 'Username already register' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      firstName,
      lastName,
      userName,
      email,
      password: hashedPassword,
    });

    return res.json({ success: true, message: 'User Register Successfully' });
  } catch (error) {
    console.error(error.message);
    return res.status(400).json({ success: false, error: error.message });
  }
};

const login = async (req, res) => {
  const { userName, password } = req.body;

  if (!userName || !password) {
    return res
      .status(422)
      .json({ code: 'Invalid_INPUT', error: 'Please fill all feilds' });
  }
  const existUserName = await User.findOne({ where: { userName } });
  if (!existUserName) {
    return res
      .status(404)
      .json({ code: 'User-Not-Found', error: 'User not found' });
  }

  const token = await jwt.sign(
    { userId: existUserName.id },
    process.env.JWT_SECRET_KEY,
    { expiresIn: '2h' },
  );

  const comparePassword = await bcrypt.compare(
    password,
    existUserName.password,
  );
  if (!comparePassword) {
    return res.status(400).json({
      code: 'Invalid-UserName-Password',
      error: 'Invalid username or password',
    });
  }
  return res.status(200).json({
    code: 'Success',
    message: 'Login successfully',
    data: { token },
  });
};

module.exports = { register, login };
