const { DataTypes, Model } = require('sequelize');

class User extends Model {
    static associate(models) {
        this.belongsTo(models.Role, {
            foreignKey: 'roleId',
            as: 'role'
        });
    }
}

module.exports = (sequelize) => {
    User.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        roleId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        last_login_date: {
            type: DataTypes.DATE,
            allowNull: true
        },
        orders: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        status: {
            type: DataTypes.STRING,
            allowNull: true
        },
        image: {
            type: DataTypes.STRING,
            allowNull: true
        },
        date_of_birth: {
            type: DataTypes.DATE,
            allowNull: true
        },
        created_at: {
            type: 'TIMESTAMP',
            allowNull: false
        },
        updated_at: {
            type: 'TIMESTAMP',
            allowNull: true
        }
    }, {
        sequelize,
        modelName: 'User',
        tableName: 'users',
        timestamps: true
    })
    return User;
}