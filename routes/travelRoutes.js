//router/travelRoutes.js

const fs = require('fs');
const express = require('express');
const app = express();
const methodOverride = require('method-override');
const axios = require('axios');
const path = require('path');
const tourHistoryFilePath = path.join(__dirname, 'tourHistory.json');
const tourHistory = [];
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');

const router = express.Router();
const ejs = require('ejs');


router.use(express.urlencoded({ extended: true })); 


router.get('/', (req, res) => {
    res.render('home');
});
// mongoose.connect('mongodb://localhost:27017/travelAgency')
//     .then(() => console.log('MongoDB connected'))
//     .catch(err => console.error('MongoDB connection error:', err));
// ;

const BookingSchema = new mongoose.Schema({
    username: String,
    flightNumber: String,
    cityName: String,
    adults: Number,
    children: Number,
    phone: String,
    hotelRating: Number,
    formattedDateArrival: String,
    formattedDateDeparture: String,
   
});


const userSchema = new mongoose.Schema({
    username: String,
    password: String
});

module.exports = {
    Booking: mongoose.model('Booking', BookingSchema)
};
const Booking = mongoose.model('Booking', BookingSchema);

// userSchema.plugin(passportLocalMongoose);
// passport.serializeUser((user, done) => {
//     done(null, user.id);
// });

// const User = mongoose.model('User', userSchema);
// passport.use(User.createStrategy());
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

// router.get('/register', (req, res) => {
//     res.render("signUp");
// });

// router.use(session({
//     secret: 'secret',
//     resave: false,
//     saveUninitialized: false
// }));
// router.use(passport.initialize());
// router.use(passport.session());

// router.get('/logout', (req, res) => {
//     req.logout(function (err) {
//         if (err) {
//             console.log(err);
//         } else {
//             res.redirect('/register');
//         }
//     });
// });

// router.get('/login', (req, res) => {
//     res.render('login');
// });


// router.post('/login', (req, res) => {
//     const username = req.body.username;
//     const password = req.body.password;
//     const user = new User({
//         username: username,
//         password: password,
//     });
//     req.login(user, function (err) {
//         if (err) {
//             console.log(err);
//         } else {
//             passport.authenticate('local')(req, res, function () {
//                 res.redirect('/secret');
//             });
//         }
//     });
// });

// router.post('/register', async (req, res) => {
//     // User.register({ username: req.body.username }, req.body.password, function (err, user) {
//     //     if (err) {
//     //         console.log(err);
//     //     } else {
//     //         passport.authenticate('local')(req, res, function () {
//     //             res.redirect('/secret');
//     //         });
//     //     }
//     // });
//     res.send('registered')
// });
// router.get('/secret', (req, res) => {
//     if (req.isAuthenticated()) {
//         res.render('secret');
//     } else {
//         res.send("sorry");
//     }
// });

const generateRandomAlphaNumeric = (length) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
    }
    return result;
};

const generateRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

