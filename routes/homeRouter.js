const express = require('express');
const app = express.Router();

// Adding New Routers
// const loading_router = require("./routes/load_workout_route")
// app.use(loading_router);

// Body Parser Middleware for processing POST methods
const bodyParser = require('body-parser');
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }))

// Workout Category - Calisthenics or Weights
const workoutCategory = [
	{ name: "Calisthenics", value: "calisthenics" }, 
	{ name: "Weights", value: "weights" }
]

// Get Request to Home Page
app.get('/', (req,res) =>{
	res.render("index.ejs", { workoutCategory })
})

app.post('/workoutform', (req,res) => {
	const category = req.body.category;

	const muscleGroup = [
		{ name: "Back", value: "back" }, 
		{ name: "Chest", value: "chest" }, 
		{ name: "Legs", value: "legs" }, 
		{ name: "Bicep", value: "bicep" }, 
		{ name: "Tricep", value: "tricep" }, 
		{ name: "Abs", value: "abs" }, 
	]

	res.render("formPage/workoutForm.ejs", { workoutCategory, muscleGroup, category })
})

app.post('/loading', async (req,res) =>{
    res.render("formPage/loading.ejs")

	// Await until clothing sort algorithm completes running. Render display page after. 
})

module.exports = app