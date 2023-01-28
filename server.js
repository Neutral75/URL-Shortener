const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const { auth, requiresAuth } = require('express-openid-connect');
require('dotenv').config();

const app = express();

mongoose.set('strictQuery', true);
mongoose.connect(`${process.env.mongodbURL}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const config = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.secret,
    baseURL: 'http://localhost:3000',
    clientID: process.env.clientID,
    issuerBaseURL: 'https://dev-z2qulv0i3zzrm78i.uk.auth0.com'
};

app.use(auth(config));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, './Views')));

app.set('views', path.join(__dirname, './Views'));
app.set('view engine', 'ejs');

app.get('/' || '/home', async (request, response) => {
    return response.render('home');
});

app.get('/profile', requiresAuth(), async (request, response) => {
    const user = request.oidc.user;
    console.log(user);

    return response.render('Dashboard/profile', {
        user: user
    });
});

app.listen(process.env.PORT || 3000, () => {
    return console.log('Beep! Running on http://localhost:' + process.env.PORT || 3000);
});