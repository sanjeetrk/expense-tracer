const express = require('express');
const BodyParser = require('body-parser');
const app = express();
require('dotenv').config();
const Cors = require('cors');
const AuthRouter = require('./routes/AuthRouter');
const ProductRouter = require('./routes/ProductRouter');
const ExpenseRouter = require('./routes/ExpenseRouter');
const ensureAuthenticated = require('./moddlewares/Auth');

require('./models/db');

const PORT = process.env.PORT || 8000;



app.use(BodyParser.json());
app.use(Cors());

app.get('/ping', (req, res) => {
    res.send('pong');
});


app.use('/auth', AuthRouter);
app.use('/products', ProductRouter);
app.use('/expenses',ensureAuthenticated ,ExpenseRouter) 

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
