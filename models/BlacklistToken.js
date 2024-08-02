const { DataTypes, Model } = require('sequelize');

class BlacklistToken extends Model {
}

module.exports = (sequelize) => {
    BlacklistToken.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        token: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        expiresAt: {
            field: 'expires_at',
            type: DataTypes.DATE,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'BlacklistToken',
        tableName: 'blacklist_tokens',
        timestamps: false
    });

    return BlacklistToken;
};