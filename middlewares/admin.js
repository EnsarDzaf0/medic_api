const UserService = require('../services/user');

const admin = async (req, res, next) => {
    try {
        const user = await UserService.getUserById(req.user.id);

        if (user.role.name !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }
        next();
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = admin;