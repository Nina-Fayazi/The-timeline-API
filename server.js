const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const app = express();
const apiRoutes = require('./routes/api');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use(express.static(path.join(__dirname, 'public')));


app.use(apiRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});