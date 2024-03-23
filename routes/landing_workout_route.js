const express = require('express');
const app = express.Router();


app.get('/generate-workout', async (req,res) =>{
    
	res.render("landing/landing.ejs")
})

module.exports = app