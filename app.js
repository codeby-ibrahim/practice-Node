const express = require('Express');
const app = express();

app.get('/', (req, res) => {
    res.send('Well come')
})

app.listen(3000)