router.post('/submitForm', async (req, res) => {
    try {
        const cityName = req.body.cityName;
        const adults = parseInt(req.body.adults) || 0;
        const children = parseInt(req.body.children) || 0;
        const phone = req.body.phone;
        const hotelRating = parseInt(req.body.hotelRating) || 1;
        const dateArrival = new Date(req.body.dateArrival);
        const dateDeparture = new Date(req.body.dateDeparture);
        const weatherCondition = req.body.weatherCondition;
        console.log('Before API call');

        const formattedDateArrival = dateArrival.toLocaleString('en-US', { timeZone: 'UTC' });
        const formattedDateDeparture = dateDeparture.toLocaleString('en-US', { timeZone: 'UTC' });
        const apiKey = 'd680bf725eceee752a55d0d17100d4a7';
        const weatherResponse = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${cityName}&APPID=${apiKey}&units=metric`);
        console.log('Weather Description:', weatherResponse.data.weather[0].description);

        const weatherData = {
            location: weatherResponse.data.name,
            temperature: weatherResponse.data.main.temp,
            condition: weatherResponse.data.weather[0].description,
            humidity: weatherResponse.data.main.humidity,
            windSpeed: weatherResponse.data.wind.speed,
            clouds: weatherResponse.data.clouds.all
        };

        if (['mist', 'broken clouds', 'haze'].includes(weatherResponse.data.weather[0].description)) {
            return res.render('cancel');
        } else {
            let baseCost;
            if (['Cairo', 'Berlin', 'San Carlos'].includes(cityName)) {
                baseCost = (adults + 0.5 * children) * 1500;
                baseCost *= hotelRating;
            } else if (['Sydney', 'Beijing', 'Dubai'].includes(cityName)) {
                baseCost = (adults + 0.5 * children) * 1000;
                baseCost *= hotelRating;
            } else {
                const durationInDays = Math.ceil((dateDeparture - dateArrival) / (1000 * 60 * 60 * 24));
                baseCost = (adults + 0.5 * children) * 1250;
                baseCost *= hotelRating; // Increase cost based on hotel rating
                console.log("baseCost", baseCost)
            }

            const discountForChildren = children > 5 ? 0.1 * baseCost : 0; // 10% discount if more than 5 children

            // Total cost
            const totalCost = baseCost - discountForChildren;
            console.log("totalCost", totalCost)

            const flightNumber = generateRandomAlphaNumeric(2).toUpperCase() + generateRandomNumber(1000, 9999);
            const booking = new Booking({
                flightNumber,
                cityName,
                adults,
                children,
                phone,
                hotelRating,
                formattedDateArrival,
                formattedDateDeparture,
            });
            await booking.save();

            const bookingDetails = {
                flightNumber,
                cityName,
                adults,
                children,
                phone,
                hotelRating,
                formattedDateArrival,
                formattedDateDeparture,
                totalCost
            };
            tourHistory.push(bookingDetails);

            fs.writeFileSync(tourHistoryFilePath, JSON.stringify(tourHistory, null, 2));

            res.render('result', {
                flightNumber,
                cityName,
                adults,
                children,
                phone,
                hotelRating,
                formattedDateArrival,
                formattedDateDeparture,
                totalCost,
            });
        }
    } catch (error) {
        console.error('Error processing form submission:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
router.get('/weather/:city', async (req, res) => {
    console.log('Weather route called');
    try {
        const apiKey = 'd680bf725eceee752a55d0d17100d4a7';
        const cityName = req.params.city || 'Moscow'; // Get the city name from the route parameter

        // Step 1: Find the city ID by name
        const citySearchResponse = await axios.get(`http://api.openweathermap.org/data/2.5/find?q=${cityName}&type=like&sort=population&APPID=${apiKey}`);

        if (!citySearchResponse.data || !citySearchResponse.data.list || citySearchResponse.data.list.length === 0) {
            throw new Error('City not found');
        }

        // Step 2: Get weather information using the city ID
        const cityId = citySearchResponse.data.list[0].id;
        const weatherResponse = await axios.get(`http://api.openweathermap.org/data/2.5/weather?id=${cityId}&lang=en&units=metric&APPID=${apiKey}`);

        if (!weatherResponse.data || !weatherResponse.data.name) {
            throw new Error('Weather data not found');
        }

        // Extract relevant weather information from the API response
        const weatherData = {
            location: weatherResponse.data.name,
            temperature: weatherResponse.data.main.temp,
            condition: weatherResponse.data.weather[0].description,
            humidity: weatherResponse.data.main.humidity,
            windSpeed: weatherResponse.data.wind.speed,
            clouds: weatherResponse.data.clouds.all
        };

        // Send the weather information as a JSON response
        res.json(weatherData);
    } catch (error) {
        // Handle errors
        console.error('Error fetching weather data:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
   
    }
});
router.get('/travelagency', (req, res) => {
    const filePath = path.join(__dirname, '../public/html', 'index.html');
    res.sendFile(filePath);
});

router.get('/cancel', (req, res) => {
    const alertMessage = 'Your cancellation message here';
    res.render('cancel', { alertMessage });
});
router.get('/tourHistory', (req, res) => {
    res.render('tourHistory', { tourHistory });
});

module.exports = router;