const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class UserAccount extends Model {}

UserAccount.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    ipfsHash: {
      type: DataTypes.STRING(72),
    },
  },
  {
    sequelize,
    schema: 'mv_auth_mgmt',
    indexes: [],
    modelName: 'user_account',
  },
);

export = UserAccount;
