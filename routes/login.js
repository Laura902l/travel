const express = require('express');
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const router = express.Router();
const { Schema, model } = require('mongoose');

router.get('/register', (req, res) => {
    res.render("signUp");
});

const userSchema = new Schema({
    username: 'String',
    password: 'String'
});

router.use(session({
    secret: 'This is my secret',
    resave: false,
    saveUninitialized: false,
}));

router.use(passport.initialize());
router.use(passport.session());

// mongoose.connect('mongodb://127.0.0.1:27017/userAuth', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     useCreateIndex: true 
// })
// .then(() => {
//     console.log("MongoDB connected");
// })
// .catch((err) => {
//     console.error("MongoDB connection error:", err);
// });

userSchema.plugin(passportLocalMongoose);

const UserAuthModel = model('authen', userSchema);

passport.use(UserAuthModel.createStrategy());
passport.serializeUser(UserAuthModel.serializeUser());
passport.deserializeUser(UserAuthModel.deserializeUser());

// router.get('/secret', (req, res) => {
//     if (req.isAuthenticated()) {
//         res.render('secret');
//     } else {
//         res.send("invalid");
//     }
// });
router.get('/secret', (req, res) => {
    if (req.isAuthenticated()) {
        res.render('secret', { username: req.user.username }); 
    } else {
        res.render('login');
    }
});
router.get('/logout', (req, res) => {
    req.logout(function (err) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/register');
        }
    });
});

router.get('/login', (req, res) => {
    res.render('login');
});

// router.post('/login', (req, res) => {
//     const username = req.body.username;
//     const password = req.body.password;
//     const user = new UserAuthModel({
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
//     UserAuthModel.register({ username: req.body.username }, req.body.password, function (err, user) {
//         if (err) {
//             console.log(err);
//         } else {
//             passport.authenticate('local')(req, res, function () {
//                 res.redirect('/secret');
//             });
//         }
//     });
// });
router.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    UserAuthModel.findOne({ username: username })
        .then(user => {
            if (!user) {
                console.log('"User not found');
                res.send('<script>alert(""User not found"); window.location.href = "/login";</script>');
            } else {
                passport.authenticate('local')(req, res, function () {
                    res.redirect('/secret');
                });
            }
        })
        .catch(err => {
            console.error(err);
            res.redirect('/');
        });
});


router.post('/register', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    try {
        const existingUser = await UserAuthModel.findOne({ username: username });
        if (existingUser) {
            console.log('A user with this name already exists');
            res.send('<script>alert("A user with this name already exists"); window.location.href = "/register";</script>');
        } else {
            await UserAuthModel.register({ username: username }, password);
            passport.authenticate('local')(req, res, function () {
                res.redirect('/secret');
            });
        }
    } catch (err) {
        console.error(err);
        res.redirect('/');
    }
});



module.exports = router;