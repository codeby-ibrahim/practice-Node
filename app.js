const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();

app.set('view engine', 'ejs');

// Set views folder explicitly (recommended)
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

app.get('/', (req, res) => {
    res.render('index');  // ✅ Correct
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
