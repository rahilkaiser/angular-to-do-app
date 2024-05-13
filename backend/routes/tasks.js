const express = require('express');
const router = express.Router();
const db = require('../index.js');

// Get all Tasks
router.get('/', (req, res) => {
    const isComplete = req.query.isComplete; // Get the query parameter

    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const offset = (page - 1) * pageSize;

    let sql = `SELECT * FROM Tasks LIMIT ? OFFSET ?`;

    if (isComplete === "true" ) {
        sql += ' WHERE isComplete = 1';
    }

    db.all(sql, [pageSize, offset], (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: err.message });
            return;
        }
        db.get("SELECT COUNT(id) AS count FROM Tasks", [], (err, countResult) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ data: rows, total: countResult.count });
        });
    });
});

// Create a Task
router.post('/', (req, res) => {
    const { taskName, description, dueDateObj} = req.body;

    if (dueDateObj) {
        var { year, month, day } = dueDateObj;
        var dueDate = new Date(year, month - 1, day);


        if (isNaN(dueDate.getTime())) {
            return res.status(400).json({ error: 'Invalid due date format' });
        }
    }


    const isComplete = false;
    const createdOn = new Date().toISOString();
    const completedOn = null;


    const sql = `
    INSERT INTO Tasks (taskName, description, dueDate, createdOn, isComplete, completedOn)
    VALUES (?, ?, ?, ?, ?, ?);
    `;

    const dueDateISO = dueDate ? dueDate.toISOString() : null;

    const params = [taskName, description, dueDateISO, createdOn, isComplete, completedOn];


    db.run(sql, params, function(err) {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: err.message });
            return;
        }

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
    const { taskName, description, dueDateObj, isComplete } = req.body;

    if (dueDateObj) {
        var { year, month, day } = dueDateObj;
        var dueDate = new Date(year, month - 1, day);

        // Check if the date conversion was successful
        if (isNaN(dueDate.getTime())) {
            return res.status(400).json({ error: 'Invalid due date format' });
        }
    }

    const sql = `UPDATE Tasks SET taskName = ?, description = ?, dueDate = ?, isComplete = ? WHERE id = ?`;

    const dueDateISO = dueDate ? dueDate.toISOString() : null;

    db.run(sql, [taskName, description, dueDateISO, isComplete, id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Task updated', id: this.lastID });
    });
});

// Delete a task by ID
router.delete('/:id', (req, res) => {
    const { id } = req.params;

    const sql = 'DELETE FROM Tasks WHERE id = ?';
    db.run(sql, id, function(err) {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: err.message });
            return;
        }
        // Check if any row was deleted
        if (this.changes > 0) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'No task found with the given ID' });
        }
    });
});

// Toggle task completion status
router.put('/:id/toggle-complete', (req, res) => {
    const { id } = req.params;
    const { isComplete } = req.body;

    const sql = `UPDATE Tasks SET isComplete = ? WHERE id = ?`;

    db.run(sql, [isComplete, id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Task completion status updated', id: id, isComplete: isComplete });
    });
});

module.exports = router;
