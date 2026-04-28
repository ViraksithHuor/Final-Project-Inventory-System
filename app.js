const path = require('path');
require('dotenv').config();

const express = require('express');
const { engine } = require('express-handlebars');
const connectDB = require('./config/db');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

const app = express();

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(cookieParser());

app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000']
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

// Auth
function requireUiAuth(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.redirect('/login');
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.redirect('/login');
  }
}

function requireUiAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'Admin') {
    return res.status(403).send('Forbidden: Admins only');
  }

  next();
}

// UI preview routes
app.get('/', (req, res) => {
  res.redirect('/login');
});

app.get('/login', (req, res) => {
  res.render('login', {
    title: 'Login',
    isAuthPage: true,
    bodyClass: 'auth-only'
  });
});

app.get('/overview', requireUiAuth, (req, res) => {
  res.render('overview', {
    title: 'Overview',
    navOverview: true
  });
});

app.get('/admin', requireUiAuth, requireUiAdmin, (req, res) => {
  res.render('admin/admin-dashboard', {
    title: 'Admin Dashboard',
    navAdmin: true
  });
});

app.get('/admin/create-user', requireUiAuth, requireUiAdmin, (req, res) => {
  res.render('admin/create-user', {
    title: 'Create User',
    navCreateUser: true
  });
});

app.get('/admin/users', requireUiAuth, requireUiAdmin, (req, res) => {
  res.render('admin/user-list', {
    title: 'User List',
    navUsers: true
  });
});

app.get('/admin/users/:id', requireUiAuth, requireUiAdmin, (req, res) => {
  res.render('admin/user-detail', {
    title: 'User Details',
    navUsers: true
  });
});

app.get('/admin/api-keys', requireUiAuth, requireUiAdmin, (req, res) => {
  res.render('admin/api-keys', {
    title: 'API Keys',
    navApiKeys: true
  });
});

app.get('/inventory', requireUiAuth, (req, res) => {
  res.render('inventory/inventory-list', {
    title: 'Inventory',
    navInventory: true
  });
});

app.get('/inventory/create', requireUiAuth, (req, res) => {
  res.render('inventory/create-item', {
    title: 'Create Item',
    navCreateItem: true
  });
});

app.get('/inventory/:id', requireUiAuth, (req, res) => {
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