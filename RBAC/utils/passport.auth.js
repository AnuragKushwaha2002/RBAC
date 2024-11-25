const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user.model');

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',  // Using email as the username field
      passwordField: 'password',  // Password field for authentication
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });

        // If user doesn't exist
        if (!user) {
          return done(null, false, { message: 'Username/email not registered' });
        }

        // Check if the user status is 'INACTIVE'
        if (user.status === 'INACTIVE') {
          return done(null, false, { message: 'Your account is inactive. Please contact the admin.' });
        }

        // Validate the password
        const isMatch = await user.isValidPassword(password);
        if (isMatch) {
          return done(null, user);  // User is authenticated
        } else {
          return done(null, false, { message: 'Incorrect password' });
        }
      } catch (error) {
        // Handle errors during the login process
        return done(error);  // Pass the error to the done callback
      }
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user.id);  // Serialize user based on their ID
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);  // Deserialize user based on their ID
  });
});
