const { DataTypes, Model } = require('sequelize');

class Role extends Model {
    static associate(models) {
        Role.hasMany(models.User, { foreignKey: 'roleId', as: 'users' });
    }
}

module.exports = (sequelize) => {
    Role.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
    }, {
        sequelize,
        modelName: 'Role',
        tableName: 'roles',
        timestamps: false
    });

    return Role;
};