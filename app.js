const express = require('express');
const app = express();
const userModel = require('./models/user');
const postModel = require('./models/post');

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello, world!');
});

app.get('/create', async (req, res) => {
    try {
        // Create a new user
        let user = await userModel.create({
            username: "ibrahim",
            age: 24,
            email: "ibrahim@gmail.com"
        });

        res.status(201).send(user); // send created user as response
    } catch (err) {
        console.error(err);
        res.status(500).send('Error creating user');
    }
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
