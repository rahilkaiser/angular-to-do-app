const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const app = express();

app.use(express.json()); // Middleware to parse JSON bodies

app.use(cors({
    origin: 'http://localhost:4200',
    methods: 'GET,POST,PUT,DELETE',
    credentials: true
}));

const db = new sqlite3.Database('./mydb.db', (err) => {
    if (err) {
        console.error('Error opening database', err);
    } else {
        console.log('Database connected!');
        db.run('CREATE TABLE IF NOT EXISTS Tasks (' +
            'id INTEGER PRIMARY KEY, ' +
            'taskName TEXT NOT NULL, ' +
            'description TEXT, ' +
            'dueDateObj DATETIME, ' +
            'createdOn DATETIME, ' +
            'isComplete BOOLEAN, ' +
            'completedOn DATETIME' +
            ');', (err) => {
            if (err) {
                console.error("Error creating table", err);
            }
        });

    }
});

module.exports = db;


app.get('/', (req, res) => {
    res.send('hello world')
})

const itemsRouter = require('./routes/tasks');
const apiRouter = express.Router();
apiRouter.use('/tasks', itemsRouter);
app.use('/api', apiRouter);

app.get('/', (req, res) => {
    res.send('Welcome to the API!');
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
