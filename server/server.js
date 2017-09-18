const express = require('express');
const bodyParser = require('body-parser');
const authMiddleware = require('./controller');
const server = express();
const session = require('express-session');
const PORT = 8000; 
const mongoose = require('mongoose');
const MONGO_URL = 'mongodb://localhost:27017/DemoApp_Test';
mongoose.connect(MONGO_URL);
mongoose.Promise = global.Promise;
const secret = require('./secret.js');

  const sessionOptions = {
    secret: secret,
    resave: false,
    saveUninitialized: true,
    secure: 'auto',
    cookie: { maxAge: 86400 },
  }
  server.set('trust proxy', 1);
  server.use(bodyParser.json());
  server.use(session(sessionOptions));
  // ./controllers/index
  authMiddleware(server);

  server.listen(PORT, () => { 
     console.log('Server is runing over 8000, hope you have fun looking over my code :)');
  });



