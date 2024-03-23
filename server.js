const express = require('express');
const app = express();

const loading_router = require("./routes/load_workout_route")
app.use(loading_router);

//for static method
const static_files_router = express.static('static')
app.use( static_files_router )

// for post method
const bodyParser = require('body-parser');
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }))

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Home route
app.get('/', (req, res) => {
  res.render('index');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));