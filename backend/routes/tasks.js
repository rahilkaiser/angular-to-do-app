const express = require('express');
const router = express.Router();
const db = require('../index.js');

// Mock database
let items = [
    {
        id: 1,
        name: 'Example Item',
        description: "",
        dueDate: new Date('2018-07-01T00:00:00.000Z'),
        createdOn: new Date('2018-07-01T00:00:00.000Z'),
        isComplete: false,
        completedOn: new Date('2018-07-01T00:00:00.000Z'),
    }
];

// Get all Tasks
router.get('/', (req, res) => {
    const sql = 'SELECT * FROM Tasks';

    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(200).json(rows);
    });
});

// Create an Task
router.post('/', (req, res) => {
    // Extract data from the request body
    const { taskName, description, dueDateObj} = req.body;

    if (dueDateObj) {
        var { year, month, day } = dueDateObj;
        var dueDate = new Date(year, month - 1, day);

        // Check if the date conversion was successful
        if (isNaN(dueDate.getTime())) {
            return res.status(400).json({ error: 'Invalid due date format' });
        }
    }
    console.log(dueDateObj)
    console.log(dueDate)

    // Define default values for isComplete and createdOn
    const isComplete = false; // Default value for isComplete
    const createdOn = new Date().toISOString(); // Set createdOn to current date-time in ISO format
    const completedOn = null;

    // SQL query to insert data into the Tasks table
    const sql = `
    INSERT INTO Tasks (taskName, description, dueDate, createdOn, isComplete, completedOn)
    VALUES (?, ?, ?, ?, ?, ?);
    `;

    const dueDateISO = dueDate ? dueDate.toISOString() : null;
    // Parameters to pass into the SQL query
    const params = [taskName, description, dueDateISO, createdOn, isComplete, completedOn];

    // Execute the SQL query to insert the new task
    db.run(sql, params, function(err) {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: err.message });
            return;
        }
        // Respond with the newly created task
        // `this.lastID` gives us the last inserted row id
        res.status(201).json({
            id: this.lastID,
            taskName: taskName,
            description: description,
            dueDate: dueDateISO,
            createdOn: createdOn,
            isComplete: isComplete,
            completedOn: completedOn
        });
    });
});



// Update an Task
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    items = items.map(item => item.id === parseInt(id) ? { ...item, name: name } : item);
    res.status(200).send(items.find(item => item.id === parseInt(id)));
});

// Delete an Task
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    items = items.filter(item => item.id !== parseInt(id));
    res.status(204).send();
});

module.exports = router;
