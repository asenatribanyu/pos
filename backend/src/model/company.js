import { DataTypes } from 'sequelize'
import db from '../database/database.js'

const Company = db.define(
  'Company',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    timestamps: true,
    underscored: true
  }
)

export default Company
