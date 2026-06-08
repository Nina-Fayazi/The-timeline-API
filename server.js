const express = require('express');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/database');
const apiRoutes = require('./routes/api');

const app = express();


connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(apiRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});