const express = require('express');
const { spawn } = require('child_process');
const path = require('path'); // Import the 'path' module
const app = express.Router();

// Route to handle generating workout plan
app.get('/generate-workout', (req, res) => {
    const numExercises = parseInt(req.query.numExercises) || 3;
    const muscleGroup = req.query.muscleGroup || 'Back';
    const jsonFilePath = getJsonFilePath(muscleGroup); // Get JSON file path based on muscle group
  
    // Spawn a Python child process to run the script
    const pythonProcess = spawn('python', [
      'generate_workout.py',
      jsonFilePath,
      numExercises.toString(),
      muscleGroup
    ]);
  
    let result = '';
  
    // Collect output from the Python script
    pythonProcess.stdout.on('data', (data) => {
      result += data.toString();
    });
  
    // Handle Python script errors
    pythonProcess.stderr.on('data', (data) => {
      console.error(`Python script error: ${data}`);
    });
  
    // Handle Python script exit
    pythonProcess.on('close', (code) => {
      const workoutPlan = JSON.parse(result);
      res.render('testing/workout', { workoutPlan });
    });
  });
  
// Function to get JSON file path based on muscle group
function getJsonFilePath(muscleGroup) {
    // Example logic to determine JSON file path based on muscle group
    if (muscleGroup === 'Back') {
      return 'exercises_back.json';
    } else if (muscleGroup === 'Legs') {
      return 'exercises_legs.json'
    } else {
      return 'exercises.json'
    }
  }



  module.exports = app