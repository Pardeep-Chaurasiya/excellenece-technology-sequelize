const User = require('../models/userTable');

const getSingleUser = async (req, res) => {
  const userId = req.User.id;
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    return res.status(200).json({
      message: 'User data retrieved successfully',
      data: {
        id: user.id,
        userName: user.userName,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(400).json({ error: 'Error retrieving user data' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.User.id;
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    await user.destroy();
    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ code: 'Internal-Server-Error', error: error.toString() });
  }
};
module.exports = {
  getSingleUser,
  deleteUser,
};
