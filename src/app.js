const { PORT, IPBIND } = require('./configs');
const app = require('./routes');

app.listen({ port: PORT, host: IPBIND });
