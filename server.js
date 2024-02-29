//server.js
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path'); 
const app = express();
const port = 3000;
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'))
app.set('view engine', 'ejs');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/travelAgency')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));



const travelRoutes = require('./routes/travelRoutes');
const staticRoutes = require('./routes/static'); 
const history = require('./routes/tourHistoryRoutes');
const login = require('./routes/login');

app.use('/travel', travelRoutes);
app.use('/', staticRoutes);
app.use('/', history);
app.use('/', login);

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
module.exports = mongoose; // Экспортируем объект Mongoose
