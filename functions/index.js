'use strict';

const functions = require('firebase-functions');
const express = require('express');
const cookieParser = require('cookie-parser')();
const bodyParser = require('body-parser');
const cors = require('cors')({origin: true});
const app = express();
const controllers = require('./controllers');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

const validateFirebaseIdToken = (req, res, next) => {
    console.log('Check if request is authorized with Firebase ID token');

    if ((!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) &&
        !req.cookies.__session) {
        console.error('No Firebase ID token was passed as a Bearer token in the Authorization header.',
            'Make sure you authorize your request by providing the following HTTP header:',
            'Authorization: Bearer <Firebase ID Token>',
            'or by passing a "__session" cookie.');
        res.status(403).send('Unauthorized');
        return;
    }

    let idToken;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        console.log('Found "Authorization" header');
        idToken = req.headers.authorization.split('Bearer ')[1];
    } else {
        console.log('Found "__session" cookie');
        idToken = req.cookies.__session;
    }
    admin.auth().verifyIdToken(idToken).then(decodedIdToken => {
        console.log('ID Token correctly decoded', decodedIdToken);
        admin.auth().getUser(decodedIdToken.uid).then(user => {
            req.user = user;
            next();
        });
    }).catch(error => {
        console.error('Error while verifying Firebase ID token:', error);
        res.status(403).send('Unauthorized');
    });
};

app.use(cors);
app.use(bodyParser.json());
app.use(cookieParser);
app.use(validateFirebaseIdToken);

for (const [method, endpoint, fn] of controllers) {
    app[method](endpoint, fn);
}

exports.backend = functions.https.onRequest(app);