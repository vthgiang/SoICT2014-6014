// NODE_MODULES
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const app = express();
const server = require('http').createServer(app);
const fp = require('find-free-port');

require('dotenv').config();
require('./global')(server);

app.use(require('cors')());
app.use(bodyParser.urlencoded({ extended: false, limit: '50mb', parameterLimit: 50000 }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(cookieParser());
require('./rabbitmq/server');
/**
 * Server initial
 */
const port = process.env.PORT || 8000;
server.listen(port, () => {
  console.log(`Server up and running on: ${port} !`);
});
