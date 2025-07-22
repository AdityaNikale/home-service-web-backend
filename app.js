const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({
  origin: "https://ruralcrew.onrender.com", 
  credentials: true
}));
app.use(express.json());
const dotenv = require('dotenv');

const PORT = process.env.PORT || 3000;

dotenv.config();
const connectDB = require('./db');
const registerRoute = require('./routes/registerRoute');

// console.log('register', registerRoute);

connectDB();

app.use('/api', registerRoute);

app.get('/', function (req, res) {
    res.send("hello world!");
})
 

app.listen(PORT, () => {
    console.log("server is running at port 3000");
    
})