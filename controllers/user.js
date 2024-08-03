const UserService = require('../services/user');
const TokenService = require('../services/token');

const login = async (req, res) => {
    try {
        const { user, token } = await UserService.loginUser(req.body);
        return res.status(200).json({ user, token });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await UserService.getAllUsers();
        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getUserById = async (req, res) => {
    try {
        const user = await UserService.getUserById(req.params.id);
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const updateUser = async (req, res) => {
    try {
        const user = await UserService.updateUser(req.params.id, req.body);
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const logout = async (req, res) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        await TokenService.blacklistToken(token);
        return res.status(200).json({ message: 'Logged out' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const register = async (req, res) => {
    try {
        const userData = JSON.parse(req.body.userData);
        const user = await UserService.registerUser(userData, req.file);
        return res.status(201).json(user);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = {
    login,
    getAllUsers,
    getUserById,
    updateUser,
    logout,
    register
};