require('dotenv').config();
const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());





// router
const authRouter = require('./routes/auth');
const dataRouter = require('./routes/data');


app.get('/', (req, res) => {
    res.send('Hello Sangjin');
});


// auth router
app.use('/auth', authRouter);
app.use('/data', dataRouter);




app.listen(3000, '0.0.0.0', () => {
    console.log("==========================================================================================================================================================================================")
    console.log('Server running on port 3000');
  });
  