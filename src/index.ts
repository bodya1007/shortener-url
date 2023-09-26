import { redis, sequelize } from './db/index';
import app from './app';
import dotenv from 'dotenv';

dotenv.config();

async function start() {
  const PORT = process.env.PORT || 3000;

  try {
    await sequelize.sync({ force: false });
    await redis.connect()

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to start the server:', error);
  }
}

start();
