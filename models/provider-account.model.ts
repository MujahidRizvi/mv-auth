const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class ProviderAccount extends Model {}

ProviderAccount.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    userAccountId: {
      type: DataTypes.INTEGER,
    },
    providerType: {
      type: DataTypes.STRING(16),
    },
    providerKey: {
      type: DataTypes.STRING,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
    },
    isManual: {
      type: DataTypes.BOOLEAN,
    },
    createdBy: {
      type: DataTypes.STRING(16),
    },
    updatedBy: {
      type: DataTypes.STRING(16),
    },
  },
  {
    sequelize,
    schema: 'mv_auth_mgmt',
    indexes: [
      {
        name: 'ptype_pkey_idx',
        fields: ['providerType', 'providerKey'],
      },
    ],
    modelName: 'provider_account',
  },
);

export = ProviderAccount;
