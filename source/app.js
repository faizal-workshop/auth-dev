import { PORT, IPBIND } from './configs.js';
import app from './routes.js';

app.listen({ port: PORT, host: IPBIND });
