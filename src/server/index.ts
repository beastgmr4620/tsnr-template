import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import crypto from 'crypto';
import path from 'path';
import fs from 'fs';

const app = express();
const apiPattern = /^\/api/;

// app context is root folder of project
app.set('context', (global as any).context as string);
// server port
app.set('port', process.env.PORT || 8080);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(
  session({
    cookie: {
      maxAge: 365 * 24 * 60 * 60 * 1000,
    },
    secret: crypto.randomBytes(64).toString('hex'),
    saveUninitialized: true,
    resave: true,
  }),
);

app.use((request, response, next) => {
  if (request.url.match(apiPattern)) return next();

  if (path.extname(request.path)) {
    // Requested path is file
    const absolutePath = path.join(
      app.get('context'),
      'dist',
      'client',
      request.path,
    );

    if (fs.existsSync(absolutePath))
      response.status(200).sendFile(absolutePath);
    else response.status(404).end();
  } else
    response
      .status(200)
      .sendFile(path.join(app.get('context'), 'dist', 'client', 'index.html'));
});

app.listen(app.get('port'), () => {
  console.log('Listening @::' + app.get('port'));
});
