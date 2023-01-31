const express = require('express');
const { auth, requiresAuth } = require('express-openid-connect');
const mongoose = require('mongoose');
const path = require('path');
const geoip = require('geoip-lite');
require('dotenv').config();

const user = require('./Schemas/user.js');
const link = require('./Schemas/link.js');

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
    baseURL: 'https://ruby-plain-cormorant.cyclic.app/',
    clientID: process.env.clientID,
    issuerBaseURL: 'https://dev-z2qulv0i3zzrm78i.uk.auth0.com'
};

app.use(auth(config));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, './Views')));

app.set('views', path.join(__dirname, './Views'));
app.set('view engine', 'ejs');

app.get('/', async (request, response) => {
    return response.render('home');
});

app.get('/home', async (request, response) => {
    return response.render('home');
});

app.get('/contact', async (request, response) => {
    return response.render('contact');
});

app.get('/profile', requiresAuth(), async (request, response) => {
    const userData = request.oidc.user;

    const userSchema = await user.findOne({
        email: userData.email.toLowerCase()
    }) || await user.create({
        email: userData.email.toLowerCase(),
        date: new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' })
    });

    const linkSchema = await link.find({
        email: userData.email.toLowerCase()
    });

    return response.render('Dashboard/profile', {
        userData: userData,
        userSchema: userSchema,
        linkSchema: linkSchema
    });
});

app.get('/:link', async (request, response) => {
    const linkSchema = await link.findOne({
        shortURL: request.params.link
    });

    if (linkSchema === null) {
        return response.redirect('/');
    };

    const ip = request.headers['x-forwarded-for'];
    const geo = geoip.lookup(ip);

    console.log(ip);
    console.log(geo);

    link.findOne({
        shortURL: request.params.link
    }, function (error, link) {
        if (error) {
            console.log(error)
            return handleError(error);
        };
        
        const country = link.countries.find(c => c.name === geo.country);
        if (country) {
            country.clicks++;
        } else {
            link.countries.push({ name: geo.country, clicks: 1 });
        };

        link.save(function (error) {
            if (error) {
                console.log(error);
                return handleError(error);
            };

            console.log(link);
        });
    });

    linkSchema.clicks++;
    linkSchema.save();

    return response.redirect(linkSchema.longURL);
});

app.post('/link', async (request, response) => {
    if (!request.body.longURL) {
        return response.redirect('home');
    };

    if (request.body.email) {
        const userSchema = await user.findOne({
            email: request.body.email.toLowerCase()
        });

        userSchema.links += 1;
        userSchema.save();
    };

    await link.create({
        email: request.body.email,
        shortURL: request.body.shortURL,
        longURL: request.body.longURL,
        clicks: 0,
        date: new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' })
    });

    return response.redirect('home');
});

app.listen(process.env.PORT || 3000, () => {
    return console.log('Beep! Running on http://localhost:' + process.env.PORT || 3000);
});