// require('dotenv').config();
// const express = require('express');
// const connectDB = require('./config/db');
// const rateLimit = require('express-rate-limit');

// const morgan = require('morgan');
// const cors = require('cors');

// const app = express();

// // connectDB();

// app.use(express.json());
// app.use(morgan('dev'));
// app.use(cors({
//     origin: 'http://localhost:3000'
// }));

// app.use(rateLimit({
//     windowMs: 60 * 1000,
//     max: 20
// }))

// app.get('/', (req, res) => {
//   res.send('API running');
// });

// app.use('/api/auth', require('./routes/authRoutes'));
// app.use('/api/users', require('./routes/userRoutes'));
// app.use('/api/items', require('./routes/itemRoutes'));
// app.use('/api/transactions', require('./routes/transactionRoutes'));
// app.use('/api/keys', require('./routes/apiKeyRoutes'));

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const path = require('path');
require('dotenv').config();

const express = require('express');
const { engine } = require('express-handlebars');
const connectDB = require('./config/db');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

// connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.use(cors({
  origin: 'http://localhost:3000'
}));

app.use(rateLimit({
  windowMs: 60 * 1000,
  max: 20
}));

// Handlebars setup
app.engine('handlebars', engine({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// UI preview routes
app.get('/', (req, res) => {
  res.redirect('/login');
});

app.get('/login', (req, res) => {
  res.render('login', {
    title: 'Login',
    isAuthPage: true
  });
});

app.get('/overview', (req, res) => {
  res.render('overview', {
    title: 'Overview',
    navOverview: true
  });
});

app.get('/admin', (req, res) => {
  res.render('admin/admin-dashboard', {
    title: 'Admin Dashboard',
    navAdmin: true
  });
});

app.get('/admin/create-user', (req, res) => {
  res.render('admin/create-user', {
    title: 'Create User',
    navCreateUser: true
  });
});

app.get('/admin/users', (req, res) => {
  res.render('admin/user-list', {
    title: 'User List',
    navUsers: true
  });
});

app.get('/admin/users/:id', (req, res) => {
  res.render('admin/user-detail', {
    title: 'User Details',
    navUsers: true
  });
});

app.get('/admin/api-keys', (req, res) => {
  res.render('admin/api-keys', {
    title: 'API Keys',
    navApiKeys: true
  });
});

app.get('/inventory', (req, res) => {
  res.render('inventory/inventory-list', {
    title: 'Inventory',
    navInventory: true
  });
});

app.get('/inventory/create', (req, res) => {
  res.render('inventory/create-item', {
    title: 'Create Item',
    navCreateItem: true
  });
});

app.get('/inventory/:id', (req, res) => {
  res.render('inventory/item-detail', {
    title: 'Item Details',
    navInventory: true
  });
});

// Existing API routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/items', require('./routes/itemRoutes'));
app.use('/api/transactions', require('./routes/transactionRoutes'));
app.use('/api/keys', require('./routes/apiKeyRoutes'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));