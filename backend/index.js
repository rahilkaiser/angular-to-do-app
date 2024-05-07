const express = require('express');
const app = express();

app.use(express.json()); // Middleware to parse JSON bodies


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
