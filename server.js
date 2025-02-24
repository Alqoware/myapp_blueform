// const app = require('express')();
// const PORT = 5050;

// \
// app.listen=(
//     PORT,
//     () => console.log('listening on http://localhost:${PORT}'))
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Allow external access
app.use(bodyParser.json()); // Parse JSON requests

// Temporary storage (Replace with a database later)
let storedData = [];

// POST route to receive data from Make.com
app.post("/api/data", (req, res) => {
    const { author, date, time } = req.body;

    if (!author || !date || !time) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const newData = { author, date, time };
    storedData.push(newData);

    console.log("Received Data:", newData); // Debugging log
    res.status(201).json({ message: "Data received", data: newData });
});

// GET route to retrieve stored data
app.get("/api/data", (req, res) => {
    res.json(storedData);
});

app.post("/api/update", (req, res) => {
    console.log(req.body);
    storedData.push(req.body);
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

