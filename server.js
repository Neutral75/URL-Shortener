const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

mongoose.connect(`${process.env.mongodbURL}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});


app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, './Views')));

app.set('views', path.join(__dirname, './Views'));
app.set('view engine', 'ejs');

app.get('/' || '/home', async (request, response) => {
    return response.render('home');
});

app.listen(process.env.PORT || 3000, () => {
    console.log('Beep!');
});