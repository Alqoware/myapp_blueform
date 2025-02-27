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
app.use(cors()); 
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 1000000 }))// Allow external access
app.use(bodyParser.json({limit:"50mb"})); // Parse JSON requests

// Temporary storage (Replace with a database later)
let storedData = [];

// POST route to receive data from Make.com
app.post("/api/data", (req, res) => {
    const { author, date, text } = req.body;

    if (!author || !date || !text) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const newData = { author, date, text }; 

    storedData.push(newData);

    console.log("Received Data:", newData); // Debugging log
    console.log("Received data:", { author, date, text });
    res.status(201).json({ message: "Data received", data: newData });
});

// GET route to retrieve stored data
app.get("/api/data", (req, res) => {
    res.json(storedData);
});

//add
app.post("/api/add", (req, res) => {
    console.log(req.body);
    storedData.push(req.body);
    res.json({ message: "Data added" });
})

//update
app.post("/api/update", (req, res) => {
    let index = storedData.findIndex(x => x.id == req.body.id)

    storedData[index]= {...storedData[index], ...req.body}
    console.log(req.body);
    storedData.push(req.body);
    res.json({ message: "Data updated" });
});
//delete
app.post("/api/delete", (req, res) => {
    let index = storedData.findIndex(x => x.id == req.body.id);

    if (index !== -1) {
        storedData.splice(index, 1);
        res.json({ message: "Data deleted" });
    } else {
        res.status(404).json({ message: "Data not found" });
    }
});


// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});