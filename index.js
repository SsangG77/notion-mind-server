require('dotenv').config();
const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());





// router
const authRouter = require('./routes/auth');
const dataRouter = require('./routes/data');


app.get('/', (req, res) => {
    res.send('Hello World');
});


// auth router
app.use('/auth', authRouter);
app.use('/data', dataRouter);



// app.get('/notion/token', (req, res) => {
//     if (!accessToken) {
//         return res.status(400).json({ error: 'No access token available' });
//     }
//     res.json({ access_token: accessToken });
// });

app.listen(3000, () => {
    console.log("==========================================================================================================================================================================================")
    console.log('Server running on port 3000');
});
