// app.js
const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const Task = require('./models/Task.js'); // Make sure this file exists

const app = express();

// ====== Middleware ======
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true })); // replaces body-parser
app.use(methodOverride('_method'));

// ====== MongoDB Connection ======
mongoose.connect('YOUR_MONGO_URI_HERE', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

// ====== Routes ======

// Home route - list all tasks
app.get('/', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.render('index', { tasks });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Create a new task
app.post('/tasks', async (req, res) => {
    try {
        await Task.create(req.body);
        res.redirect('/');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Edit task page
app.get('/tasks/edit/:id', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        res.render('edit', { task });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Update task
app.put('/tasks/:id', async (req, res) => {
    try {
        await Task.findByIdAndUpdate(req.params.id, req.body);
        res.redirect('/');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Delete task
app.delete('/tasks/:id', async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.id);
        res.redirect('/');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// ====== Start Server ======
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
