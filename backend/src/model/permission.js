import { DataTypes } from 'sequelize'
import db from '../database/database.js'

const Permission = db.define(
  'Permission',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    timestamps: true,
    underscored: true
  }
)

export default Permission
