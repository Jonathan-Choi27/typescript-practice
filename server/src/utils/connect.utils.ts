import mongoose from 'mongoose';

import logger from './logger.utils';

export default async function connect() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    logger.info('Connected to MongoDB!');
  } catch (e) {
    console.log(e);
    logger.error('Could not connect to MongoDB!');
  }
}
