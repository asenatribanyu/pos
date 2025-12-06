import { DataTypes } from 'sequelize'
import db from '../database/database.js'

const Role = db.define(
  'Role',
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
    level: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    timestamps: true,
    underscored: true
  }
)

export default Role
