const express = require('express');
const app = express();
const { User } = require('./db');

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get('/', async (req, res, next) => {
  try {
    res.send('<h1>Welcome to Loginopolis!</h1><p>Log in via POST /login or register via POST /register</p>');
  } catch (error) {
    console.error(error);
    next(error)
  }
});

// POST /register
// TODO - takes req.body of {username, password} and creates a new user with the hashed password

app.post('/register', async (req, res, next) => {
  try {
    const {username, password} = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({username, password: hashedPassword});
    res.send(`successfully created user ${username}`);
  } catch (error) {
    console.error(error);
    next(error);
  }
});
// POST /login
// TODO - takes req.body of {username, password}, finds user by username, and compares the password with the hashed version from the DB
app.post('/login', async (req, res, next) => {
  try {
    const {username, password} = req.body;
    const user = await User.findOne({where: {username}});
    if (!user) {
      res.status(401).send('Invalid username or password');
      return;
    } 
    const passwordMatch = await bcrypt.compare(password, user.password);  
    if (passwordMatch) {
      res.send(`successfully logged in user ${username}`);
    } else {
      res.status(401).send('Invalid username or password');
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// we export the app, not listening in here, so that we can run tests
module.exports = app;
