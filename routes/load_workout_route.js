const express = require('express');
const { spawn } = require('child_process');
const path = require('path');
const app = express.Router();
const bodyParser = require('body-parser');
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// Route to handle generating workout plan
app.post('/generate-workout', (req, res) => {
    console.log("pt 2: ", req.body)
    const workoutType = req.body.workoutType;
    const givenTime = req.body.time;
    const difficulty = req.body.difficulty;
    const muscle_groups = req.body.muscle || [];
    const jsonFilePath = getJsonFilePath(workoutType); // Get JSON file path based on muscle group

    // Check for valid values
    if (givenTime === undefined || isNaN(givenTime) || givenTime <= 0 || muscle_groups.length == 0) {
        // Redirect to error page
        return res.redirect('/error');
    }

    // Spawn a Python child process to run the script 
    const pythonProcess = spawn('python', [
        'generate_workout.py',
        jsonFilePath,
        givenTime.toString(),
        difficulty.toString(),
        JSON.stringify(muscle_groups), // Convert exercisesList to JSON string
    ]);
  
    // Handle data from Python script
    pythonProcess.stdout.on('data', (data) => {
        // Process the data and send to EJS template
        const workoutPlan = JSON.parse(data);
        workoutPlan.forEach(exercise => {
            exercise.img = exercise.img.replace("/img", "img")
          });
          console.log("pt 3", workoutPlan)
        res.render('landing/landing', { workoutPlan });
    });

    // Handle errors
    pythonProcess.stderr.on('data', (data) => {
        console.error(`Error from Python script: ${data}`);
        // Redirect to error page
        res.redirect('/error');
    });
});

// Error route
app.get('/error', (req, res) => {
    res.render('testing/error');
});

app.get('/information', (req, res) =>{
    res.render('landing/information')
})

// Function to get JSON file path based on muscle group
function getJsonFilePath(workoutType) {
    // Example logic to determine JSON file path based on muscle group
    if(workoutType && workoutType.toLowerCase() == "on"){
        return "exercise_json/gym/exercises.json";
    } else{
        return "exercise_json/calisthenics/exercises.json"
    }
}

module.exports = app;