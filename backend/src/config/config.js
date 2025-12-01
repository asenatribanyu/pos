import dotenv from 'dotenv'

dotenv.config()

const config = {
  app: {
    port: process.env.APP_PORT || 3000,
    host: process.env.APP_HOST || 'localhost',
    jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret',
    jwtExpiration: process.env.JWT_EXPIRATION || '1h'
  },
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'pos_db',
    dialect: process.env.DB_DIALECT || 'postgres'
  }
}

export default config
