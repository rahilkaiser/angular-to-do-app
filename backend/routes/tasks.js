const express = require('express');
const router = express.Router();

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
    res.status(200).json(items);
});

// Create an Task
router.post('/', (req, res) => {
    const { name } = req.body;
    const newItem = { id: items.length + 1, name: name };
    items.push(newItem);
    res.status(201).send(newItem);
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
