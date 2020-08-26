import express from 'express';
import path from 'path';
import routes from './routes';

import uploadConfig from './config/upload';

const app = express();

app.use(express.json());

app.use('/files', express.static(uploadConfig.directory));
app.use(routes);

export default app;
