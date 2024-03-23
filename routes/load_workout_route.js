const express = require('express');
const { spawn } = require('child_process');
const path = require('path');
const app = express.Router();

// Route to handle generating workout plan
app.get('/generate-workout', (req, res) => {
    const muscleGroup = req.query.muscleGroup || 'fail';
    const workoutType = req.query.workoutType;
    const givenTime = req.query.givenTime;
    const difficulty = req.query.difficulty;
    const jsonFilePath = getJsonFilePath(muscleGroup, workoutType); // Get JSON file path based on muscle group

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
        res.render('testing/workout', { workoutPlan });
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
        if (muscleGroup && muscleGroup.toLowerCase() === 'back') {
            return "exercise_json/gym/exercises_back.json";
        } else if (muscleGroup && muscleGroup.toLowerCase() === 'legs') {
            return 'exercise_json/gym/exercises_legs.json';
        } else {
            return 'exercise_json/gym/exercises.json';
        }
    } else if(workoutType && workoutType.toLowerCase() === "cali"){
        if (muscleGroup && muscleGroup.toLowerCase() === 'back') {
            return 'exercise_json/cali/exercises_back.json';
        } else if (muscleGroup && muscleGroup.toLowerCase() === 'legs') {
            return 'exercise_json/cali/exercises_legs.json';
        } else {
            return 'exercise_json/cali/exercises.json';
        }
    } else {
        return 'exercise_json/default.json'; // Handle default case
    }
}

module.exports = app;