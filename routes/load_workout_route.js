const express = require('express');
const { spawn } = require('child_process');
const path = require('path');
const app = express.Router();

// Route to handle generating workout plan
app.post('/generate-workout', (req, res) => {
    const workoutType = req.body.workoutType;
    const givenTime = req.body.givenTime;
    const difficulty = req.body.difficulty;
    const muscle_groups = req.body.muscle_group_list || [];
    const jsonFilePath = getJsonFilePath(workoutType); // Get JSON file path based on muscle group
    
    // Check for valid values
    if (givenTime === undefined || isNaN(givenTime) || givenTime <= 0 || muscleGroup === 'fail') {
        // Redirect to error page
        return res.redirect('/error');
    }

    // Spawn a Python child process to run the script 
    const pythonProcess = spawn('python', [
        'generate_workout.py',
        jsonFilePath,
        givenTime.toString(),
        difficulty.toString(),
        JSON.stringify(exercisesList), // Convert exercisesList to JSON string
    ]);
  
    let result = '';
  
    // Collect output from the Python script
    pythonProcess.stdout.on('data', (data) => {
        result += data.toString();
    });
  
    // Handle data from Python script
    pythonProcess.stdout.on('data', (data) => {
        // Process the data and send to EJS template
        const workoutPlan = JSON.parse(data);
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

// Function to get JSON file path based on muscle group
function getJsonFilePath(muscleGroup, workoutType) {
    // Example logic to determine JSON file path based on muscle group
    if(workoutType && workoutType.toLowerCase() === "gym"){
        return "exercise_json/gym/exercises.json";
    } else{
        return "exercise_json/calisthenics/exercises.json"
    }
}

module.exports = app;