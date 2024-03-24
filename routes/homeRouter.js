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

// Muscle Group
const muscleGroup = [
	{ name: "Back", value: "back" }, 
	{ name: "Chest", value: "chest" },
	{ name: "Shoulder", value: "shoulders" }, 
	{ name: "Legs", value: "legs" }, 
	{ name: "Bicep", value: "biceps" }, 
	{ name: "Tricep", value: "triceps" }, 
	{ name: "Abs", value: "abs" }, 
]

// Get Request to Home Page
app.get('/', (req,res) =>{
	res.render("index.ejs", { workoutCategory })
})

app.post('/workoutform', (req,res) => {
	const category = req.body.category;

	res.render("formPage/workoutForm.ejs", { workoutCategory, muscleGroup, category })
})

app.get('/workoutform', (req, res) => {
	res.render("formPage/workoutForm.ejs", { workoutCategory, muscleGroup, category: null })
});

app.post('/loading', async (req,res) =>{
	const workoutType = req.body.btnradio; // Retrieves the value of the selected radio button
	console.log("pt 1: ", req.body)
    const muscleGroups = req.body.muscleGroup; // Retrieves an array of selected muscle groups (since it's checkboxes)
    const difficulty = req.body.experience; // Retrieves the value of the input field for gym experience
    const time = req.body.time;

    res.render("formPage/loading.ejs", { workoutType, muscleGroups, difficulty, time })

	// Await until clothing sort algorithm completes running. Render display page after. 
})

module.exports = app