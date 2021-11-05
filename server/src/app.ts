import dotenv from 'dotenv';

import createServer from './utils/server.utils';
import connect from './utils/connect.utils';
import logger from './utils/logger.utils';

dotenv.config();

const port = process.env.PORT || 1337;

const app = createServer();

app.listen(port, async () => {
  logger.info(`App is running at http://localhost:${port}`);
  await connect();
});
