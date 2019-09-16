#!/usr/bin/env node

/**
 * Module dependencies.
 */
require('dotenv').config();
const app = require('../app');
const debug = require('debug')('be-on-board-backend:server');
const http = require('http');
const mongoose = require('mongoose');
const socketIO = require('../services/socketIO').default;

const port = normalizePort(process.env.PORT || '3000');
const host = process.env.HOST;
const db_port = process.env.DB_PORT;
const db_name = process.env.DB;
const mongoURI = process.env.MONGODB_URI
  ? `${process.env.MONGODB_URI}`
  : `mongodb://${host}:${db_port}/${db_name}`;

app.set('port', port);
const server = http.createServer(app);

mongoose
  .connect(mongoURI, { useNewUrlParser: true, useFindAndModify: false })
  .then(() => {
    console.log('MongoDB has started working...');
    server.listen(port, () => {
      console.log(`Express server started on port ${port}`);
    });
    server.on('error', onError);
    server.on('listening', onListening);
    new socketIO(server).initSocketIO();
  })
  .catch(e => console.log(e));

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
