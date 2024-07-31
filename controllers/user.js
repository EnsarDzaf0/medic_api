const UserService = require('../services/user');

const login = async (req, res) => {
    try {
        console.log(req.body);
        const { user, token } = await UserService.loginUser(req.body);
        return res.status(200).json({ user, token });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = {
    login
};