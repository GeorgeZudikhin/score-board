const express = require('express') // importing the express package
const cors = require('cors') // importing the cors package
const mongoose = require("mongoose");
const app = express() // creating an instance of express

app.use(cors()); // using the cors package

app.use(express.json()); // using the express.json() method
app.use(express.urlencoded({ extended: false })); // using the express.urlencoded() method

// Define Mongoose Schemas for HighScore and User
const highScoreSchema = new mongoose.Schema({
  username: { type: String, required: true },
  score: { type: Number, required: true },
});

///const highScoreListSchema = new mongoose.Schema({
///  highScores: [highScoreSchema]
///});

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minLength: 8 },
  company: { type: String, required: false, default: 'FH Technikum Wien' },
  street: { type: String, required: false },
  city: { type: String, required: false },
  postalCode: { type: Number, required: false },
  token: String,
});

// Create Mongoose models for HighScore and User
const HighScore = mongoose.model('HighScore', highScoreSchema);
//const HighScoreList = mongoose.model('HighScoreList', highScoreListSchema);
const User = mongoose.model('User', userSchema);


app.post('/login', async (req, res, next) => { // creating a post route for the login page
    const { email, password } = req.body; // storing the request body in a variable

    const user = await User.findOne({ email, password });

    // Login Check
    if (user) {
        // User found, send the success response with the authentication token
        const authenticationToken = generateAuthenticationToken();
        user.token = authenticationToken;
        await user.save();

        res.status(200).json({
          message: 'Login successful',
          token: user.token,
        });
    } 
    else {
        // User not found or incorrect credentials, send the error response
        res.status(401).json({
          error: 'Invalid email or password',
        });
    }
});


// POST route for user sign-up
app.post('/users', async (req, res, next) => {

  const { email, password, company, street, city, postalCode } = req.body;

  // Generate an authentication token (a random alphanumeric string)
  const authenticationToken = generateAuthenticationToken();
  console.log('Authentication Token:', authenticationToken);

  // Check if the username already exists
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    return res.status(409).json({ error: 'Username already exists' });
  }

  try {
    const newUser = new User({ 
      email: email, 
      password: password, 
      company: company, 
      street: street, 
      city: city, 
      postalCode: postalCode, 
      token: authenticationToken 
    });

    await newUser.save();

    res.status(201).json({
      message: 'User created successfully',
      token: authenticationToken,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: 'Error occurred while creating user' });
  }

});

// Middleware function to check authentication token
function authenticateToken(req, res, next) {
    const token = req.headers.authorization;
  
    if (!token) {
      return res.status(401).json({ error: 'Missing authentication token' });
    }
  
    // Check if the token exists in the users array
    const user = users.find((user) => user.token === token);
    if (!user) {
      return res.status(401).json({ error: 'Invalid authentication token' });
    }
  
    req.user = user; // Attach the user object to the request
    next();
}


// Apply the middleware to the protected routes
app.use('', authenticateToken);

app.get('', (req, res, next) => {
    res.status(200).json({ message: 'Access granted to the main page' });
});




// Helper function to generate a random alphanumeric token
function generateAuthenticationToken() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const tokenLength = 10;
  let token = '';

  for (let i = 0; i < tokenLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    token += characters.charAt(randomIndex);
  }

  return token;
}

app.post('/highscores', async (req, res, next) => {
    const { username, score } = req.body;
    
    if (!username || !score) {
        return res.status(400).json({ error: 'Username and score are required' });
    }

    const newHighScore = new HighScore({ username, score });
  
    // Saving highscore to the in-memory database
    try {
        await newHighScore.save();
        // Return the success response
        res.status(201).json({ message: 'Highscores submitted successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error occurred while saving highscore' });
    }
});


// GET route to retrieve highscores
app.get('/highscores', async (req, res, next) => {
    // Return the highscores from the MongoDB database
    const highscores = await HighScore.find({});
    res.status(200).json({ highscores });
});


app.delete('/sessions', async (req, res, next) => {
    const token = req.headers.authorization;
  
    // Check if the token exists and remove it from the user object
    if (token) {
      const user = await User.findOne({ token: token });
      if (user) {
        user.token = null;
        await user.save();
        return res.status(200).json({ message: 'Logout successful' });
      }
    }
  
    // If the token is not provided, return 401 Unauthorized
    return res.status(401).json({ error: 'Failed to logout' });
  });
  

/////////////////////////////////////////////////////////////////////////////

/*
app.get('/users/:userid', (req, res) => {
    const userid = req.params.userid;

    User.findOne({
      id: userid
    }).exec()
    .then((user) => {
        res.status(200).json(user);
    })
    .catch((err) => {
        res.status(404).json({
            err: 'err'
        })
    });

    return res.status(404).json({ 
      err: 'err'
    });
});


app.put('/users/:userid', async (req, res, next) => {
  const user = req.body;
  const userid = req.params.userid;

  try{
    await User.findOneAndUpdate({
      id: userid,
    }, {
        email: user.email,
    });
  } catch (err) {
    console.log(err);
    return res.status(404).json({err});
  }

  res.status(200).json({});
});


app.delete('/users/:userid', (req, res) => {
  const userid = req.params.userid;


  User.findByIdAndDelete(userid)
      .exec()
      .then(() => {
          res.status(200).json({
              message: 'User deleted successfully'
          });
      })
      .catch((err) => {
          res.status(404).json({
              err: 'err'
          })
      });


});*/

module.exports = app; // exporting the app module
    