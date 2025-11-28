const express = require('express');
const app = express();
const userModel = require('./models/user');
const postModel = require('./models/post');

const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Home Page
app.get('/', (req, res) => {
    res.render('index');
});

// Login Page
app.get('/login', (req, res) => {
    res.render('login');
});

// Login POST
app.post('/login', async (req, res) => {
    let { email, password } = req.body;

    try {
        const user = await userModel.findOne({ email });
        if (!user) return res.send("User not found");

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.send("Incorrect password");

        // JWT Token
        let token = jwt.sign(
            { userId: user._id, email: user.email },
            "shhhh",
            { expiresIn: '1h' }
        );

        // Set cookie
        res.cookie("token", token, { httpOnly: true });

        // Redirect to profile
        res.redirect('/profile');

    } catch (err) {
        console.log(err);
        res.status(500).send("Server error");
    }
});

// ---------------------------
// Profile Route (Protected)
// ---------------------------

// Middleware to check JWT
function authMiddleware(req, res, next) {
    const token = req.cookies.token;
    if (!token) return res.redirect('/login');

    try {
        const decoded = jwt.verify(token, "shhhh");
        req.user = decoded; // userId and email available
        next();
    } catch (err) {
        res.redirect('/login');
    }
}

// Profile Page
app.get('/profile', authMiddleware, async (req, res) => {
    try {
        const user = await userModel.findById(req.user.userId);
        if (!user) return res.redirect('/login'); // fixed redirect from /profile to /login

        res.render('profile', { user }); // profile.ejs render
    } catch (err) {
        res.status(500).send("Server error");
    }
});

// LOGOUT ROUTE
app.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/login'); // redirect to login after logout
});

// REGISTER ROUTE
app.post('/register', async (req, res) => {
    let { name, email, password, username, age } = req.body;

    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, async (err, hash) => {

            let user = await userModel.create({
                name,
                username,
                email,
                age,
                password: hash,
            });

            let token = jwt.sign(
                { email: user.email, userId: user._id },
                "shhhh"
            );

            res.cookie("token", token);
            res.redirect('/profile'); // redirect to profile after registration
        });
    });
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
