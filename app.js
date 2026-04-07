require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const rateLimit = require('express-rate-limit');

const morgan = require('morgan');
const cors = require('cors');

const app = express();

connectDB();

app.use(express.json());
app.use(morgan('dev'));
app.use(cors({
    origin: 'http://localhost:3000'
}));

app.use(rateLimit({
    windowMs: 60 * 1000,
    max: 20
}))

app.get('/', (req, res) => {
  res.send('API running');
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/items', require('./routes/itemRoutes'));
app.use('/api/transactions', require('./routes/transactionRoutes'));
app.use('/api/keys', require('./routes/apiKeyRoutes'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));