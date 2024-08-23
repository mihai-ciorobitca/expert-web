const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true
}));

app.locals.MAINTENANCE = false;

// Middleware to check maintenance mode
app.use((req, res, next) => {
    if (app.locals.MAINTENANCE && req.path === '/') {
        return res.render('maintenance');
    }
    next();
});

// Route for the index page
app.get('/', (req, res) => {
    res.render('index', {
        username: req.session.username,
        admin: req.session.admin
    });
});

// Route for login page
app.route('/login')
    .get((req, res) => {
        res.render('login');
    })
    .post((req, res) => {
        const { email, password } = req.body;
        if (email === 'mihai@gmail.com' && password === 'Password') {
            req.session.username = 'Mihai';
            return res.redirect('/');
        } else if (email === 'admin@gmail.com' && password === 'Admin') {
            req.session.admin = 'admin';
            return res.redirect('/');
        }
        res.render('login');
    });

// Route for workbook page
app.get('/workbook', (req, res) => {
    if (req.session.username) {
        return res.render('workbook');
    }
    res.redirect('/');
});

// Route for admin page
app.get('/admin', (req, res) => {
    if (req.session.admin) {
        return res.render('admin', { maintenance_status: app.locals.MAINTENANCE });
    }
    res.redirect('/');
});

// Route to toggle maintenance mode
app.get('/admin/change-maintenance', (req, res) => {
    if (req.session.admin) {
        app.locals.MAINTENANCE = !app.locals.MAINTENANCE;
        return res.redirect('/admin');
    }
    res.redirect('/');
});

// Handle 404 errors
app.use((req, res) => {
    res.status(404).render('page404');
});

// Handle 500 errors
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('page500');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
